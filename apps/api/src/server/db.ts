import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import net from 'net';
import { config } from './config.js';
import type { TemplateType, PublicationStatus, TributeStatus, MediaType } from '../types.js';

// Prisma singleton with suppressed unhandled error spew
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: [], // Suppress loud console outputs when postgres is absent in local session
  });

if (!config.isProduction) globalForPrisma.prisma = prisma;

function checkTcpPort(urlStr: string): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(urlStr);
      const host = parsed.hostname || 'localhost';
      const port = parseInt(parsed.port || '5432', 10);

      const socket = new net.Socket();
      socket.setTimeout(250);

      socket.once('connect', () => {
        socket.destroy();
        resolve(true);
      });
      socket.once('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      socket.once('error', () => {
        socket.destroy();
        resolve(false);
      });

      socket.connect(port, host);
    } catch {
      resolve(false);
    }
  });
}

// Types for in-memory and database operations
export interface InMemoryAdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InMemoryMemorialMedia {
  id: string;
  memorialId: string;
  cloudinaryPublicId: string | null;
  url: string;
  mediaType: MediaType;
  caption: string | null;
  sortOrder: number;
  createdAt: Date;
}

export interface InMemoryTribute {
  id: string;
  memorialId: string;
  visitorName: string;
  relationship: string | null;
  message: string;
  contributorEmail: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

export interface InMemoryMemorial {
  id: string;
  slug: string;
  fullName: string;
  preferredDisplayName?: string | null;
  birthDate?: Date | null;
  showBirthDate?: boolean;
  deathDate?: Date | null;
  showDeathDate?: boolean;
  dateOfBirth: Date | null;
  dateOfPassing: Date | null;
  biography: string;
  memorialLine?: string | null;
  lifeStory: string | null;
  mainPhotograph: string;
  heroBackgroundUrl?: string | null;
  portraitPositionX?: number;
  portraitPositionY?: number;
  serviceTitle?: string | null;
  serviceDate?: Date | null;
  serviceTime?: string | null;
  serviceVenue?: string | null;
  serviceAddress?: string | null;
  viewingWakeInformation?: string | null;
  serviceInformation: string | null;
  familyAcknowledgement: string | null;
  livestreamUrl: string | null;
  recordingUrl: string | null;
  closingWords?: string | null;
  templateType: 'MALE' | 'FEMALE' | 'CHILD';
  publicationStatus: 'DRAFT' | 'PRIVATE_PREVIEW' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
  media?: InMemoryMemorialMedia[];
  tributes?: InMemoryTribute[];
}

function normalizeServiceFields<T extends Record<string, any>>(memorial: T): T {
  let legacyService: Record<string, unknown> = {};
  if (typeof memorial.serviceInformation === 'string') {
    try {
      const parsed = JSON.parse(memorial.serviceInformation);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) legacyService = parsed;
    } catch {
      // Keep legacy plain-text serviceInformation untouched.
    }
  }

  return {
    ...memorial,
    media: Array.isArray(memorial.media)
      ? memorial.media.map((item: Record<string, any>) => ({
          ...item,
          mediaType: item.mediaType ?? 'PHOTO',
          secureUrl: item.secureUrl ?? item.url,
        }))
      : memorial.media,
    preferredDisplayName: memorial.preferredDisplayName ?? null,
    birthDate: memorial.birthDate ?? memorial.dateOfBirth ?? null,
    showBirthDate: memorial.showBirthDate ?? true,
    deathDate: memorial.deathDate ?? memorial.dateOfPassing ?? null,
    showDeathDate: memorial.showDeathDate ?? true,
    serviceTitle: memorial.serviceTitle ?? (typeof legacyService.title === 'string' ? legacyService.title : null),
    serviceDate: memorial.serviceDate ?? (typeof legacyService.date === 'string' ? new Date(legacyService.date) : null),
    serviceTime: memorial.serviceTime ?? (typeof legacyService.time === 'string' ? legacyService.time : null),
    serviceVenue: memorial.serviceVenue ?? (typeof legacyService.venue === 'string' ? legacyService.venue : null),
    serviceAddress: memorial.serviceAddress ?? (typeof legacyService.address === 'string' ? legacyService.address : null),
    viewingWakeInformation: memorial.viewingWakeInformation ?? null,
    memorialLine: memorial.memorialLine ?? null,
    heroBackgroundUrl: memorial.heroBackgroundUrl ?? null,
    portraitPositionX: memorial.portraitPositionX ?? 50,
    portraitPositionY: memorial.portraitPositionY ?? 50,
    closingWords: memorial.closingWords ?? null,
  } as T;
}

