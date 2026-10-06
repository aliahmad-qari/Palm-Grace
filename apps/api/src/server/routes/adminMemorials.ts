import { Router, Response } from 'express';
import QRCode from 'qrcode';
import { db } from '../db.js';
import { config } from '../config.js';
import { validateBody } from '../middleware/validate.js';
import { createMemorialSchema, updateMemorialSchema } from '../validators/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { omitUndefined, resolveDateAliases, resolveServiceFields } from '../memorialPayload.js';

export const adminMemorialsRouter = Router();

/** Generates QR assets for any admin-visible memorial, including drafts/private previews. */
adminMemorialsRouter.get('/:id/qr', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const memorial = await db.findMemorialByIdAdmin(req.params.id);
    if (!memorial) return res.status(404).json({ success: false, error: 'Memorial not found' });

    const publicUrl = `${config.publicSiteUrl}/memorial/${memorial.slug}`;
    const format = req.query.format === 'png' ? 'png' : 'svg';
    const isDownload = req.query.download === '1';
    const filename = `${memorial.slug}-memorial-qr.${format}`;

    if (format === 'png') {
      const png = await QRCode.toBuffer(publicUrl, { type: 'png', width: 1200, margin: 3, color: { dark: '#2B4333', light: '#FFFFFF' } });
      res.type('png').setHeader('Cache-Control', 'private, no-store');
      if (isDownload) res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(png);
    }

    const svg = await QRCode.toString(publicUrl, { type: 'svg', margin: 2, color: { dark: '#2B4333', light: '#FFFFFF' } });
    res.type('svg').setHeader('Cache-Control', 'private, no-store');
    if (isDownload) res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(svg);
  } catch (error) {
    console.error('[Admin API] Error generating QR code:', error);
    return res.status(500).json({ success: false, error: 'Failed to generate QR code' });
  }
});

/**
 * GET /api/admin/memorials
 * Lists all memorials (drafts and published) with optional search & status filter
 */
adminMemorialsRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const search = req.query.search ? String(req.query.search).trim() : undefined;
    const statusFilter = req.query.status as 'DRAFT' | 'PRIVATE_PREVIEW' | 'PUBLISHED' | 'ARCHIVED' | undefined;
    const templateFilter = req.query.template as 'MALE' | 'FEMALE' | 'CHILD' | undefined;

    let memorials = await db.findAllMemorialsAdmin(search);

    if (statusFilter && ['DRAFT', 'PRIVATE_PREVIEW', 'PUBLISHED', 'ARCHIVED'].includes(statusFilter)) {
      memorials = memorials.filter(m => m.publicationStatus === statusFilter);
    }

    if (templateFilter && ['MALE', 'FEMALE', 'CHILD'].includes(templateFilter)) {
      memorials = memorials.filter(m => m.templateType === templateFilter);
    }

    const totalCount = memorials.length;
    const draftCount = memorials.filter(m => m.publicationStatus === 'DRAFT').length;
    const privatePreviewCount = memorials.filter(m => m.publicationStatus === 'PRIVATE_PREVIEW').length;
    const publishedCount = memorials.filter(m => m.publicationStatus === 'PUBLISHED').length;
    const archivedCount = memorials.filter(m => m.publicationStatus === 'ARCHIVED').length;

    return res.json({
      success: true,
      count: totalCount,
      summary: {
        total: totalCount,
        drafts: draftCount,
        privatePreview: privatePreviewCount,
        published: publishedCount,
        archived: archivedCount,
      },
      data: memorials,
    });
  } catch (error) {
    console.error('[Admin API] Error in memorials list:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve memorials from database',
    });
  }
});

/**
 * GET /api/admin/memorials/:id
 * Fetches single memorial by ID with draft details, media items, and all tributes
 */
adminMemorialsRouter.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const memorial = await db.findMemorialByIdAdmin(id);

    if (!memorial) {
      return res.status(404).json({
        success: false,
        error: `Memorial with ID '${id}' was not found.`,
      });
    }

    return res.json({
      success: true,
      data: memorial,
    });
  } catch (error) {
    console.error('[Admin API] Error fetching memorial by ID:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve memorial details',
    });
  }
});

/**
 * POST /api/admin/memorials
 * Creates a new memorial with safe unique slug generation and collision avoidance
 */
