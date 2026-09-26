# 🕊️ Palm & Grace - Phase 1 MVP

A premium, responsive digital memorial platform for preserving memories, stories, photographs and tributes.

**Status**: Phase 1 - Architecture Foundation (Monorepo Restructure Complete)

---

## 📁 Monorepo Structure

This is a monorepo containing the complete Palm & Grace Phase 1 platform:

```
Palm & Grace/
├── apps/
│   ├── api/                 # Express.js Backend (Node.js/TypeScript)
│   │   ├── src/
│   │   │   ├── index.ts                    # Entry point
│   │   │   └── server/                     # Express app
│   │   │       ├── config.ts               # Configuration
│   │   │       ├── db.ts                   # Prisma data layer
│   │   │       ├── middleware/             # Auth, CORS, validation
│   │   │       ├── routes/                 # REST endpoints
│   │   │       └── validators/             # Zod schemas
│   │   ├── prisma/
│   │   │   ├── schema.prisma               # PostgreSQL model
│   │   │   └── migrations/                 # Migration history
│   │   ├── test/                           # API tests
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env.example
│   │
│   └── web/                 # Next.js Frontend (React/TypeScript)
│       ├── app/                            # Next.js App Router
│       │   ├── layout.tsx                  # Root layout
│       │   ├── page.tsx                    # Homepage
│       │   ├── memorials/                  # Memorial pages
│       │   └── admin/                      # Admin console
│       ├── src/                            # React components & utilities
│       ├── public/                         # Static assets
│       ├── package.json
│       ├── next.config.ts
│       ├── tsconfig.json
│       └── .env.example
│
├── package.json             # Workspace root (npm workspaces)
├── README.md               # This file
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **PostgreSQL** 12+ (optional - in-memory fallback for development)
- **npm** or **bun** package manager

### Installation

```bash
# Install all dependencies
npm install

# Or if using bun
bun install
```

### Development

```bash
# Start both API and frontend concurrently
npm run dev

# API will run on: http://localhost:3000
# Web will run on: http://localhost:3001

# Or start individually
npm run dev:api    # Backend only (port 3000)
npm run dev:web    # Frontend only (port 3001)
```

### Build & Production

```bash
# Build all apps
npm run build

# Start production server (API only)
npm run start
```

---

## 📋 Workspace Commands

### Development
```bash
npm run dev              # Start API + frontend (concurrently)
npm run dev:api         # Start API only
npm run dev:web         # Start frontend only
```

### Building
```bash
npm run build            # Build all apps
npm run build:api       # Build backend only
npm run build:web       # Build frontend only
```

### Database (Prisma)
```bash
npm run prisma:generate  # Generate Prisma client
npm run prisma:validate  # Validate schema syntax
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (database UI)
```

### Quality Assurance
```bash
npm run lint            # TypeScript strict mode validation
npm run type-check      # Type check all applications
npm run test            # Run test suite
```

---

## 🌐 API Endpoints

### Public Routes
```
GET    /api/health              Health check & platform status
GET    /api/memorials           List published memorials (searchable)
GET    /api/memorials/:slug     Get single memorial by unique slug
POST   /api/memorials/:slug/tributes  Submit visitor tribute
```

### Admin Routes (Authentication Required)
```
POST   /api/auth/login          Admin login → returns HTTP-Only JWT cookie
POST   /api/auth/logout         Admin logout → clears cookie

GET    /api/admin/memorials     List all memorials (drafts + published)
POST   /api/admin/memorials     Create new memorial
GET    /api/admin/memorials/:id Get memorial details for editing
PUT    /api/admin/memorials/:id Update memorial information
DELETE /api/admin/memorials/:id Delete memorial

GET    /api/admin/memorials/:id/qr    Generate QR code (SVG or PNG)
GET    /api/admin/tributes      List tributes (filterable by status)
PATCH  /api/admin/tributes/:id/status Approve or reject tribute
DELETE /api/admin/tributes/:id  Delete tribute

