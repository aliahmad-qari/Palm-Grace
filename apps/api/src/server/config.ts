import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.string().default('http://localhost:3000'),
  PUBLIC_SITE_URL: z.string().optional(),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/palm_and_grace'),
  JWT_SECRET: z.string().default('palm-and-grace-jwt-secret-phase-1-mvp-2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ADMIN_DEFAULT_EMAIL: z.string().email().default('admin@palmgrace.com'),
  ADMIN_DEFAULT_PASSWORD: z.string().default('ChangeMeOnFirstLogin2026!'),
  ADMIN_DEFAULT_NAME: z.string().default('Palm & Grace Administrator'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:5173,http://localhost:3001,https://palm-grace-web.vercel.app'),
  CLOUDINARY_CLOUD_NAME: z.string().default('demo'),
  CLOUDINARY_API_KEY: z.string().default(''),
  CLOUDINARY_API_SECRET: z.string().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn('⚠️ Environment variable validation warnings:', parsed.error.format());
}

export function resolvePublicSiteUrl(
  nodeEnv = process.env.NODE_ENV,
  configuredUrl = process.env.PUBLIC_SITE_URL,
  appUrl = process.env.APP_URL
): string {
  const site = new URL(configuredUrl || (
    nodeEnv === 'production'
      ? 'https://palm-grace-web.vercel.app'
      : appUrl || 'http://localhost:3000'
  ));

  if (
    !['http:', 'https:'].includes(site.protocol) ||
    (nodeEnv === 'production' && (
      site.protocol !== 'https:' ||
      ['localhost', '127.0.0.1', '::1'].includes(site.hostname)
    ))
  ) {
    throw new Error('PUBLIC_SITE_URL must be a public HTTPS URL in production');
  }

  return site.origin;
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  publicSiteUrl: resolvePublicSiteUrl(),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/palm_and_grace',
  jwtSecret: process.env.JWT_SECRET || 'palm-and-grace-jwt-secret-phase-1-mvp-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  admin: {
    email: process.env.ADMIN_DEFAULT_EMAIL || 'admin@palmgrace.com',
    password: process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeMeOnFirstLogin2026!',
    name: process.env.ADMIN_DEFAULT_NAME || 'Palm & Grace Administrator',
  },
  corsOrigins: [
    ...(process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173,https://palm-and-grace.vercel.app')
      .split(',')
      .map(o => o.trim())
      .filter(Boolean),
    ...(process.env.APP_URL ? [process.env.APP_URL.trim()] : []),
  ],
  enablePublicDirectory: process.env.ENABLE_PUBLIC_DIRECTORY !== 'false',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  }
};
