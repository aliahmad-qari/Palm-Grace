import { Router, Request, Response } from 'express';
import QRCode from 'qrcode';
import { db } from '../db.js';
import { config } from '../config.js';
import { validateBody } from '../middleware/validate.js';
import { rateLimitTributes } from '../middleware/rateLimit.js';
import { createTributeSchema } from '../validators/index.js';

export const memorialsRouter = Router();

/**
 * GET /api/memorials
 * Returns all published memorials. Unpublished/draft memorials are strictly excluded.
 */
memorialsRouter.get('/', async (req: Request, res: Response) => {
  try {
    if (!config.enablePublicDirectory) {
      return res.json({
        success: true,
        directoryDisabled: true,
        count: 0,
        data: [],
        message: 'The public memorial directory is currently restricted for family privacy. Memorials remain accessible via direct URL and personal QR code.',
      });
    }

    const search = req.query.search ? String(req.query.search).trim() : undefined;
    const memorials = await db.findPublicMemorials(search);

    return res.json({
      success: true,
      directoryDisabled: false,
      count: memorials.length,
      data: memorials,
    });
  } catch (error) {
    console.error('Error fetching public memorials:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve memorials',
    });
  }
});

/**
 * GET /api/memorials/:slug
 * Retrieves a single published memorial by unique slug.
 */
memorialsRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const memorial = await db.findPublicMemorialBySlug(slug);

    if (!memorial) {
      return res.status(404).json({
        success: false,
        error: 'Memorial not found or is currently private/in draft',
      });
    }

    return res.json({
      success: true,
      data: memorial,
    });
  } catch (error) {
    console.error('Error fetching public memorial:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve memorial details',
    });
  }
});

/**
 * GET /api/memorials/:slug/tributes
 * Returns only APPROVED tributes for a published memorial.
 */
memorialsRouter.get('/:slug/tributes', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const memorial = await db.findPublicMemorialBySlug(slug);

    if (!memorial) {
      return res.status(404).json({
        success: false,
        error: 'Memorial not found',
      });
    }

    return res.json({
      success: true,
      data: memorial.tributes || [],
    });
  } catch (error) {
    console.error('Error fetching tributes:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve memorial tributes',
    });
  }
});

/**
 * POST /api/memorials/:slug/tributes
 * Submits a visitor tribute with rate limiting, Zod validation, and honeypot spam protection.
 * Placed immediately into PENDING status for moderation (no automatic publication).
 */
memorialsRouter.post(
  '/:slug/tributes',
  rateLimitTributes({ maxRequests: 5, windowMs: 60 * 1000 }), // 5 tributes per minute max per IP
  validateBody(createTributeSchema),
  async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const { visitorName, message, website } = req.body;

      // Honeypot spam trap: if hidden field is filled, silently reject or error
      if (website) {
        return res.status(400).json({
          success: false,
          error: 'Spam submission detected',
        });
      }

      const memorial = await db.findPublicMemorialBySlug(slug);
      if (!memorial) {
        return res.status(404).json({
          success: false,
          error: 'Memorial not found or not published',
        });
      }

      // Safe sanitize of user input: trim and strip any raw HTML tags before storage
      const sanitizedName = visitorName.replace(/<[^>]*>/g, '').trim();
      const sanitizedMessage = message.replace(/<[^>]*>/g, '').trim();

      const tribute = await db.createTribute(memorial.id, sanitizedName, sanitizedMessage);

      return res.status(201).json({
        success: true,
        message: 'Your tribute has been received with gratitude and will be published following respectful moderation.',
        data: {
          id: tribute.id,
          status: tribute.status,
          createdAt: tribute.createdAt,
        },
      });
    } catch (error) {
      console.error('Error creating tribute:', error);
      return res.status(500).json({
        success: false,
        error: 'Unable to submit tribute at this time',
      });
    }
  }
);

/**
 * GET /api/memorials/:slug/qr
 * Generates a print-friendly vector SVG or high-resolution PNG QR code
 * linking directly to the canonical public memorial URL (using PUBLIC_SITE_URL).
 * Suitable for laser engraving and 300+ DPI physical printing on plaques and stationery.
 */
memorialsRouter.get('/:slug/qr', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const memorial = await db.findPublicMemorialBySlug(slug);

    if (!memorial) {
      return res.status(404).json({
        success: false,
        error: 'Memorial not found or not published',
      });
    }

    // Canonical production memorial URL using PUBLIC_SITE_URL (never temporary or internal IPs)
    const publicUrl = `${config.publicSiteUrl}/memorial/${slug}`;
    const format = req.query.format === 'png' ? 'png' : 'svg';
    const isDownload = req.query.download === '1';

    if (format === 'svg') {
      const svg = await QRCode.toString(publicUrl, {
        type: 'svg',
        margin: 2,
        color: {
          dark: '#1e293b', // Deep charcoal slate for clean contrast on bronze plaques and paper
          light: '#ffffff',
        },
      });

      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      if (isDownload) {
        res.setHeader('Content-Disposition', `attachment; filename="${slug}-memorial-qr.svg"`);
      }
      return res.send(svg);
    } else {
      // High-resolution PNG for 300+ DPI physical printing (1200x1200px)
      const pngBuffer = await QRCode.toBuffer(publicUrl, {
        type: 'png',
        width: 1200,
        margin: 3,
        color: {
          dark: '#1e293b',
          light: '#ffffff',
        },
      });

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      if (isDownload) {
        res.setHeader('Content-Disposition', `attachment; filename="${slug}-memorial-qr.png"`);
      }
      return res.send(pngBuffer);
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate QR code',
    });
  }
});