function toPublicMemorial<T extends Record<string, any>>(memorial: T): T {
  const normalized = normalizeServiceFields(memorial);
  return {
    ...normalized,
    birthDate: normalized.showBirthDate ? normalized.birthDate : null,
    dateOfBirth: normalized.showBirthDate ? normalized.dateOfBirth : null,
    deathDate: normalized.showDeathDate ? normalized.deathDate : null,
    dateOfPassing: normalized.showDeathDate ? normalized.dateOfPassing : null,
    tributes: Array.isArray(normalized.tributes)
      ? normalized.tributes.map(({ contributorEmail: _privateEmail, ...tribute }: Record<string, any>) => tribute)
      : normalized.tributes,
  } as T;
}

/**
 * Robust Data Store abstraction:
 * Uses PrismaClient when connected to PostgreSQL.
 * If PostgreSQL is unavailable (e.g. initial dev environment without active DB container),
 * gracefully falls back to persistent in-memory repository with pre-seeded sample data.
 */
class MemorialDataStore {
  private isPostgresConnected: boolean | null = null;
  private nextMemoryMemorialId = 0;
  private nextMemoryTributeId = 0;
  private nextMemoryMediaId = 0;
  private memoryAdmins: InMemoryAdminUser[] = [];
  private memoryMemorials: InMemoryMemorial[] = [];
  private memoryMedia: InMemoryMemorialMedia[] = [];
  private memoryTributes: InMemoryTribute[] = [];

  constructor() {
    this.seedInitialInMemoryData();
  }

