import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { publicContactEmail, publicContactPhoneDisplay, publicContactPhoneHref, publicContactWhatsAppHref } from '../../lib/publicContact.js';

export const PublicFooter: React.FC = () => (
  <footer className="border-t border-brand-gold/30 bg-brand-primary text-brand-white">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_.8fr_1fr]">
        <div className="max-w-md space-y-6">
          <Link to="/" className="inline-flex bg-brand-gold-light/90 p-2" aria-label="Palm and Grace home">
            <BrandLogo variant="horizontal" size="medium" className="max-w-[224px] [&_img]:block [&_img]:rounded-none" />
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
          <Link to="/begin-a-memorial" className="inline-flex min-h-11 items-center justify-center bg-brand-gold-light px-5 text-sm font-semibold rounded text-brand-primary transition-colors hover:bg-brand-gold-light">Begin a Memorial</Link>
        </div>
        <div>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold-light">Contact</h2>
          <ul className="space-y-3 text-sm text-brand-white/75">
            <li><a href={`mailto:${publicContactEmail}`} className="hover:text-brand-gold-light">{publicContactEmail}</a></li>
            <li><a href={publicContactPhoneHref} className="hover:text-brand-gold-light">{publicContactPhoneDisplay}</a></li>
            <li><a href={publicContactWhatsAppHref} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold-light">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-12 flex flex-col gap-3 border-t border-brand-white/15 pt-6 text-xs text-brand-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Palm &amp; Grace. All rights reserved.</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2"><Link to="/privacy" className="hover:text-brand-gold-light">Privacy Notice</Link><Link to="/terms" className="hover:text-brand-gold-light">Terms of Use</Link><Link to="/admin/login" className="hover:text-brand-gold-light">Administrator sign in</Link></div>
      </div>
    </div>
  </footer>
);
