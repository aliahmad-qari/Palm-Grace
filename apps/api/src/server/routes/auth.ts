import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';
import { config } from '../config.js';
import { validateBody } from '../middleware/validate.js';
import { loginSchema } from '../validators/index.js';
import { requireAdminAuth, AuthenticatedRequest, setAuthCookie, clearAuthCookie } from '../middleware/auth.js';

export const authRouter = Router();

/**
 * POST /api/auth/login
 * Authenticates admin credentials and returns HTTP-Only JWT cookie
 */
authRouter.post('/login', validateBody(loginSchema), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await db.findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
    );

    // Set HTTP-Only secure cookie
    setAuthCookie(res, token);

    return res.json({
      authenticated: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/auth/session
 * Validates and retrieves current administrator session details
 */
authRouter.get('/session', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
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
    authenticated: true,
    admin: req.adminUser,
  });
});

/**
 * POST /api/auth/logout
 * Clears authentication cookie and ends session
 */
authRouter.post('/logout', (req: Request, res: Response) => {
  clearAuthCookie(res);
  return res.json({
    authenticated: false,
    message: 'Successfully logged out',
  });
});
