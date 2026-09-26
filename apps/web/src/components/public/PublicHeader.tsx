import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X, ArrowRight, Sparkles, BookOpen, Search, QrCode } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Sanctuary', href: '/' },
    { label: 'Memorial Directory', href: '/memorials' },
    { label: 'The Experience', href: '/#experience' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'QR Memorials', href: '/#qr-memorials' },
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
            className="flex items-center gap-3 group"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-300 group-hover:border-amber-400/60 transition-colors">
              <span className="font-serif text-lg font-bold">☨</span>
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl tracking-widest text-stone-100 uppercase block group-hover:text-amber-200 transition-colors">
                PALM &amp; GRACE
              </span>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-sans block -mt-1">
                The Digital Sanctuary
              </span>
            </div>
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
              to="/memorials"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-stone-300 hover:text-white bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <span>Search Memorials</span>
            </Link>

            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 transition-all shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-stone-900" />
              <span>Admin Portal</span>
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
            <button
              type="button"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
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
              to="/memorials"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-800 text-stone-200 text-xs uppercase tracking-wider font-semibold border border-stone-700"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Explore Public Memorials</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 text-stone-950 text-xs uppercase tracking-wider font-bold shadow-xs"
            >
              <Shield className="w-4 h-4" />
              <span>Administrator Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
