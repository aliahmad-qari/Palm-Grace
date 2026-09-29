import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { config } from './server/config.js';
import { configureCors } from './server/middleware/cors.js';
import { requireAdminAuth } from './server/middleware/auth.js';
import { authRouter } from './server/routes/auth.js';
import { memorialsRouter } from './server/routes/memorials.js';
import { adminMemorialsRouter } from './server/routes/adminMemorials.js';
import { adminTributesRouter } from './server/routes/adminTributes.js';
import { adminMediaRouter } from './server/routes/adminMedia.js';
import { enquiriesRouter } from './server/routes/enquiries.js';
import { db } from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  if (config.admin.syncOnStart) {
    await db.syncConfiguredAdmin();
    console.log('Administrator credentials synchronised from secured environment configuration. Disable ADMIN_SYNC_ON_START after this deployment.');
  }

  const app = express();

  // Security & trust proxy
  app.set('trust proxy', 1);

  // CORS configuration
  app.use(configureCors());

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Cookie parsing (required for HTTP-Only JWT cookies)
  app.use(cookieParser());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      platform: 'Palm & Grace Backend API',
      version: 'Phase 1 MVP',
      environment: config.nodeEnv,
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/memorials', memorialsRouter);
  app.use('/api/enquiries', enquiriesRouter);
  app.use('/api/admin/memorials', requireAdminAuth, adminMemorialsRouter);
  app.use('/api/admin/tributes', requireAdminAuth, adminTributesRouter);
  app.use('/api/admin/media', requireAdminAuth, adminMediaRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      path: req.path,
      method: req.method,
    });
  });

  // Global error handler
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: config.isProduction ? 'An unexpected error occurred' : err.message,
    });
  });

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`🕊️ Palm & Grace API running on port ${config.port} [${config.nodeEnv}]`);
    console.log(`🔗 API endpoint: http://0.0.0.0:${config.port}/api`);
    console.log(`💾 Database: ${config.isProduction ? 'PostgreSQL' : 'In-memory fallback'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start API server:', err);
  process.exit(1);
});
