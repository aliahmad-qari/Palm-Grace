import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid administrator email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Helper for validating livestream and recording URLs
const optionalDate = z.string().trim().transform((value) => value === '' ? null : value).nullable().optional().refine(
  (value) => value == null || !Number.isNaN(Date.parse(value)),
  { message: 'Must be a valid date' }
);

const videoOrStreamUrlValidator = z
  .string()
  .trim()
  .transform(val => (val === '' ? null : val))
  .nullable()
  .optional()
  .refine(
    val => {
      if (!val) return true;
      try {
        const parsed = new URL(val);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          return false;
        }
        // Disallow dangerous hostnames or javascript schemes
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Must be a valid HTTP or HTTPS stream or video URL (e.g. YouTube, Vimeo, Zoom, etc.)' }
  );

export const createMemorialSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required (at least 2 characters)').max(150, 'Name cannot exceed 150 characters'),
  preferredDisplayName: z.string().trim().max(150).nullable().optional(),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug cannot exceed 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must only contain lowercase letters, numbers, and single hyphens')
    .optional(),
  birthDate: optionalDate,
  deathDate: optionalDate,
  dateOfBirth: optionalDate,
  dateOfPassing: optionalDate,
  showBirthDate: z.boolean().default(true),
  showDeathDate: z.boolean().default(true),
  biography: z.string().trim().min(10, 'Biography must be at least 10 characters'),
  memorialLine: z.string().trim().max(500).nullable().optional(),
  lifeStory: z.string().trim().nullable().optional(),
  mainPhotograph: z.string().trim().url('Main photograph must be a valid URL'),
  serviceTitle: z.string().trim().max(200).nullable().optional(),
  serviceDate: optionalDate,
  serviceTime: z.string().trim().max(100).nullable().optional(),
  serviceVenue: z.string().trim().max(250).nullable().optional(),
  serviceAddress: z.string().trim().max(1000).nullable().optional(),
  viewingWakeInformation: z.string().trim().max(5000).nullable().optional(),
  serviceInformation: z.string().trim().nullable().optional(),
  familyAcknowledgement: z.string().trim().nullable().optional(),
  closingWords: z.string().trim().max(1000).nullable().optional(),
  livestreamUrl: videoOrStreamUrlValidator,
  recordingUrl: videoOrStreamUrlValidator,
  templateType: z.enum(['MALE', 'FEMALE', 'CHILD'], {
    error: () => ({ message: 'Template must be MALE, FEMALE, or CHILD' }),
  }).default('MALE'),
  publicationStatus: z.enum(['DRAFT', 'PRIVATE_PREVIEW', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
});

export const updateMemorialSchema = createMemorialSchema.partial();

export const createTributeSchema = z.object({
  contributorName: z.string().trim().min(2).max(100).optional(),
  visitorName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    // Disallow script injections and control tags
    .refine((val) => !/<script|javascript:|data:/i.test(val), {
      message: 'Name contains invalid or disallowed characters',
    })
    .optional(),
  message: z
    .string()
    .trim()
    .min(5, 'Tribute message must be at least 5 characters')
    .max(2500, 'Tribute message cannot exceed 2500 characters')
    // Disallow script injections and unsafe markup
    .refine((val) => !/<script|javascript:|data:/i.test(val), {
      message: 'Tribute contains invalid or disallowed script markup',
    }),
  relationship: z.string().trim().max(100).nullable().optional(),
  contributorEmail: z.string().trim().email().max(320).nullable().optional(),
  // Optional honeypot field for bot/spam trap: legitimate users never fill this
  website: z.string().max(0, 'Spam detected').optional(),
}).refine((value) => Boolean(value.contributorName || value.visitorName), {
  path: ['contributorName'],
  message: 'Contributor name is required',
});

export const updateTributeStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED'], {
    error: () => ({ message: 'Status must be PENDING, APPROVED, or REJECTED' }),
  }),
});

export const updateTributeSchema = z.object({
  contributorName: z.string().trim().min(2).max(100).optional(),
  visitorName: z.string().trim().min(2).max(100).optional(),
  message: z.string().trim().min(5).max(2500).optional(),
  relationship: z.string().trim().max(100).nullable().optional(),
  contributorEmail: z.string().trim().email().max(320).nullable().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});

export const addMediaSchema = z.object({
  memorialId: z.string().min(1, 'memorialId is required'),
  url: z.string().trim().url('Media URL must be valid').refine((value) => new URL(value).protocol === 'https:', 'Media URL must use HTTPS').optional(),
  secureUrl: z.string().trim().url('Secure media URL must be valid').refine((value) => new URL(value).protocol === 'https:', 'Media URL must use HTTPS').optional(),
  mediaType: z.enum(['PHOTO', 'VIDEO']).default('PHOTO'),
  cloudinaryPublicId: z.string().trim().nullable().optional(),
  caption: z.string().trim().max(250).nullable().optional(),
  sortOrder: z.number().int().min(0).default(0),
}).refine((value) => Boolean(value.url || value.secureUrl), {
  path: ['secureUrl'],
  message: 'A secure media URL is required',
});

export const mediaUploadSignatureSchema = z.object({
  mediaType: z.enum(['PHOTO', 'VIDEO']).default('PHOTO'),
});

export const reorderMediaSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      sortOrder: z.number().int().min(0),
    })
  ).min(1, 'At least one media item must be provided'),
});

const enquiryName = z.string().trim().min(2).max(150);
const enquiryEmail = z.string().trim().email().max(320);
const enquiryPhone = z.string().trim().max(50).optional().default('');
const honeypot = z.string().max(0, 'Spam detected').optional().default('');

export const familyEnquirySchema = z.object({
  yourName: enquiryName,
  email: enquiryEmail,
  telephone: enquiryPhone,
  personName: enquiryName,
  relationship: z.string().trim().max(150).optional().default(''),
  hasArrangements: z.enum(['no', 'planning', 'scheduled']),
  funeralHome: z.string().trim().max(250).optional().default(''),
  serviceDate: optionalDate,
  additionalInfo: z.string().trim().max(5000).optional().default(''),
  website: honeypot,
});

export const carePartnerEnquirySchema = z.object({
  organisationName: enquiryName,
  contactPerson: enquiryName,
  role: z.string().trim().max(150).optional().default(''),
  email: enquiryEmail,
  telephone: enquiryPhone,
  location: z.string().trim().max(250).optional().default(''),
  enquiry: z.string().trim().max(5000).optional().default(''),
  website: honeypot,
});
