import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
    <header className="sticky top-0 z-40 border-b border-brand-gold/30 bg-white/[.88] text-brand-primary shadow-[0_10px_35px_rgba(20,35,25,0.12)] backdrop-blur-xl">
      <div className="mx-auto flex h-[84px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={() => setIsMobileOpen(false)} className="flex shrink-0 items-center" aria-label="Palm and Grace home">
          <BrandLogo variant="horizontal" size="medium" className="max-w-[190px] sm:max-w-[224px] [&_img]:block [&_img]:rounded-none" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} className={`border-b py-2 text-sm font-medium transition-colors ${isActive(link.href) ? 'border-brand-gold text-brand-primary' : 'border-transparent text-brand-charcoal/75 hover:text-brand-primary'}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        <Link to="/begin-a-memorial" className="hidden min-h-11 items-center justify-center bg-brand-gold px-5 text-sm font-semibold text-brand-primary shadow-[0_8px_24px_rgba(198,165,101,0.28)] transition-colors hover:bg-brand-gold-light lg:inline-flex">
          Begin a Memorial
        </Link>

        <button type="button" aria-label={isMobileOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={isMobileOpen} onClick={() => setIsMobileOpen((open) => !open)} className="inline-flex h-11 w-11 items-center justify-center border border-brand-gold/50 bg-brand-primary/5 text-brand-primary backdrop-blur-md lg:hidden">
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMobileOpen && (
        <nav className="border-t border-brand-gold/25 bg-white/95 px-4 py-5 backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => <Link key={link.href} to={link.href} onClick={() => setIsMobileOpen(false)} className={`px-4 py-3 text-sm font-medium ${isActive(link.href) ? 'bg-brand-primary/[.08] text-brand-primary' : 'text-brand-charcoal/75'}`}>{link.label}</Link>)}
            <Link to="/begin-a-memorial" onClick={() => setIsMobileOpen(false)} className="mt-3 flex min-h-12 items-center justify-center bg-brand-gold px-5 text-sm font-semibold text-brand-primary">Begin a Memorial</Link>
          </div>
        </nav>
      )}
    </header>
  );
};
