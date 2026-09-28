import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight, Sparkles, BookOpen, Search, QrCode, Heart } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 text-stone-100 transition-colors">
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
                    ? 'text-amber-300 border-b border-amber-300 font-semibold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/begin-a-memorial"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 transition-all shadow-xs"
            >
              <Heart className="w-3.5 h-3.5 text-stone-900" />
              <span>Begin a Memorial</span>
            </Link>

            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-stone-900 bg-stone-700 hover:bg-stone-600 transition-all shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-stone-900" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/memorials"
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800"
              aria-label="Search memorials"
            >
              <Search className="w-4 h-4" />
            </Link>
            <a
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              role="button"
              tabIndex={0}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileOpen && (
        <div className="md:hidden bg-stone-900 border-b border-stone-800 px-4 pt-2 pb-6 space-y-3 font-sans">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(link.href)
                    ? 'bg-stone-800 text-amber-300 font-semibold'
                    : 'text-stone-300 hover:bg-stone-800/50 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            <Link
              to="/begin-a-memorial"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 text-stone-950 text-xs uppercase tracking-wider font-bold shadow-xs"
            >
              <Heart className="w-4 h-4" />
              <span>Begin a Memorial</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-700 text-stone-100 text-xs uppercase tracking-wider font-semibold shadow-xs"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
