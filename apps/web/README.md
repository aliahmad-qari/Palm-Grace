# Palm & Grace Frontend

Next.js 15 App Router frontend for Palm & Grace Phase 1 MVP. Deployed on Vercel.

## Quick Start

### Prerequisites
- Node.js 18+
- Environment variables (.env.local file)

### Installation

```bash
# From workspace root
npm install

# Or from this directory
cd apps/web
npm install
```

### Development

```bash
# From workspace root
npm run dev:web

# Or from this directory
npm run dev
```

Frontend starts on `http://localhost:3001` (development)

### Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Key variables:
- `NEXT_PUBLIC_API_URL` - Backend API endpoint (http://localhost:3000/api for dev)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - For image optimization

### Build

```bash
npm run build
```

Generates optimized production build.

### Production

```bash
npm run start
```

Starts production server on port 3000.

### Type Checking

```bash
npm run type-check
```

Runs TypeScript validation.

## Deployment (Vercel)

### One-Click Deploy

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL=https://palm-grace-api.render.com/api` (production API)
4. Deploy

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://palm-grace-api.render.com/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NODE_ENV=production
```

## Architecture

### Directory Structure

```
app/                    # Next.js App Router
├── layout.tsx          # Root layout (Phase 1)
├── page.tsx            # Homepage (Phase 2)
├── memorials/
│   ├── page.tsx        # Memorial directory (Phase 2)
│   └── [slug]/
│       └── page.tsx    # Individual memorial view (Phase 2)
├── admin/              # Admin console (Phase 4)
│   ├── login/
│   ├── memorials/
│   ├── tributes/
│   └── media/
└── api/                # Next.js API routes (if needed)

src/                    # React components & utilities (Phase 2+)
├── components/         # Reusable React components
├── lib/               # API client & utilities
└── types/             # TypeScript types
```

### Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React 19** - UI framework
- **Vercel** - Hosting & deployment

### Phase Roadmap

#### Phase 1 (Current)
- [x] Next.js App Router skeleton
- [x] Layout & metadata setup
- [ ] TypeScript strict mode
- [ ] Build validation

#### Phase 2
- [ ] Homepage with hero section
- [ ] Public memorial directory
- [ ] Individual memorial pages (SSR with Open Graph)
- [ ] Responsive design (mobile-first)

#### Phase 3
- [ ] Memorial templates (Male, Female, Child)
- [ ] Photo gallery component
- [ ] Social sharing modal

#### Phase 4
- [ ] Admin login page
- [ ] Admin dashboard
- [ ] Memorial editor
- [ ] Media uploader

#### Phase 5
- [ ] Tribute submission form
- [ ] Tribute display
- [ ] QR code viewer

#### Phase 6
- [ ] E2E testing
- [ ] Performance optimization
- [ ] SEO & analytics

## Development Guidelines

### Component Structure

```typescript
// Functional components with TypeScript
import type { ReactNode } from 'react';

interface MyComponentProps {
  title: string;
  children?: ReactNode;
}

export function MyComponent({ title, children }: MyComponentProps) {
  return <div>{title}{children}</div>;
}
```

### API Integration

```typescript
// Use fetch with API_URL from env
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchMemorials(search?: string) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  
  const response = await fetch(`${API_URL}/memorials?${params}`);
  return response.json();
}
```

### Metadata & SEO

```typescript
// Use Next.js metadata API for SSR meta tags
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memorial Name - Palm & Grace',
  description: 'Life story and tributes',
  openGraph: {
    type: 'website',
    url: 'https://palm-and-grace.vercel.app/memorial/john-doe',
    title: 'Memorial Name',
    description: 'Life story and tributes',
    images: [{ url: 'https://...' }],
  },
};
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using port 3001
Get-NetTcpConnection -LocalPort 3001

# Kill the process (PowerShell)
Get-Process -Id (Get-NetTcpConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

### API Connection Issues

- Ensure backend is running on http://localhost:3000
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify CORS is configured correctly in backend

### Build Errors

```bash
# Clear Next.js cache
rm -r .next

# Reinstall dependencies
rm -r node_modules
npm install

# Rebuild
npm run build
```

---

## License

Proprietary - Palm & Grace © 2026
