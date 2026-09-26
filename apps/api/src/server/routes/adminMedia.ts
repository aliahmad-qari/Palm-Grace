import { Router, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db.js';
import { config } from '../config.js';
import { validateBody } from '../middleware/validate.js';
import { addMediaSchema, reorderMediaSchema } from '../validators/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const adminMediaRouter = Router();

/**
 * Generates secure Cloudinary signature on server-side.
 * Formula: SHA-1 hash of sorted param key=value pairs concatenated with API secret.
 * The secret NEVER reaches the frontend.
 */
function generateCloudinarySignature(params: Record<string, string | number>, apiSecret: string): string {
  const sortedKeys = Object.keys(params).sort();
  const serialized = sortedKeys.map(k => `${k}=${params[k]}`).join('&');
  return crypto.createHash('sha1').update(serialized + apiSecret).digest('hex');
}

/**
 * GET /api/admin/media/config
 * Returns client-safe Cloudinary parameters (never exposes API secret)
 */
adminMediaRouter.get('/config', (req: AuthenticatedRequest, res: Response) => {
  const isConfigured = Boolean(
    config.cloudinary.cloudName &&
    config.cloudinary.apiKey &&
    config.cloudinary.apiSecret
  );

  return res.json({
    success: true,
    data: {
      cloudName: config.cloudinary.cloudName,
      apiKey: config.cloudinary.apiKey,
      folder: 'palm-and-grace/memorials',
      isConfigured,
      uploadPresetConfigured: true,
    },
  });
});

/**
 * POST /api/admin/media/sign-upload
 * Generates a cryptographic signature so the client can upload directly to Cloudinary
 * without ever knowing or having access to the CLOUDINARY_API_SECRET.
 */
adminMediaRouter.post('/sign-upload', (req: AuthenticatedRequest, res: Response) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'palm-and-grace/memorials';

    if (!config.cloudinary.apiSecret || !config.cloudinary.apiKey) {
      // In development / demo mode when real Cloudinary credentials are not set
      return res.json({
        success: true,
        mode: 'mock',
        data: {
          timestamp,
          folder,
          apiKey: config.cloudinary.apiKey || 'demo-key',
          cloudName: config.cloudinary.cloudName || 'demo',
          signature: 'demo-signature',
          notice: 'Cloudinary credentials in development mode.',
        },
      });
    }

    const paramsToSign = {
      folder,
      timestamp,
    };

    const signature = generateCloudinarySignature(paramsToSign, config.cloudinary.apiSecret);

    return res.json({
      success: true,
      data: {
        timestamp,
        folder,
        apiKey: config.cloudinary.apiKey,
        cloudName: config.cloudinary.cloudName,
        signature,
      },
    });
  } catch (error) {
    console.error('[Admin Media] Error generating upload signature:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate secure upload signature',
    });
  }
});

/**
 * POST /api/admin/media
 * Links an uploaded photo to a memorial's gallery
 */
adminMediaRouter.post(
  '/',
  validateBody(addMediaSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { memorialId, url, cloudinaryPublicId, caption, sortOrder } = req.body;

      const memorial = await db.findMemorialByIdAdmin(memorialId);
      if (!memorial) {
        return res.status(404).json({
          success: false,
          error: `Memorial with ID '${memorialId}' not found.`,
        });
      }

      const media = await db.addMedia(
        memorialId,
        url,
        cloudinaryPublicId || null,
        caption || null,
        sortOrder ?? 0
      );

      return res.status(201).json({
        success: true,
        message: 'Media added to memorial gallery',
        data: media,
      });
    } catch (error) {
      console.error('[Admin Media] Error adding media:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to add media to gallery',
      });
    }
  }
);

/**
 * PATCH /api/admin/media/reorder
 * Updates sortOrder for multiple photos in a gallery
 */
adminMediaRouter.patch(
  '/reorder',
  validateBody(reorderMediaSchema.extend({ memorialId: addMediaSchema.shape.memorialId })),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { memorialId, items } = req.body;
      await db.reorderMedia(memorialId, items);

      return res.json({
        success: true,
        message: 'Gallery photos reordered successfully',
      });
    } catch (error) {
      console.error('[Admin Media] Error reordering media:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to reorder media',
      });
    }
  }
);

/**
 * DELETE /api/admin/media/:id
 * Removes a photo from a memorial's gallery
 */
adminMediaRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.deleteMedia(id);

    return res.json({
      success: true,
      message: 'Photo removed from gallery',
    });
  } catch (error) {
    console.error('[Admin Media] Error deleting media:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete photo',
    });
  }
});