adminMemorialsRouter.post(
  '/',
  validateBody(createMemorialSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const payload = req.body;

      // Safe unique slug generation with collision handling
      const targetSlugSeed = payload.slug || payload.fullName;
      const safeSlug = await db.generateUniqueSlug(targetSlugSeed);
      const dates = resolveDateAliases(payload, true);
      const service = resolveServiceFields(payload);

      const memorial = await db.createMemorial({
        slug: safeSlug,
        fullName: payload.fullName,
        preferredDisplayName: payload.preferredDisplayName || null,
        birthDate: dates.birthDate ?? null,
        showBirthDate: payload.showBirthDate,
        deathDate: dates.deathDate ?? null,
        showDeathDate: payload.showDeathDate,
        dateOfBirth: dates.dateOfBirth ?? null,
        dateOfPassing: dates.dateOfPassing ?? null,
        biography: payload.biography || '',
        memorialLine: payload.memorialLine || null,
        lifeStory: payload.lifeStory || null,
        mainPhotograph: payload.mainPhotograph,
        heroBackgroundUrl: payload.heroBackgroundUrl || null,
        portraitPositionX: payload.portraitPositionX ?? 50,
        portraitPositionY: payload.portraitPositionY ?? 50,
        serviceTitle: service.serviceTitle ?? null,
        serviceDate: service.serviceDate ?? null,
        serviceTime: service.serviceTime ?? null,
        serviceVenue: service.serviceVenue ?? null,
        serviceAddress: service.serviceAddress ?? null,
        viewingWakeInformation: payload.viewingWakeInformation || null,
        serviceInformation: service.serviceInformation ?? payload.serviceInformation ?? null,
        familyAcknowledgement: payload.familyAcknowledgement || null,
        livestreamUrl: payload.livestreamUrl || null,
        recordingUrl: payload.recordingUrl || null,
        closingWords: payload.closingWords || null,
        templateType: payload.templateType || 'MALE',
        publicationStatus: payload.publicationStatus || 'DRAFT',
      });

      return res.status(201).json({
        success: true,
        message: `Memorial for "${memorial.fullName}" successfully created (${memorial.publicationStatus}).`,
        data: memorial,
      });
    } catch (error: any) {
      console.error('[Admin API] Error creating memorial:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to create memorial',
      });
    }
  }
);

/**
 * PATCH /api/admin/memorials/:id
 * Updates memorial fields with safe collision handling for slug changes
 */
adminMemorialsRouter.patch(
  '/:id',
  validateBody(updateMemorialSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const payload = req.body;

      const existing = await db.findMemorialByIdAdmin(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: `Memorial with ID '${id}' was not found.`,
        });
      }

      // If slug was requested or changed, guarantee safe collision avoidance
      let updatedSlug = payload.slug;
      if (payload.slug && payload.slug !== existing.slug) {
        updatedSlug = await db.generateUniqueSlug(payload.slug, id);
      }

      const dates = resolveDateAliases(payload);
      const service = resolveServiceFields(payload, existing);

      const updated = await db.updateMemorial(id, omitUndefined({
        fullName: payload.fullName,
        slug: updatedSlug,
        ...dates,
        preferredDisplayName: payload.preferredDisplayName,
        showBirthDate: payload.showBirthDate,
        showDeathDate: payload.showDeathDate,
        biography: payload.biography,
        memorialLine: payload.memorialLine,
        lifeStory: payload.lifeStory !== undefined ? payload.lifeStory : undefined,
        mainPhotograph: payload.mainPhotograph,
        heroBackgroundUrl: payload.heroBackgroundUrl,
        portraitPositionX: payload.portraitPositionX,
        portraitPositionY: payload.portraitPositionY,
        ...service,
        viewingWakeInformation: payload.viewingWakeInformation,
        familyAcknowledgement: payload.familyAcknowledgement !== undefined ? payload.familyAcknowledgement : undefined,
        livestreamUrl: payload.livestreamUrl !== undefined ? payload.livestreamUrl : undefined,
        recordingUrl: payload.recordingUrl !== undefined ? payload.recordingUrl : undefined,
        closingWords: payload.closingWords,
        templateType: payload.templateType,
        publicationStatus: payload.publicationStatus,
      }));

      return res.json({
        success: true,
        message: 'Memorial updated successfully',
        data: updated,
      });
    } catch (error: any) {
      console.error('[Admin API] Error updating memorial:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to update memorial',
      });
    }
  }
);

