import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';

export const PublicFooter: React.FC = () => (
  <footer className="border-t border-brand-gold/30 bg-brand-primary text-brand-white">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
      <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-md space-y-6">
          <Link to="/" className="inline-flex border border-brand-gold/30 bg-white/95 p-3 backdrop-blur-md" aria-label="Palm and Grace home">
            <BrandLogo variant="vertical" size="medium" className="[&_img]:block [&_img]:rounded-none" />
          </Link>
          <p className="font-serif text-xl leading-relaxed text-brand-gold-light">Honouring Lives. Preserving Legacies.</p>
          <p className="text-sm leading-7 text-brand-white/70">Beautifully considered digital memorial spaces where stories, photographs, voices and memories remain together with dignity, warmth and care.</p>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-light">Explore</h2>
          <ul className="space-y-3 text-sm text-brand-white/75">
            <li><Link to="/memorials" className="hover:text-brand-gold-light">Memorials</Link></li>
            <li><Link to="/our-story" className="hover:text-brand-gold-light">Our Story</Link></li>
            <li><Link to="/our-care-partners" className="hover:text-brand-gold-light">Our Care Partners</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-light">Begin</h2>
          <p className="mb-5 text-sm leading-7 text-brand-white/70">You do not need to have everything prepared. Begin with a conversation.</p>
          <Link to="/begin-a-memorial" className="inline-flex min-h-11 items-center justify-center bg-brand-gold px-5 text-sm font-semibold text-brand-primary transition-colors hover:bg-brand-gold-light">Begin a Memorial</Link>
        </div>
      </div>
      <div className="mt-12 flex flex-col gap-3 border-t border-brand-white/15 pt-6 text-xs text-brand-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Palm &amp; Grace. All rights reserved.</p>
        <p>Remembered with dignity. Preserved with care.</p>
      </div>
    </div>
  </footer>
);
