import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-brand-primary text-brand-white/80 border-t border-brand-gold/30 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand & Purpose Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block group">
              <BrandLogo 
                variant="vertical" 
                size="medium"
                className="opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md font-serif italic text-base">
              "A digital sanctuary where a life is remembered through story, image, voice and the people who carry it forward."
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-100">
              The Sanctuary
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <Link to="/" className="hover:text-amber-200 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/memorials" className="hover:text-amber-200 transition-colors">
                  Memorials
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="hover:text-brand-gold-light transition-colors">Our Story</Link>
              </li>
              <li>
                <Link to="/our-care-partners" className="hover:text-brand-gold-light transition-colors">Our Care Partners</Link>
              </li>
              <li>
                <Link to="/begin-a-memorial" className="hover:text-brand-gold-light transition-colors">Begin a Memorial</Link>
              </li>
            </ul>
          </div>

          {/* Core Foundations */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-100">
              Principles &amp; Trust
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li className="flex items-center gap-1.5">
                <span>Respectful Moderation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Zero Advertising Clutter</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Family Privacy Discretion</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Vector Print Readiness</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span>Permanent Remembrance</span>
              </li>
            </ul>
          </div>

          {/* Administrator / Sanctuary Caretaker Access */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-100">
              Administration
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Authorized caretakers and administrators can sign in to draft memorials, review tributes, and configure galleries.
            </p>
            <div className="pt-2">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-amber-200 text-xs font-medium border border-stone-800 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Caretaker Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Privacy Statements */}
        <div className="mt-14 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} Palm &amp; Grace Memorial Platform. All rights reserved.
          </p>
          <p className="text-[11px] text-stone-500 text-center sm:text-right">
            Public directory discovery remains subject to family privacy protocols and administrative preference.
          </p>
        </div>
      </div>
    </footer>
  );
};
