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
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-brand-gold/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Glass Morphism, No Radius */}
          <Link
            to="/"
            className="group flex items-center gap-4 flex-shrink-0"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-16 h-12 bg-white/30 backdrop-blur-md flex items-center justify-center shadow-md hover:shadow-lg transition-all border border-white/50 group-hover:border-brand-gold/50">
              <BrandLogo 
                variant="icon" 
                size="small"
                className="opacity-100"
                isHovered={false}
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-serif text-lg font-bold text-brand-primary">Palm & Grace</span>
              <span className="text-xs text-brand-secondary font-bold tracking-widest">MEMORIALS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10 font-sans">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-bold tracking-wide transition-all duration-300 ${
                  isActive(link.href)
                    ? 'text-brand-primary border-b-2 border-brand-gold'
                    : 'text-brand-charcoal hover:text-brand-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/memorials"
              className="px-6 py-2.5 text-sm font-bold text-brand-primary bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-lg transition-all border border-white/50 uppercase tracking-wide"
            >
              Search
            </Link>
            <Link
              to="/begin-a-memorial"
              className="px-6 py-2.5 text-sm font-bold text-white bg-brand-gold hover:bg-brand-gold-light text-brand-primary rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 uppercase tracking-wide"
            >
              <Heart className="w-4 h-4" />
              Begin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-white/80 backdrop-blur-xl border-t border-brand-gold/20 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-lg font-bold transition-all ${
                isActive(link.href)
                  ? 'bg-brand-primary text-white'
                  : 'text-brand-charcoal hover:bg-brand-primary/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/memorials"
            onClick={() => setIsMobileOpen(false)}
            className="block px-4 py-2.5 text-center text-sm font-bold text-brand-primary bg-white/40 backdrop-blur-md rounded-lg border border-white/50 uppercase tracking-wide"
          >
            Search
          </Link>
          <Link
            to="/begin-a-memorial"
            onClick={() => setIsMobileOpen(false)}
            className="block px-4 py-2.5 text-center text-sm font-bold text-white bg-brand-gold rounded-lg uppercase tracking-wide flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Begin
          </Link>
        </div>
      )}
    </header>
  );
};
