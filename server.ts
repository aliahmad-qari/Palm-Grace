import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './server/config.js';
import { configureCors } from './server/middleware/cors.js';
import { requireAdminAuth } from './server/middleware/auth.js';
import { authRouter } from './server/routes/auth.js';
import { memorialsRouter } from './server/routes/memorials.js';
import { adminMemorialsRouter } from './server/routes/adminMemorials.js';
import { adminTributesRouter } from './server/routes/adminTributes.js';
import { adminMediaRouter } from './server/routes/adminMedia.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // Basic security & parsing
  app.set('trust proxy', 1);
  app.use(configureCors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
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
  app.use('/api/admin/memorials', requireAdminAuth, adminMemorialsRouter);
  app.use('/api/admin/tributes', requireAdminAuth, adminTributesRouter);
  app.use('/api/admin/media', requireAdminAuth, adminMediaRouter);

  // Development vs Production frontend mounting
  if (!config.isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(config.port, '0.0.0.0', () => {
    console.log(`🕊️ Palm & Grace Server running on port ${config.port} [${config.nodeEnv}]`);
    console.log(`🔗 API endpoint: http://0.0.0.0:${config.port}/api`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