/**
 * PUT /api/admin/memorials/:id
 * Full update alias
 */
adminMemorialsRouter.put(
  '/:id',
  validateBody(updateMemorialSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const payload = req.body;

      const existing = await db.findMemorialByIdAdmin(id);
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: `Memorial with ID '${id}' was not found.`,
        });
      }

      let updatedSlug = payload.slug;
      if (payload.slug && payload.slug !== existing.slug) {
        updatedSlug = await db.generateUniqueSlug(payload.slug, id);
      }

      const dates = resolveDateAliases(payload);
      const service = resolveServiceFields(payload, existing);

      const updated = await db.updateMemorial(id, omitUndefined({
        fullName: payload.fullName,
        slug: updatedSlug,
        ...dates,
        preferredDisplayName: payload.preferredDisplayName,
        showBirthDate: payload.showBirthDate,
        showDeathDate: payload.showDeathDate,
        biography: payload.biography,
        memorialLine: payload.memorialLine,
        lifeStory: payload.lifeStory !== undefined ? payload.lifeStory : undefined,
        mainPhotograph: payload.mainPhotograph,
        heroBackgroundUrl: payload.heroBackgroundUrl,
        portraitPositionX: payload.portraitPositionX,
        portraitPositionY: payload.portraitPositionY,
        ...service,
        viewingWakeInformation: payload.viewingWakeInformation,
        familyAcknowledgement: payload.familyAcknowledgement !== undefined ? payload.familyAcknowledgement : undefined,
        livestreamUrl: payload.livestreamUrl !== undefined ? payload.livestreamUrl : undefined,
        recordingUrl: payload.recordingUrl !== undefined ? payload.recordingUrl : undefined,
        closingWords: payload.closingWords,
        templateType: payload.templateType,
        publicationStatus: payload.publicationStatus,
      }));

      return res.json({
        success: true,
        message: 'Memorial updated successfully',
        data: updated,
      });
    } catch (error: any) {
      console.error('[Admin API] Error in PUT memorial:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to update memorial',
      });
    }
  }
);

/**
 * PATCH /api/admin/memorials/:id/publish
 * Publishes or unpublishes a memorial
 */
adminMemorialsRouter.patch('/:id/publish', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const publish = req.body.publish !== false; // defaults to true unless publish: false passed
    const targetStatus = publish ? 'PUBLISHED' : 'DRAFT';

    const existing = await db.findMemorialByIdAdmin(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Memorial with ID '${id}' was not found.`,
      });
    }

    const updated = await db.updateMemorial(id, { publicationStatus: targetStatus });

    return res.json({
      success: true,
      message: `Memorial is now ${targetStatus}`,
      data: updated,
    });
  } catch (error: any) {
    console.error('[Admin API] Error toggling publish status:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to toggle publication status',
    });
  }
});

/**
 * PATCH /api/admin/memorials/:id/status
 * Explicit status update (DRAFT | PRIVATE_PREVIEW | PUBLISHED | ARCHIVED)
 */
adminMemorialsRouter.patch('/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { publicationStatus } = req.body;

    if (!['DRAFT', 'PRIVATE_PREVIEW', 'PUBLISHED', 'ARCHIVED'].includes(publicationStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be DRAFT, PRIVATE_PREVIEW, PUBLISHED, or ARCHIVED',
      });
    }

    const existing = await db.findMemorialByIdAdmin(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Memorial with ID '${id}' was not found.`,
      });
    }

    const updated = await db.updateMemorial(id, { publicationStatus });

    return res.json({
      success: true,
      message: `Memorial status updated to ${publicationStatus}`,
      data: updated,
    });
  } catch (error: any) {
    console.error('[Admin API] Error updating memorial status:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to update publication status',
    });
  }
});

/**
 * DELETE /api/admin/memorials/:id
 * Permanently removes memorial, cascading to all media and tributes
 */
adminMemorialsRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await db.findMemorialByIdAdmin(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Memorial with ID '${id}' was not found.`,
      });
    }

    await db.deleteMemorial(id);

    return res.json({
      success: true,
      message: `Memorial "${existing.fullName}" and its associated media/tributes were deleted successfully.`,
    });
  } catch (error: any) {
    console.error('[Admin API] Error deleting memorial:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete memorial',
    });
  }
});
