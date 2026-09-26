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
}

export async function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or invalid authorization token'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string };

    const admin = await db.findAdminById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Admin user no longer exists'
      });
    }

    req.adminUser = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Token has expired or is invalid'
    });
  }
}
