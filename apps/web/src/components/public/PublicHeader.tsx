import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const PublicHeader: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Memorials', href: '/memorials' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'Our Care Partners', href: '/our-care-partners' },
    { label: 'Begin a Memorial', href: '/begin-a-memorial' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname === href;
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-primary/80 backdrop-blur-xl backdrop-saturate-150 shadow-lg border-b border-brand-gold/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official full wordmark in a restrained glass panel */}
          <Link
            to="/"
            className="group flex items-center gap-3 shrink-0"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-44 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center px-3 py-2 shadow-md group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300 border border-white/25 ring-1 ring-brand-gold/30">
              <BrandLogo variant="horizontal" size="small" className="opacity-100" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-12 font-sans">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-bold tracking-wider transition-all duration-300 relative group uppercase ${
                  isActive(link.href)
                    ? 'text-brand-gold'
                    : 'text-brand-white/90 hover:text-brand-gold'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-2 left-0 h-0.5 rounded-full bg-brand-gold transition-all duration-300 ${
                  isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/memorials"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-all uppercase tracking-wide border border-white/30"
            >
              Search
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-brand-gold hover:bg-white/15 rounded-lg transition-colors"
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-brand-primary/95 backdrop-blur-xl border-t border-brand-gold/30 px-4 pt-4 pb-6 space-y-4 font-sans shadow-xl">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-bold transition-all uppercase tracking-wide ${
                  isActive(link.href)
                    ? 'bg-brand-gold text-brand-primary'
                    : 'text-brand-white/90 hover:bg-brand-gold/20 hover:text-brand-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t-2 border-brand-gold flex flex-col gap-3">
            <Link
              to="/memorials"
              onClick={() => setIsMobileOpen(false)}
              className="block px-4 py-3 text-center text-sm font-bold text-brand-primary bg-brand-gold-light rounded-lg hover:bg-brand-gold transition-colors uppercase tracking-wide"
            >
              Search Memorials
            </Link>
            <Link
              to="/begin-a-memorial"
              onClick={() => setIsMobileOpen(false)}
              className="px-4 py-3 text-center text-sm font-bold text-brand-primary bg-brand-gold rounded-lg hover:bg-brand-gold-light transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              <Heart className="w-4 h-4" />
              <span>Begin a Memorial</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
