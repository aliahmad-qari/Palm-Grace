import { Router, Response } from 'express';
import { db } from '../db.js';
import { validateBody } from '../middleware/validate.js';
import { updateTributeStatusSchema, updateTributeSchema } from '../validators/index.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const adminTributesRouter = Router();

/**
 * GET /api/admin/tributes
 * Lists tributes with optional status filter (?status=PENDING | APPROVED | REJECTED)
 */
adminTributesRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const statusParam = req.query.status as 'PENDING' | 'APPROVED' | 'REJECTED' | undefined;
    const tributes = await db.findTributesAdmin(statusParam);

    const pendingCount = (await db.findTributesAdmin('PENDING')).length;
    const approvedCount = (await db.findTributesAdmin('APPROVED')).length;
    const rejectedCount = (await db.findTributesAdmin('REJECTED')).length;

    return res.json({
      success: true,
      count: tributes.length,
      counts: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        total: pendingCount + approvedCount + rejectedCount,
      },
      data: tributes,
    });
  } catch (error) {
    console.error('[Admin API] Error fetching tributes for moderation:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve tributes',
    });
  }
});

/**
 * Convenience shortcuts for specific status tabs:
 * GET /api/admin/tributes/pending
 * GET /api/admin/tributes/approved
 * GET /api/admin/tributes/rejected
 */
adminTributesRouter.get('/pending', async (req: AuthenticatedRequest, res: Response) => {
  const tributes = await db.findTributesAdmin('PENDING');
  return res.json({ success: true, count: tributes.length, data: tributes });
});

adminTributesRouter.get('/approved', async (req: AuthenticatedRequest, res: Response) => {
  const tributes = await db.findTributesAdmin('APPROVED');
  return res.json({ success: true, count: tributes.length, data: tributes });
});

adminTributesRouter.get('/rejected', async (req: AuthenticatedRequest, res: Response) => {
  const tributes = await db.findTributesAdmin('REJECTED');
  return res.json({ success: true, count: tributes.length, data: tributes });
});

/**
 * PATCH /api/admin/tributes/:id/approve
 * Approves a tribute for public visibility
 */
adminTributesRouter.patch('/:id/approve', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await db.findTributeById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Tribute not found' });
    }

    const updated = await db.updateTributeStatus(id, 'APPROVED');
    return res.json({
      success: true,
      message: 'Tribute approved and published to the memorial page',
      data: updated,
    });
  } catch (error) {
    console.error('[Admin API] Error approving tribute:', error);
    return res.status(500).json({ success: false, error: 'Failed to approve tribute' });
  }
});

/**
 * PATCH /api/admin/tributes/:id/reject
 * Rejects a tribute, keeping it out of public view
 */
adminTributesRouter.patch('/:id/reject', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await db.findTributeById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Tribute not found' });
    }

    const updated = await db.updateTributeStatus(id, 'REJECTED');
    return res.json({
      success: true,
      message: 'Tribute rejected and hidden from public view',
      data: updated,
    });
  } catch (error) {
    console.error('[Admin API] Error rejecting tribute:', error);
    return res.status(500).json({ success: false, error: 'Failed to reject tribute' });
  }
});

/**
 * PATCH /api/admin/tributes/:id
 * General status update or content moderation (e.g. fixing typos)
 */
adminTributesRouter.patch(
  '/:id',
  validateBody(updateTributeSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { contributorName, visitorName, relationship, contributorEmail, message, status } = req.body;

      const existing = await db.findTributeById(id);
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Tribute not found' });
      }

      const updated = await db.updateTribute(id, {
        visitorName: contributorName ?? visitorName,
        relationship,
        contributorEmail,
        message,
        status,
      });

      return res.json({
        success: true,
        message: 'Tribute updated successfully',
        data: updated,
      });
    } catch (error) {
      console.error('[Admin API] Error updating tribute:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to update tribute',
      });
    }
  }
);

/**
 * DELETE /api/admin/tributes/:id
 * Removes an abusive, spam, or deleted tribute
 */
adminTributesRouter.delete('/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await db.findTributeById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Tribute not found' });
    }

    await db.deleteTribute(id);

    return res.json({
      success: true,
      message: 'Tribute deleted successfully',
    });
  } catch (error) {
    console.error('[Admin API] Error deleting tribute:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to remove tribute',
    });
  }
});