POST   /api/admin/media/signature     Generate Cloudinary signature
POST   /api/admin/media              Add photo to memorial gallery
PUT    /api/admin/media/reorder      Reorder gallery photos
DELETE /api/admin/media/:id          Remove photo from gallery
```

---

## 📦 Backend Features (API)

### ✅ Completed
- [x] Express.js REST API foundation
- [x] PostgreSQL with Prisma ORM
- [x] Zod schema validation for all requests
- [x] JWT authentication with HTTP-Only cookies
- [x] bcryptjs password hashing
- [x] CORS configuration for Vercel + local dev
- [x] Rate limiting on public endpoints
- [x] QR code generation (SVG & PNG high-resolution)
- [x] Cloudinary media integration (upload signatures)
- [x] Admin CRUD for memorials, tributes, media
- [x] Tribute moderation workflow (PENDING → APPROVED/REJECTED)
- [x] Conditional livestream/recording visibility
- [x] In-memory fallback database (dev without PostgreSQL)
- [x] Comprehensive environment validation
- [x] Error handling & logging

### 📚 Documentation
See `apps/api/README.md` for complete backend documentation.

---

## 📦 Frontend Features (Web)

### ✅ Completed
- [x] Next.js 15 App Router setup
- [x] TypeScript strict mode
- [x] Root layout & metadata configuration
- [x] Placeholder homepage

### 🏗️ Planned (Phase 2-6)
- [ ] Homepage with hero section
- [ ] Public memorial directory with search
- [ ] Individual memorial pages with SSR & Open Graph
- [ ] Three memorial templates (Male, Female, Child visual directions)
- [ ] Photo gallery component with lightbox
- [ ] Admin authentication & dashboard
- [ ] Memorial editor with WYSIWYG
- [ ] Media uploader (Cloudinary integration)
- [ ] Tribute display & submission
- [ ] Social sharing (WhatsApp, Twitter, Facebook)
- [ ] Responsive design (mobile-first)
- [ ] Performance optimization
- [ ] End-to-end testing

### 📚 Documentation
See `apps/web/README.md` for complete frontend documentation.

---

## 🌍 Deployment

### Backend (Render)

**Environment:**
- Runtime: Node.js
- Start Command: `node apps/api/dist/index.js`
- Build Command: `npm run build:api`

**Required Environment Variables:**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=<secure-random-64-char-string>
CORS_ORIGIN=https://palm-and-grace.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (Vercel)

**Configuration:**
- Framework: Next.js
- Root Directory: `apps/web`
- Build Command: `npm run build:web` or `cd apps/web && npm run build`
- Output Directory: `apps/web/.next`

**Required Environment Variables:**
```env
NEXT_PUBLIC_API_URL=https://palm-grace-api.render.com/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 🔐 Security

### Authentication
- Admin credentials validated with **bcryptjs**
- JWT tokens stored in **HTTP-Only secure cookies** (XSS-safe)
- CSRF protection via SameSite=Lax
- Environment variables validated with **Zod**

### API Security
- CORS restricted to known origins
- Rate limiting on public endpoints (tributes)
- Input validation on all requests
- SQL injection prevention via Prisma
- Sensitive secrets never exposed in code

### Environment
- `.env` files never committed (use `.env.example`)
- Production secrets configured through deployment platform
- Local development uses optional in-memory database

---

## 🧪 Testing

### API Tests
```bash
npm run test
```

Runs Node.js test runner against `apps/api/test/*.test.ts`

### Local Development Testing
```bash
# API health check
curl http://localhost:3000/api/health

# List public memorials
curl http://localhost:3000/api/memorials

# Admin login (set credentials in .env)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@palmgrace.com","password":"..."}'
```

---

## 📖 Documentation

- **Full Architecture**: See signed proposal document
- **API Documentation**: `apps/api/README.md`
- **Frontend Documentation**: `apps/web/README.md`
- **Database Schema**: `apps/api/prisma/schema.prisma`
- **Audit Report**: See Palm & Grace Phase 1 MVP Development Proposal

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or on Windows (PowerShell)
Get-NetTcpConnection -LocalPort 3000 | 
  Foreach-Object { Get-Process -Id $_.OwningProcess } | 
  Stop-Process -Force
```

### PostgreSQL Connection Failed
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Or allow in-memory fallback for development (app continues without DB)

### Dependencies Installation Failed
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Build Errors
```bash
# Clean build artifacts
npm run clean

# Rebuild
npm run build
```

---

## 📋 Phase 1 Deliverables Checklist

- [x] PostgreSQL database schema (Prisma)
- [x] Express REST API with authentication
- [x] Admin CRUD for memorials
- [x] Tribute submission & moderation
- [x] QR code generation
- [x] Media management (Cloudinary integration)
- [x] Conditional livestream/recording visibility
- [x] CORS & security configuration
- [x] Environment validation & .env setup
- [x] TypeScript strict mode
- [x] In-memory fallback database
- [x] Next.js 15 App Router setup
- [x] Monorepo structure
- [ ] Frontend pages & components (Phase 2)
- [ ] End-to-end testing (Phase 6)
- [ ] Production deployment (Phase 6)

---

## 📞 Support

For specific documentation:
- **Backend Issues**: See `apps/api/README.md`
- **Frontend Issues**: See `apps/web/README.md`
- **Database Issues**: Check Prisma documentation
- **Deployment**: Refer to Render & Vercel docs

---

## 📜 License

Proprietary - Palm & Grace © 2026

---

**Last Updated**: September 26, 2026  
**Phase**: 1 - MVP (Foundation & Backend)  
**Status**: Monorepo Architecture Complete ✅
