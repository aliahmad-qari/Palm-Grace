import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Heart } from 'lucide-react';
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

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname === href;
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-primary border-b border-brand-gold/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity */}
          <Link
            to="/"
            className="group"
            onClick={() => setIsMobileOpen(false)}
          >
            <BrandLogo 
              variant="horizontal" 
              size="small"
              className="opacity-90 group-hover:opacity-100 transition-opacity"
              isHovered={false}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-sans text-xs tracking-wider uppercase font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`transition-colors py-1 ${
                  isActive(link.href)
                    ? 'text-brand-gold-light border-b-2 border-brand-gold font-semibold'
                    : 'text-brand-white/85 hover:text-brand-gold-light'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/begin-a-memorial"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-brand-primary bg-brand-gold hover:bg-brand-gold-light transition-colors shadow-md"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Begin a Memorial</span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/memorials"
              className="p-2 text-brand-gold-light hover:bg-brand-secondary/60 rounded-lg transition-colors"
              aria-label="Search memorials"
            >
              <Search className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-brand-gold-light hover:bg-brand-secondary/60 rounded-lg transition-colors"
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-brand-secondary border-t border-brand-gold/40 px-4 pt-2 pb-6 space-y-3 font-sans">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-brand-gold/20 text-brand-gold-light font-semibold'
                    : 'text-brand-white/85 hover:text-brand-gold-light'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-brand-gold/30 flex flex-col gap-2">
            <Link
              to="/begin-a-memorial"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-gold text-brand-primary text-xs uppercase tracking-wider font-semibold transition-colors hover:bg-brand-gold-light"
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
