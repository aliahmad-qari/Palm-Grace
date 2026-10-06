# Palm & Grace Backend API

Express + TypeScript + Prisma ORM backend for Palm & Grace Phase 1 MVP.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+ (or use in-memory fallback for development)
- Environment variables (.env file)

### Installation

```bash
# From workspace root
npm install

# Or from this directory
cd apps/api
npm install
```

### Development

```bash
# From workspace root
npm run dev:api

# Or from this directory
npm run dev
```

Server starts on `http://localhost:3000`

### Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secure random 64-character string for production
- `CORS_ORIGIN` - Comma-separated list of allowed origins
- `CLOUDINARY_*` - Media storage credentials

### Website notification email (Zoho Mail REST API)

Configure `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`,
`ZOHO_ACCOUNT_ID`, `ZOHO_ACCOUNTS_URL`, `ZOHO_MAIL_API_URL`, `ZOHO_FROM_EMAIL`,
and `ZOHO_TO_EMAIL` in Render only. Current non-secret settings are account ID
`7651386000000008002`, accounts URL `https://accounts.zoho.com`, mail API URL
`https://mail.zoho.com`, and `care@palmandgrace.org` for both sender and recipient.
The backend refreshes and caches OAuth access tokens; no secrets or tokens are
sent to Vercel. This uses HTTPS and works on Render Free, subject to valid Zoho
credentials and permission. A partial Zoho configuration fails explicitly.

Zoho's published send-message API does not document a per-message Reply-To
field. Enquiry notifications therefore include a prominent "Reply to enquirer"
mailto link and the submitted address; verify any desired native Reply-To header
separately with Zoho before relying on the email client's Reply button.

The old Brevo and SMTP implementations remain in the repository until all three
notification workflows are confirmed in production. SMTP is not used by the
active website routes.

After configuring Render and deploying the backend, use its shell to run
`npm run zoho:test --workspace apps/api`; confirm the test message arrives in
the configured inbox. Then test the two enquiry forms and one sample tribute.

### Legacy SMTP configuration (inactive)

`SMTP_*` and `MAIL_*` configuration, the SMTP service, and its test scripts are
retained temporarily for migration history only. Do not use them on Render Free;
that platform blocks outbound SMTP ports. Tribute submissions remain pending
review even if an email notification fails.

### Database

#### Prisma Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Validate schema
npm run prisma:validate

# Run migrations
npm run prisma:migrate

# Production migration (for Render deployment)
npm run prisma:migrate:prod

# Open Prisma Studio (UI for database)
npm run prisma:studio
```

#### Fallback Database

If PostgreSQL is unavailable, the API gracefully falls back to an in-memory database with seeded sample data. This is useful for development and testing without database setup.

### API Endpoints

#### Public Routes
- `GET /api/health` - Health check
- `GET /api/memorials` - List published memorials (searchable)
- `GET /api/memorials/:slug` - Single memorial by slug
- `POST /api/memorials/:slug/tributes` - Submit visitor tribute

#### Admin Routes (require authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/admin/memorials` - List all memorials (drafts + published)
- `POST /api/admin/memorials` - Create memorial
- `GET /api/admin/memorials/:id` - Get memorial for editing
- `PUT /api/admin/memorials/:id` - Update memorial
- `DELETE /api/admin/memorials/:id` - Delete memorial
- `GET /api/admin/memorials/:id/qr` - Generate QR code (SVG or PNG)
- `GET /api/admin/tributes` - List tributes for moderation
- `PATCH /api/admin/tributes/:id/status` - Approve/reject tribute
- `DELETE /api/admin/tributes/:id` - Delete tribute
- `POST /api/admin/media/signature` - Cloudinary upload signature
- `POST /api/admin/media` - Save media to gallery
- `PUT /api/admin/media/reorder` - Reorder gallery photos
- `DELETE /api/admin/media/:id` - Delete media

### Build

```bash
npm run build
```

Outputs TypeScript to `dist/` directory.

### Deployment (Render)

1. Connect this repository to Render
2. Set build command: `npm run build`
3. Set start command: `node dist/index.js`
4. Configure environment variables (DATABASE_URL, JWT_SECRET, CORS_ORIGIN, etc.)
5. Deploy

### Testing

```bash
npm run test
```

Runs Node.js native test runner against `test/*.test.ts`.

### Type Checking

```bash
npm run lint
```

Runs TypeScript strict mode validation.

---

## Architecture

### Directory Structure

```
src/
├── index.ts              # Express app entry point
├── server/
│   ├── config.ts         # Environment configuration (Zod validated)
│   ├── db.ts             # Data layer (Prisma + fallback)
│   ├── middleware/       # Express middleware
│   │   ├── auth.ts       # Admin authentication
│   │   ├── cors.ts       # CORS configuration
│   │   ├── rateLimit.ts  # Rate limiting for tributes
│   │   └── validate.ts   # Zod schema validation
│   ├── routes/           # REST API endpoints
│   │   ├── auth.ts       # Authentication routes
│   │   ├── memorials.ts  # Public memorial routes
│   │   ├── adminMemorials.ts    # Admin memorial CRUD
│   │   ├── adminTributes.ts     # Admin tribute moderation
│   │   └── adminMedia.ts        # Admin media management
│   └── validators/       # Zod schemas for request validation
│       └── index.ts      # All validation schemas
prisma/
├── schema.prisma         # PostgreSQL data model
└── migrations/           # Database migration history
```

### Key Technologies

- **Express** - HTTP framework
- **TypeScript** - Type-safe development
- **Prisma** - ORM with PostgreSQL
- **Zod** - Request validation & environment config
- **JWT** - Admin authentication (HTTP-Only cookies)
- **bcryptjs** - Password hashing
- **QRCode** - QR generation (SVG & PNG)
- **Cloudinary** - Media storage integration

### Authentication Flow

1. Admin logs in with email/password → `POST /api/auth/login`
2. API returns HTTP-Only secure cookie with JWT
3. Browser automatically sends cookie on subsequent requests
4. `requireAdminAuth` middleware validates JWT from cookie
5. Admin logs out → `POST /api/auth/logout` clears cookie

### Database Schema

**Models:**
- `AdminUser` - Admin accounts with bcrypt password hashing
- `Memorial` - Individual memorials with unique slugs
- `MemorialMedia` - Photo gallery with sortable items
- `Tribute` - Visitor memories (PENDING → APPROVED/REJECTED)

**Enums:**
- `TemplateType` - MALE | FEMALE | CHILD
- `PublicationStatus` - DRAFT | PUBLISHED
- `TributeStatus` - PENDING | APPROVED | REJECTED

### Error Handling

All endpoints return consistent JSON error responses:

```json
{
  "error": "Error message",
  "details": "Additional context (if applicable)"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad request (validation error)
- `401` - Unauthorized (missing/invalid JWT)
- `403` - Forbidden
- `404` - Not found
- `500` - Server error

---

## Deployment Checklist

- [ ] PostgreSQL database provisioned on Render or compatible service
- [ ] Environment variables configured (DATABASE_URL, JWT_SECRET, CORS_ORIGIN)
- [ ] Prisma migrations run: `npm run prisma:migrate:prod`
- [ ] Build successful: `npm run build`
- [ ] Health check endpoint accessible: `GET /api/health`
- [ ] CORS configured for production frontend domain
- [ ] Cloudinary credentials configured (if media uploads needed)
- [ ] Logs configured for monitoring

---

## License

Proprietary - Palm & Grace © 2026
