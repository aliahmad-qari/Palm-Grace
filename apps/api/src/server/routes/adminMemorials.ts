import { Router, Response } from 'express';
import { db } from '../db.js';
import { validateBody } from '../middleware/validate.js';
import { createMemorialSchema, updateMemorialSchema } from '../validators/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const adminMemorialsRouter = Router();

/**
 * GET /api/admin/memorials
 * Lists all memorials (drafts and published) with optional search & status filter
 */
adminMemorialsRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const search = req.query.search ? String(req.query.search).trim() : undefined;
    const statusFilter = req.query.status as 'DRAFT' | 'PUBLISHED' | undefined;
    const templateFilter = req.query.template as 'MALE' | 'FEMALE' | 'CHILD' | undefined;

    let memorials = await db.findAllMemorialsAdmin(search);

    if (statusFilter && ['DRAFT', 'PUBLISHED'].includes(statusFilter)) {
      memorials = memorials.filter(m => m.publicationStatus === statusFilter);
    }

    if (templateFilter && ['MALE', 'FEMALE', 'CHILD'].includes(templateFilter)) {
      memorials = memorials.filter(m => m.templateType === templateFilter);
    }

    const totalCount = memorials.length;
    const draftCount = memorials.filter(m => m.publicationStatus === 'DRAFT').length;
    const publishedCount = memorials.filter(m => m.publicationStatus === 'PUBLISHED').length;

    return res.json({
      success: true,
      count: totalCount,
      summary: {
        total: totalCount,
        drafts: draftCount,
        published: publishedCount,
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

      const memorial = await db.createMemorial({
        slug: safeSlug,
        fullName: payload.fullName,
        dateOfBirth: new Date(payload.dateOfBirth),
        dateOfPassing: new Date(payload.dateOfPassing),
        biography: payload.biography,
        lifeStory: payload.lifeStory || null,
        mainPhotograph: payload.mainPhotograph,
        serviceInformation: payload.serviceInformation || null,
        familyAcknowledgement: payload.familyAcknowledgement || null,
        livestreamUrl: payload.livestreamUrl || null,
        recordingUrl: payload.recordingUrl || null,
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

      const updated = await db.updateMemorial(id, {
        fullName: payload.fullName,
        slug: updatedSlug,
        dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : undefined,
        dateOfPassing: payload.dateOfPassing ? new Date(payload.dateOfPassing) : undefined,
        biography: payload.biography,
        lifeStory: payload.lifeStory !== undefined ? payload.lifeStory : undefined,
        mainPhotograph: payload.mainPhotograph,
        serviceInformation: payload.serviceInformation !== undefined ? payload.serviceInformation : undefined,
        familyAcknowledgement: payload.familyAcknowledgement !== undefined ? payload.familyAcknowledgement : undefined,
        livestreamUrl: payload.livestreamUrl !== undefined ? payload.livestreamUrl : undefined,
        recordingUrl: payload.recordingUrl !== undefined ? payload.recordingUrl : undefined,
        templateType: payload.templateType,
        publicationStatus: payload.publicationStatus,
      });

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

      const updated = await db.updateMemorial(id, {
        fullName: payload.fullName,
        slug: updatedSlug,
        dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : undefined,
        dateOfPassing: payload.dateOfPassing ? new Date(payload.dateOfPassing) : undefined,
        biography: payload.biography,
        lifeStory: payload.lifeStory !== undefined ? payload.lifeStory : undefined,
        mainPhotograph: payload.mainPhotograph,
        serviceInformation: payload.serviceInformation !== undefined ? payload.serviceInformation : undefined,
        familyAcknowledgement: payload.familyAcknowledgement !== undefined ? payload.familyAcknowledgement : undefined,
        livestreamUrl: payload.livestreamUrl !== undefined ? payload.livestreamUrl : undefined,
        recordingUrl: payload.recordingUrl !== undefined ? payload.recordingUrl : undefined,
        templateType: payload.templateType,
        publicationStatus: payload.publicationStatus,
      });

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
 * Explicit status update (DRAFT | PUBLISHED)
 */
adminMemorialsRouter.patch('/:id/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { publicationStatus } = req.body;

    if (!['DRAFT', 'PUBLISHED'].includes(publicationStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be either "DRAFT" or "PUBLISHED"',
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
