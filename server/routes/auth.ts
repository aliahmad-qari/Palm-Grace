import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { config } from '../config.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema } from '../validators/index.js';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const authRouter = Router();

/**
 * POST /api/auth/login
 * Authenticates admin credentials and returns JWT token
 */
authRouter.post('/login', validateBody(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await db.findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials',
      });
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password credentials',
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred during authentication',
    });
  }
});

/**
 * GET /api/auth/session
 * Validates and retrieves current administrator session details
 */
authRouter.get('/session', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    authenticated: true,
    session: {
      user: req.adminUser,
      role: 'ADMINISTRATOR',
      activeAt: new Date().toISOString(),
    },
  });
});

/**
 * GET /api/auth/me
 * Retrieves profile of currently authenticated administrator
 */
authRouter.get('/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    admin: req.adminUser,
  });
});

/**
 * POST /api/auth/logout
 */
authRouter.post('/logout', (req: Request, res: Response) => {
  return res.json({
    success: true,
    authenticated: false,
    message: 'Administrator session ended successfully',
  });
});
