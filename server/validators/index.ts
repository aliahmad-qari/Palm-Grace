import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid administrator email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Helper for validating livestream and recording URLs
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
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug cannot exceed 100 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must only contain lowercase letters, numbers, and single hyphens')
    .optional(),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid Date of Birth' }),
  dateOfPassing: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid Date of Passing' }),
  biography: z.string().trim().min(10, 'Biography must be at least 10 characters'),
  lifeStory: z.string().trim().nullable().optional(),
  mainPhotograph: z.string().trim().url('Main photograph must be a valid URL'),
  serviceInformation: z.string().trim().nullable().optional(),
  familyAcknowledgement: z.string().trim().nullable().optional(),
  livestreamUrl: videoOrStreamUrlValidator,
  recordingUrl: videoOrStreamUrlValidator,
  templateType: z.enum(['MALE', 'FEMALE', 'CHILD'], {
    error: () => ({ message: 'Template must be MALE, FEMALE, or CHILD' }),
  }).default('MALE'),
  publicationStatus: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
});

export const updateMemorialSchema = createMemorialSchema.partial();

export const createTributeSchema = z.object({
  visitorName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    // Disallow script injections and control tags
    .refine((val) => !/<script|javascript:|data:/i.test(val), {
      message: 'Name contains invalid or disallowed characters',
    }),
  message: z
    .string()
    .trim()
    .min(5, 'Tribute message must be at least 5 characters')
    .max(2500, 'Tribute message cannot exceed 2500 characters')
    // Disallow script injections and unsafe markup
    .refine((val) => !/<script|javascript:|data:/i.test(val), {
      message: 'Tribute contains invalid or disallowed script markup',
    }),
  // Optional honeypot field for bot/spam trap: legitimate users never fill this
  website: z.string().max(0, 'Spam detected').optional(),
});

export const updateTributeStatusSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED'], {
    error: () => ({ message: 'Status must be PENDING, APPROVED, or REJECTED' }),
  }),
});

export const updateTributeSchema = z.object({
  visitorName: z.string().trim().min(2).max(100).optional(),
  message: z.string().trim().min(5).max(2500).optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});

export const addMediaSchema = z.object({
  memorialId: z.string().min(1, 'memorialId is required'),
  url: z.string().trim().url('Media URL must be valid'),
  cloudinaryPublicId: z.string().trim().nullable().optional(),
  caption: z.string().trim().max(250).nullable().optional(),
  sortOrder: z.number().int().min(0).default(0),
});

export const reorderMediaSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      sortOrder: z.number().int().min(0),
    })
  ).min(1, 'At least one media item must be provided'),
});
