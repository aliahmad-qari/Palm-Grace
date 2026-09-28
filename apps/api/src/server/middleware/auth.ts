import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { db } from '../db.js';

export interface AuthenticatedRequest extends Request {
  adminUser?: {
    id: string;
    email: string;
    name: string;
  };
  cookies: Record<string, string>;
  headers: Record<string, string | string[] | undefined>;
  body: any;
  params: Record<string, string>;
  query: Record<string, string | string[] | undefined>;
}

/**
 * Middleware to verify admin authentication
 * Supports both HTTP-Only cookies and Bearer tokens for backward compatibility
 */
export async function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> {
  try {
    let token: string | null = null;

    // Try HTTP-Only cookie first (preferred)
    if (req.cookies && req.cookies.palmGraceAuth) {
      token = req.cookies.palmGraceAuth;
    }
    
    // Fallback to Bearer token header (for backward compatibility)
    if (!token && req.headers.authorization) {
      const authHeader = Array.isArray(req.headers.authorization) 
        ? req.headers.authorization[0] 
        : req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized: Missing authentication credentials',
        message: 'No JWT token found in cookies or Authorization header'
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string };

    const admin = await db.findAdminById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        error: 'Unauthorized: Admin user no longer exists'
      });
    }

    req.adminUser = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };

    next();
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Invalid token';
    return res.status(401).json({
      error: 'Unauthorized: Authentication failed',
      details: error
    });
  }
}

/**
 * Generate a secure HTTP-Only cookie token
 */
export function setAuthCookie(res: Response, token: string, maxAge?: number): void {
  const cookieMaxAge = maxAge || 7 * 24 * 60 * 60 * 1000; // 7 days default

  res.cookie('palmGraceAuth', token, {
    httpOnly: true,                                    // Prevents XSS token theft
    secure: config.isProduction,                      // HTTPS only in production
    sameSite: 'lax',                                  // CSRF protection
    maxAge: cookieMaxAge,                             // 7 days
    path: '/',
    signed: false,                                    // Not signed; JWT signature is enough
  });
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie(res: Response): void {
  res.clearCookie('palmGraceAuth', {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: 'lax',
    path: '/',
  });
}
