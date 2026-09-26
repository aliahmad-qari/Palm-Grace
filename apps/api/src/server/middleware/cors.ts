import cors, { CorsOptions } from 'cors';
import { config } from '../config.js';

export function configureCors() {
  const allowedOrigins = config.corsOrigins;

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server, Postman)
      if (!origin) return callback(null, true);

      // Check explicit allowed origins
      const isAllowed =
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        // Vercel production deployments
        origin.endsWith('.vercel.app') ||
        // Google Cloud Run & AI Studio
        origin.endsWith('.run.app') ||
        origin.endsWith('.google.com') ||
        origin.endsWith('.aistudio.google.com') ||
        // Local development
        /^https?:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(origin);

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from unauthorized origin: ${origin}`);
        callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      }
    },
    // Allow credentials (HTTP-Only cookies will be included)
    credentials: true,
    // Methods
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // Headers
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Cookie'
    ],
    // Expose headers
    exposedHeaders: [
      'Content-Disposition',
      'Set-Cookie'
    ],
    // Preflight cache (24 hours)
    maxAge: 86400,
  };

  return cors(corsOptions);
}
