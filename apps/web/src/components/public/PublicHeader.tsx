import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, Search, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const PublicHeader: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Memorials', href: '/memorials' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Our Care Partners', href: '/our-care-partners' },
  ];
  const isActive = (href: string) => href === '/' ? location.pathname === '/' : location.pathname === href;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto w-full max-w-[1360px] px-3 pt-3 sm:px-6 sm:pt-4">
        <div className="pointer-events-auto relative flex h-[72px] items-center gap-2 overflow-hidden rounded-[20px] border border-brand-primary/10 bg-header-silver px-3 shadow-[0_16px_45px_-25px_rgba(43,67,51,.55)] transition-all duration-300 sm:gap-3 sm:px-6 lg:grid lg:h-[86px] lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
          <div className="flex min-w-0 items-center lg:justify-start">
            <Link to="/" onClick={() => setIsMobileOpen(false)} className="inline-flex shrink-0 px-1 transition-opacity hover:opacity-85" aria-label="Palm and Grace home">
              <BrandLogo variant="horizontal" size="medium" className="max-w-[154px] min-[360px]:max-w-[174px] sm:max-w-[210px] [&_img]:block [&_img]:rounded-none" />
            </Link>
          </div>

          <nav className="hidden items-center justify-center gap-1 lg:flex" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={`group relative whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-px ${isActive(link.href) ? 'text-brand-primary' : 'text-brand-charcoal/70 hover:text-brand-primary'}`}>
                <span className={`absolute inset-0 -z-10 rounded-full border border-brand-gold/45 bg-gradient-to-b from-brand-gold/20 to-brand-gold/5 backdrop-blur-sm transition-all duration-300 ${isActive(link.href) ? 'scale-100 opacity-100' : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`} />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:justify-end">
            <Link to="/memorials" aria-label="Search memorials" title="Search memorials" className="hidden h-10 w-10 place-items-center rounded-xl border border-brand-primary/15 text-brand-primary transition-colors hover:border-brand-gold hover:bg-brand-gold/10 sm:grid">
              <Search className="h-4 w-4" />
            </Link>
            <Link to="/begin-a-memorial" className="hidden h-11 items-center justify-center gap-2 rounded-[11px] bg-action-gold px-5 text-xs font-semibold uppercase tracking-[0.1em] text-brand-primary shadow-[0_10px_30px_-14px_rgba(198,165,101,.9)] transition-all hover:-translate-y-0.5 hover:bg-brand-gold-light sm:inline-flex">
              Begin a Memorial <ArrowRight className="h-4 w-4" />
            </Link>
            <button type="button" aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={isMobileOpen} onClick={() => setIsMobileOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-xl border border-brand-primary/15 text-brand-primary transition-colors hover:border-brand-gold lg:hidden">
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div className="pointer-events-auto fixed inset-0 z-50 bg-brand-primary/70 p-3 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileOpen(false)}>
          <div className="overflow-hidden rounded-[20px] border border-brand-primary/10 bg-white shadow-[0_24px_60px_-30px_rgba(0,0,0,.5)]" onClick={(event) => event.stopPropagation()}>
            <div className="flex h-[72px] items-center justify-between border-b border-brand-primary/10 px-4">
              <BrandLogo variant="horizontal" size="small" className="max-w-[174px] [&_img]:rounded-none" />
              <button type="button" aria-label="Close navigation menu" onClick={() => setIsMobileOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-brand-primary/15 text-brand-primary"><X className="h-5 w-5" /></button>
            </div>
            <nav className="px-4 py-3" aria-label="Mobile navigation">
              {navLinks.map((link) => <Link key={link.href} to={link.href} onClick={() => setIsMobileOpen(false)} className={`flex items-center justify-between border-b border-brand-primary/10 py-3.5 text-[.95rem] font-medium ${isActive(link.href) ? 'text-brand-gold' : 'text-brand-primary/85'}`}>{link.label}<ArrowRight className={`h-4 w-4 ${isActive(link.href) ? 'opacity-100' : 'opacity-30'}`} /></Link>)}
            </nav>
            <div className="space-y-2 px-4 pb-5 pt-1">
              <Link to="/memorials" onClick={() => setIsMobileOpen(false)} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-brand-primary/15 text-sm font-semibold text-brand-primary"><Search className="h-4 w-4" /> Search Memorials</Link>
              <Link to="/begin-a-memorial" onClick={() => setIsMobileOpen(false)} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-action-gold text-sm font-semibold text-brand-primary">Begin a Memorial <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
