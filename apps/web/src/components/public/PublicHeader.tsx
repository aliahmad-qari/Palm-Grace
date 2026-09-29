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
    { label: 'Care Partners', href: '/our-care-partners' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname === href;
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-brand-primary via-brand-primary to-brand-secondary shadow-xl border-b-4 border-brand-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Brand Logo - Professional with Icon Only */}
          <Link
            to="/"
            className="group flex items-center gap-3 flex-shrink-0"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all border-2 border-brand-gold">
              <BrandLogo 
                variant="icon" 
                size="small"
                className="opacity-100"
                isHovered={false}
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif text-xl font-bold text-white drop-shadow-md">Palm & Grace</span>
              <span className="text-xs text-brand-gold-light font-medium tracking-wide">MEMORIALS</span>
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
                <span className={`absolute -bottom-2 left-0 h-1.5 bg-brand-gold transition-all duration-300 ${
                  isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/memorials"
              className="px-5 py-2.5 text-sm font-bold text-brand-primary bg-brand-gold-light hover:bg-brand-gold rounded-lg shadow-md hover:shadow-lg transition-all uppercase tracking-wide border-2 border-brand-gold"
            >
              Search
            </Link>
            <Link
              to="/begin-a-memorial"
              className="px-6 py-2.5 text-sm font-bold text-white bg-brand-gold hover:bg-brand-gold-light hover:text-brand-primary rounded-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group uppercase tracking-wide border-2 border-brand-gold-light"
            >
              <Heart className="w-4 h-4 group-hover:scale-125 transition-transform" />
              <span>Begin</span>
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
        <div className="lg:hidden bg-gradient-to-b from-brand-primary to-brand-secondary border-t-4 border-brand-gold px-4 pt-4 pb-6 space-y-4 font-sans shadow-lg">
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
              className="block px-4 py-3 text-center text-sm font-bold text-brand-primary bg-brand-gold rounded-lg hover:bg-brand-gold-light transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
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
