export type TemplateType = 'MALE' | 'FEMALE' | 'CHILD';
export type PublicationStatus = 'DRAFT' | 'PRIVATE_PREVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type MediaType = 'PHOTO' | 'VIDEO';
export type TributeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
}

export interface MemorialMedia {
  id: string;
  memorialId: string;
  cloudinaryPublicId: string | null;
  url: string;
  mediaType: MediaType;
  caption: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface Tribute {
  id: string;
  memorialId: string;
  visitorName: string;
  relationship: string | null;
  message: string;
  contributorEmail?: string | null;
  status: TributeStatus;
  createdAt: string;
  updatedAt: string;
  memorial?: {
    id: string;
    fullName: string;
    slug: string;
  } | null;
}

export interface Memorial {
  id: string;
  slug: string;
  fullName: string;
  preferredDisplayName: string | null;
  birthDate: string | null;
  showBirthDate: boolean;
  deathDate: string | null;
  showDeathDate: boolean;
  dateOfBirth: string | null;
  dateOfPassing: string | null;
  biography: string;
  memorialLine: string | null;
  lifeStory: string | null;
  mainPhotograph: string;
  serviceInformation: string | null;
  serviceTitle: string | null;
  serviceDate: string | null;
  serviceTime: string | null;
  serviceVenue: string | null;
  serviceAddress: string | null;
  viewingWakeInformation: string | null;
  familyAcknowledgement: string | null;
  livestreamUrl: string | null;
  recordingUrl: string | null;
  closingWords: string | null;
  templateType: TemplateType;
  publicationStatus: PublicationStatus;
  createdAt: string;
  updatedAt: string;
  media?: MemorialMedia[];
  tributes?: Tribute[];
  _count?: {
    tributes: number;
  };
}

export interface DashboardSummary {
  total: number;
  drafts: number;
  published: number;
  privatePreview?: number;
  archived?: number;
  pendingTributes: number;
}