  private seedInitialInMemoryData() {
    const passwordHash = bcrypt.hashSync(config.admin.password, 10);

    this.memoryAdmins.push({
      id: 'admin-001',
      email: config.admin.email,
      passwordHash,
      name: config.admin.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Sample Memorial 1: Male
    const m1Id = 'mem-001';
    this.memoryMemorials.push({
      id: m1Id,
      slug: 'arthur-pendleton',
      fullName: 'Arthur William Pendleton',
      dateOfBirth: new Date('1942-04-12'),
      dateOfPassing: new Date('2026-01-18'),
      biography: 'A devoted patriarch, master architect, and lifelong mentor whose wisdom and quiet kindness built lasting foundations for all who knew him.',
      lifeStory: 'Born in Edinburgh and raised with a profound reverence for classical craftsmanship, Arthur dedicated four decades to civil architecture before dedicating his retirement to community literacy and botanical conservation. His home was an open sanctuary of laughter, warmth, and steady guidance.',
      mainPhotograph: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
      serviceInformation: JSON.stringify({
        venue: 'St. Jude Chapel of Grace',
        date: '2026-02-04T11:00:00Z',
        address: '420 Cathedral Way, St. Giles',
        reception: 'The Grand Conservatory following the ceremony'
      }),
      familyAcknowledgement: 'The Pendleton family extends their profound gratitude to the compassionate hospice caregivers and all friends whose visits brought comfort.',
      livestreamUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      templateType: 'MALE',
      publicationStatus: 'PUBLISHED',
      createdAt: new Date('2026-01-20'),
      updatedAt: new Date('2026-01-25'),
    });

    this.memoryMedia.push(
      {
        id: 'med-001',
        memorialId: m1Id,
        cloudinaryPublicId: 'pg/arthur-1',
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
        mediaType: 'PHOTO',
        caption: 'Arthur in his architectural studio, 1988',
        sortOrder: 0,
        createdAt: new Date(),
      },
      {
        id: 'med-002',
        memorialId: m1Id,
        cloudinaryPublicId: 'pg/arthur-2',
        url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
        mediaType: 'PHOTO',
        caption: 'Walking the highlands with his grandchildren',
        sortOrder: 1,
        createdAt: new Date(),
      }
    );

    this.memoryTributes.push(
      {
        id: 'trib-001',
        memorialId: m1Id,
        visitorName: 'Eleanor Vance',
        relationship: null,
        message: 'Arthur taught me how to see structure in nature and strength in gentle patience. Rest peacefully, dear friend.',
        contributorEmail: null,
        status: 'APPROVED',
        createdAt: new Date('2026-01-22'),
        updatedAt: new Date('2026-01-22'),
      },
      {
        id: 'trib-002',
        memorialId: m1Id,
        visitorName: 'David K.',
        relationship: null,
        message: 'A true gentleman whose impact will resonate across generations.',
        contributorEmail: null,
        status: 'APPROVED',
        createdAt: new Date('2026-01-23'),
        updatedAt: new Date('2026-01-23'),
      }
    );

    // Sample Memorial 2: Female
    const m2Id = 'mem-002';
    this.memoryMemorials.push({
      id: m2Id,
      slug: 'clara-rose-monroe',
      fullName: 'Clara Rose Monroe',
      dateOfBirth: new Date('1956-08-24'),
      dateOfPassing: new Date('2026-02-10'),
      biography: 'An extraordinary botanist, concert pianist, and matriarch who illuminated every room with effortless warmth and unconditional grace.',
      lifeStory: 'Clara lived with an insatiable curiosity for music and flora. She served as chief botanist at the Highland Botanical Gardens and filled her weekends with impromptu piano recitals that brought neighbors together across decades.',
      mainPhotograph: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
      serviceInformation: JSON.stringify({
        venue: 'Rosewood Memorial Pavilion',
        date: '2026-02-28T14:00:00Z',
        address: '1800 Willowbrook Park, West End',
        reception: 'Garden Pavilion following the service'
      }),
      familyAcknowledgement: 'Our family wishes to thank everyone who sent flowers, shared handwritten notes, and joined us in celebrating Clara’s radiant spirit.',
      livestreamUrl: null, // Test conditional hide
      recordingUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Test conditional recording
      templateType: 'FEMALE',
      publicationStatus: 'PUBLISHED',
      createdAt: new Date('2026-02-12'),
      updatedAt: new Date('2026-02-14'),
    });

    // Sample Memorial 3: Child
    const m3Id = 'mem-003';
    this.memoryMemorials.push({
      id: m3Id,
      slug: 'leo-alexander-brooks',
      fullName: 'Leo Alexander Brooks',
      dateOfBirth: new Date('2018-03-15'),
      dateOfPassing: new Date('2025-11-20'),
      biography: 'A bright, starlit soul whose laughter filled every moment with pure delight and boundless wonder.',
      lifeStory: 'Leo touched more lives in his precious years than many do in a lifetime. His passion for stars, dinosaurs, and sharing his favorite storybooks brought unfathomable warmth to all who were blessed to know him.',
      mainPhotograph: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=80',
      serviceInformation: JSON.stringify({
        venue: 'Starlight Community Meadow',
        date: '2025-12-01T10:30:00Z',
        address: 'Sunrise Glade & Meadow Lane',
        reception: 'Balloon and butterfly tribute at the meadow'
      }),
      familyAcknowledgement: 'The Brooks family thanks the dedicated pediatric team and the countless neighbors who wrapped our family in light.',
      livestreamUrl: null,
      recordingUrl: null,
      templateType: 'CHILD',
      publicationStatus: 'PUBLISHED',
      createdAt: new Date('2025-11-22'),
      updatedAt: new Date('2025-11-25'),
    });

    // Sample Memorial 4: Draft (Should NOT show in public directory)
    this.memoryMemorials.push({
      id: 'mem-004-draft',
      slug: 'harold-montgomery-draft',
      fullName: 'Harold James Montgomery',
      dateOfBirth: new Date('1938-11-04'),
      dateOfPassing: new Date('2026-03-01'),
      biography: 'Draft memorial in preparation by administrators.',
      lifeStory: null,
      mainPhotograph: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
      serviceInformation: null,
      familyAcknowledgement: null,
      livestreamUrl: null,
      recordingUrl: null,
      templateType: 'MALE',
      publicationStatus: 'DRAFT',
      createdAt: new Date('2026-03-02'),
      updatedAt: new Date('2026-03-02'),
    });
  }

  public async checkConnection(): Promise<boolean> {
    if (this.isPostgresConnected !== null) {
      return this.isPostgresConnected;
    }

    // Verify TCP socket connectivity first to avoid Prisma error spew when DB server is absent
    const isPortOpen = await checkTcpPort(config.databaseUrl);
    if (!isPortOpen) {
      this.isPostgresConnected = false;
      return false;
    }

    try {
      await prisma.$queryRaw`SELECT 1`;
      this.isPostgresConnected = true;
      console.log('✅ PostgreSQL connected via Prisma');
      return true;
    } catch {
      this.isPostgresConnected = false;
      return false;
    }
  }

  // Admin User operations
  async findAdminByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (await this.checkConnection()) {
      return prisma.adminUser.findFirst({
        where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      });
    }
    return this.memoryAdmins.find(a => a.email.trim().toLowerCase() === normalizedEmail) || null;
  }

  async findAdminById(id: string) {
    if (await this.checkConnection()) {
      return prisma.adminUser.findUnique({ where: { id } });
    }
    return this.memoryAdmins.find(a => a.id === id) || null;
  }

  async syncConfiguredAdmin() {
    if (!(await this.checkConnection())) {
      throw new Error('Cannot synchronise administrator credentials because PostgreSQL is unavailable');
    }

    const passwordHash = await bcrypt.hash(config.admin.password, 12);
    const normalizedEmail = config.admin.email.trim().toLowerCase();
    const existingAdmin = await prisma.adminUser.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    });

    if (existingAdmin) {
      return prisma.adminUser.update({
        where: { id: existingAdmin.id },
        data: {
          email: normalizedEmail,
          passwordHash,
          name: config.admin.name.trim(),
        },
      });
    }

    return prisma.adminUser.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        name: config.admin.name.trim(),
      },
    });
  }

  // Memorial operations
  async findPublicMemorials(search?: string, summary = false) {
    if (await this.checkConnection()) {
      if (summary) {
        const memorials = await prisma.memorial.findMany({
          where: {
            publicationStatus: 'PUBLISHED',
            ...(search ? { OR: [
              { fullName: { contains: search, mode: 'insensitive' as const } },
              { preferredDisplayName: { contains: search, mode: 'insensitive' as const } },
              { biography: { contains: search, mode: 'insensitive' as const } },
            ] } : {}),
          },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true, slug: true, fullName: true, preferredDisplayName: true,
            birthDate: true, showBirthDate: true, deathDate: true, showDeathDate: true,
            dateOfBirth: true, dateOfPassing: true, biography: true, memorialLine: true,
            mainPhotograph: true, portraitPositionX: true, portraitPositionY: true, livestreamUrl: true, templateType: true,
            publicationStatus: true, createdAt: true,
            _count: { select: { media: true, tributes: { where: { status: 'APPROVED' } } } },
          },
        });
        return memorials.map(memorial => toPublicMemorial(memorial as unknown as Record<string, any>));
      }
      const memorials = await prisma.memorial.findMany({
        where: {
          publicationStatus: 'PUBLISHED',
          ...(search ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { preferredDisplayName: { contains: search, mode: 'insensitive' } },
              { biography: { contains: search, mode: 'insensitive' } },
            ]
          } : {})
        },
        orderBy: { createdAt: 'desc' },
        include: {
          media: { orderBy: { sortOrder: 'asc' } },
          _count: { select: { tributes: { where: { status: 'APPROVED' } } } }
        }
      });
      return memorials.map(memorial => toPublicMemorial(memorial as unknown as Record<string, any>));
    }

    return this.memoryMemorials
      .filter(m => m.publicationStatus === 'PUBLISHED')
      .filter(m => {
        if (!search) return true;
        const q = search.toLowerCase();
        return m.fullName.toLowerCase().includes(q) || (m.preferredDisplayName || '').toLowerCase().includes(q) || m.biography.toLowerCase().includes(q);
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(m => toPublicMemorial({
        ...(summary ? {
          id: m.id, slug: m.slug, fullName: m.fullName, preferredDisplayName: m.preferredDisplayName,
          birthDate: m.birthDate, showBirthDate: m.showBirthDate,
          deathDate: m.deathDate, showDeathDate: m.showDeathDate,
          dateOfBirth: m.dateOfBirth, dateOfPassing: m.dateOfPassing,
          biography: m.biography, memorialLine: m.memorialLine,
          mainPhotograph: m.mainPhotograph, portraitPositionX: m.portraitPositionX,
          portraitPositionY: m.portraitPositionY, livestreamUrl: m.livestreamUrl,
          templateType: m.templateType, publicationStatus: m.publicationStatus, createdAt: m.createdAt,
        } : m),
        ...(!summary ? { media: this.memoryMedia.filter(med => med.memorialId === m.id).sort((a, b) => a.sortOrder - b.sortOrder) } : {}),
        _count: {
          media: this.memoryMedia.filter(med => med.memorialId === m.id).length,
          tributes: this.memoryTributes.filter(t => t.memorialId === m.id && t.status === 'APPROVED').length
        }
      }));
  }

  async findPublicMemorialBySlug(slug: string) {
    if (await this.checkConnection()) {
      const memorial = await prisma.memorial.findFirst({
        where: { slug, publicationStatus: 'PUBLISHED' },
        include: {
          media: { orderBy: { sortOrder: 'asc' } },
          tributes: {
            where: { status: 'APPROVED' },
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              memorialId: true,
              visitorName: true,
              relationship: true,
              message: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          }
        }
      });
      return memorial ? toPublicMemorial(memorial as unknown as Record<string, any>) : null;
    }

    const memorial = this.memoryMemorials.find(m => m.slug === slug && m.publicationStatus === 'PUBLISHED');
    if (!memorial) return null;

    const media = this.memoryMedia.filter(med => med.memorialId === memorial.id).sort((a, b) => a.sortOrder - b.sortOrder);
    const tributes = this.memoryTributes.filter(t => t.memorialId === memorial.id && t.status === 'APPROVED').sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return toPublicMemorial({
      ...memorial,
      media,
      tributes
    });
  }

  // Admin Memorial operations
  async findAllMemorialsAdmin(search?: string) {
    if (await this.checkConnection()) {
      const memorials = await prisma.memorial.findMany({
        where: search ? {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { preferredDisplayName: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ]
        } : undefined,
        orderBy: { updatedAt: 'desc' },
        include: {
          media: { orderBy: { sortOrder: 'asc' } },
          _count: { select: { tributes: true } }
        }
      });
      return memorials.map(memorial => normalizeServiceFields(memorial as unknown as Record<string, any>));
    }

    return this.memoryMemorials
      .filter(m => {
        if (!search) return true;
        const q = search.toLowerCase();
        return m.fullName.toLowerCase().includes(q) || (m.preferredDisplayName || '').toLowerCase().includes(q) || m.slug.toLowerCase().includes(q);
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .map(m => normalizeServiceFields({
        ...m,
        media: this.memoryMedia.filter(med => med.memorialId === m.id).sort((a, b) => a.sortOrder - b.sortOrder),
        _count: {
          tributes: this.memoryTributes.filter(t => t.memorialId === m.id).length
        }
      }));
  }

  async findMemorialByIdAdmin(id: string) {
    if (await this.checkConnection()) {
      const memorial = await prisma.memorial.findUnique({
        where: { id },
        include: {
          media: { orderBy: { sortOrder: 'asc' } },
          tributes: { orderBy: { createdAt: 'desc' } }
        }
      });
      return memorial ? normalizeServiceFields(memorial as unknown as Record<string, any>) : null;
    }

    const memorial = this.memoryMemorials.find(m => m.id === id);
    if (!memorial) return null;

    return normalizeServiceFields({
      ...memorial,
      media: this.memoryMedia.filter(med => med.memorialId === memorial.id).sort((a, b) => a.sortOrder - b.sortOrder),
      tributes: this.memoryTributes.filter(t => t.memorialId === memorial.id).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    });
  }

  async createMemorial(data: Omit<InMemoryMemorial, 'id' | 'createdAt' | 'updatedAt' | 'media' | 'tributes'>) {
    if (await this.checkConnection()) {
      return prisma.memorial.create({
        data: {
          ...data,
          templateType: data.templateType,
          publicationStatus: data.publicationStatus,
        }
      });
    }

    const newMemorial: InMemoryMemorial = {
      ...data,
      id: `mem-${Date.now()}-${this.nextMemoryMemorialId++}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.memoryMemorials.unshift(newMemorial);
    return newMemorial;
  }

  async updateMemorial(id: string, data: Partial<Omit<InMemoryMemorial, 'id' | 'createdAt' | 'updatedAt' | 'media' | 'tributes'>>) {
    if (await this.checkConnection()) {
      return prisma.memorial.update({
        where: { id },
        data: {
          ...data,
          templateType: data.templateType ? data.templateType : undefined,
          publicationStatus: data.publicationStatus ? data.publicationStatus : undefined,
        }
      });
    }

    const index = this.memoryMemorials.findIndex(m => m.id === id);
    if (index === -1) throw new Error('Memorial not found');

    const updated: InMemoryMemorial = {
      ...this.memoryMemorials[index],
      ...data,
      updatedAt: new Date(),
    };
    this.memoryMemorials[index] = updated;
    return updated;
  }

  async deleteMemorial(id: string) {
    if (await this.checkConnection()) {
      return prisma.memorial.delete({ where: { id } });
    }

    this.memoryMemorials = this.memoryMemorials.filter(m => m.id !== id);
    this.memoryMedia = this.memoryMedia.filter(m => m.memorialId !== id);
    this.memoryTributes = this.memoryTributes.filter(t => t.memorialId !== id);
    return { id };
  }

  async checkSlugAvailable(slug: string, currentId?: string): Promise<boolean> {
    if (await this.checkConnection()) {
      const existing = await prisma.memorial.findUnique({ where: { slug } });
      if (!existing) return true;
      return currentId ? existing.id === currentId : false;
    }
    const existing = this.memoryMemorials.find(m => m.slug.toLowerCase() === slug.toLowerCase());
    if (!existing) return true;
    return currentId ? existing.id === currentId : false;
  }

  async generateUniqueSlug(fullName: string, currentId?: string): Promise<string> {
    const baseSlug = fullName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'memorial';

    let candidate = baseSlug;
    let counter = 1;

    while (!(await this.checkSlugAvailable(candidate, currentId))) {
      counter++;
      candidate = `${baseSlug}-${counter}`;
    }

    return candidate;
  }

  // Tributes operations
  async findTributeById(id: string) {
    if (await this.checkConnection()) {
      return prisma.tribute.findUnique({
        where: { id },
        include: {
          memorial: { select: { id: true, fullName: true, slug: true } }
        }
      });
    }

    const tribute = this.memoryTributes.find(t => t.id === id);
    if (!tribute) return null;

    const memorial = this.memoryMemorials.find(m => m.id === tribute.memorialId);
    return {
      ...tribute,
      memorial: memorial ? { id: memorial.id, fullName: memorial.fullName, slug: memorial.slug } : null
    };
  }

  async updateTribute(id: string, data: { visitorName?: string; relationship?: string | null; message?: string; contributorEmail?: string | null; status?: 'PENDING' | 'APPROVED' | 'REJECTED' }) {
    if (await this.checkConnection()) {
      return prisma.tribute.update({
        where: { id },
        data: {
          ...(data.visitorName ? { visitorName: data.visitorName } : {}),
          ...(data.relationship !== undefined ? { relationship: data.relationship } : {}),
          ...(data.message ? { message: data.message } : {}),
          ...(data.contributorEmail !== undefined ? { contributorEmail: data.contributorEmail } : {}),
          ...(data.status ? { status: data.status as TributeStatus } : {}),
        }
      });
    }

    const tribute = this.memoryTributes.find(t => t.id === id);
    if (!tribute) throw new Error('Tribute not found');
    if (data.visitorName) tribute.visitorName = data.visitorName;
    if (data.relationship !== undefined) tribute.relationship = data.relationship;
    if (data.message) tribute.message = data.message;
    if (data.contributorEmail !== undefined) tribute.contributorEmail = data.contributorEmail;
    if (data.status) tribute.status = data.status;
    tribute.updatedAt = new Date();
    return tribute;
  }

  async createTribute(memorialId: string, visitorName: string, message: string, relationship: string | null = null, contributorEmail: string | null = null) {
    if (await this.checkConnection()) {
      return prisma.tribute.create({
        data: {
          memorialId,
          visitorName,
          relationship,
          message,
          contributorEmail,
          status: 'PENDING',
        }
      });
    }

    const newTribute: InMemoryTribute = {
      id: `trib-${Date.now()}-${this.nextMemoryTributeId++}`,
      memorialId,
      visitorName,
      relationship,
      message,
      contributorEmail,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.memoryTributes.unshift(newTribute);
    return newTribute;
  }

  async findTributesAdmin(status?: 'PENDING' | 'APPROVED' | 'REJECTED') {
    if (await this.checkConnection()) {
      return prisma.tribute.findMany({
        where: status ? { status: status as TributeStatus } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          memorial: { select: { id: true, fullName: true, slug: true } }
        }
      });
    }

    return this.memoryTributes
      .filter(t => (!status ? true : t.status === status))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(t => ({
        ...t,
        memorial: this.memoryMemorials.find(m => m.id === t.memorialId)
          ? {
              id: t.memorialId,
              fullName: this.memoryMemorials.find(m => m.id === t.memorialId)!.fullName,
              slug: this.memoryMemorials.find(m => m.id === t.memorialId)!.slug,
            }
          : null
      }));
  }

  async updateTributeStatus(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
    if (await this.checkConnection()) {
      return prisma.tribute.update({
        where: { id },
        data: { status: status as TributeStatus }
      });
    }

    const tribute = this.memoryTributes.find(t => t.id === id);
    if (!tribute) throw new Error('Tribute not found');
    tribute.status = status;
    tribute.updatedAt = new Date();
    return tribute;
  }

  async deleteTribute(id: string) {
    if (await this.checkConnection()) {
      return prisma.tribute.delete({ where: { id } });
    }
    this.memoryTributes = this.memoryTributes.filter(t => t.id !== id);
    return { id };
  }

  // Media operations
  async findMediaById(id: string) {
    if (await this.checkConnection()) {
      return prisma.memorialMedia.findUnique({ where: { id } });
    }
    return this.memoryMedia.find(media => media.id === id) || null;
  }

  async addMedia(memorialId: string, url: string, cloudinaryPublicId: string | null = null, caption: string | null = null, sortOrder: number = 0, mediaType: MediaType = 'PHOTO'): Promise<InMemoryMemorialMedia> {
    if (await this.checkConnection()) {
      const created = await prisma.memorialMedia.create({
        data: {
          memorialId,
          url,
          cloudinaryPublicId,
          caption,
          sortOrder,
          mediaType,
        }
      });
      return {
        id: created.id,
        memorialId: created.memorialId,
        cloudinaryPublicId: created.cloudinaryPublicId,
        url: created.url,
        mediaType: created.mediaType,
        caption: created.caption,
        sortOrder: created.sortOrder,
        createdAt: created.createdAt,
      };
    }

    const newMedia: InMemoryMemorialMedia = {
      id: `med-${Date.now()}-${this.nextMemoryMediaId++}`,
      memorialId,
      url,
      cloudinaryPublicId,
      mediaType,
      caption,
      sortOrder,
      createdAt: new Date(),
    };
    this.memoryMedia.push(newMedia);
    return newMedia;
  }

  async reorderMedia(memorialId: string, items: { id: string; sortOrder: number }[]) {
    if (await this.checkConnection()) {
      await prisma.$transaction(
        items.map(item => prisma.memorialMedia.updateMany({
          where: { id: item.id, memorialId },
          data: { sortOrder: item.sortOrder },
        }))
      );
      return true;
    }

    for (const item of items) {
      const media = this.memoryMedia.find(m => m.id === item.id && m.memorialId === memorialId);
      if (media) {
        media.sortOrder = item.sortOrder;
      }
    }
    return true;
  }

  async deleteMedia(id: string) {
    if (await this.checkConnection()) {
      return prisma.memorialMedia.delete({ where: { id } });
    }
    this.memoryMedia = this.memoryMedia.filter(m => m.id !== id);
    return { id };
  }
}

export const db = new MemorialDataStore();
