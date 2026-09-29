import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-brand-primary text-brand-white/80 border-t border-brand-gold/30 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12">
          {/* Brand & Purpose Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="group inline-flex rounded-2xl border border-white/20 bg-white/10 p-5 shadow-xl backdrop-blur-xl transition-colors hover:bg-white/15">
              <BrandLogo
                variant="horizontal"
                size="medium"
                className="opacity-95 transition-opacity group-hover:opacity-100"
              />
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-brand-gold-light/80 font-serif italic">
              "A digital sanctuary where a life is remembered through story, image, voice and the people who carry it forward."
            </p>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-brand-white/45">
              <span className="h-px w-8 bg-brand-gold/60" />
              <span>Honouring lives with care</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold-light">
              The Sanctuary
            </h4>
            <ul className="space-y-2 text-sm text-brand-white/60">
              <li>
                <Link to="/" className="hover:text-brand-gold-light transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/memorials" className="hover:text-brand-gold-light transition-colors">
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
              <li>
                <Link to="/our-story#contact" className="hover:text-brand-gold-light transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Policy links await approved client destinations and copy. */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold-light">
              Information
            </h4>
            <ul className="space-y-2 text-sm text-brand-white/60">
              <li><span title="Client destination pending">Privacy <span className="text-[10px] text-brand-white/35">(pending)</span></span></li>
              <li><span title="Client destination pending">Terms <span className="text-[10px] text-brand-white/35">(pending)</span></span></li>
              <li><span title="Client destination pending">Accessibility <span className="text-[10px] text-brand-white/35">(pending)</span></span></li>
            </ul>
          </div>

          {/* Core Foundations */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold-light">
              Principles &amp; Trust
            </h4>
            <ul className="space-y-2 text-sm text-brand-white/60">
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
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-gold-light">
              Administration
            </h4>
            <p className="text-xs text-brand-white/60 leading-relaxed">
              Authorized caretakers and administrators can sign in to draft memorials, review tributes, and configure galleries.
            </p>
            <div className="pt-2">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-brand-white/80 hover:text-brand-gold-light text-xs font-medium border border-white/15 transition-colors backdrop-blur-sm"
              >
                <Lock className="w-3.5 h-3.5 text-brand-gold" />
                <span>Caretaker Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Privacy Statements */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-white/40">
          <p>
            &copy; {new Date().getFullYear()} Palm &amp; Grace Memorial Platform. All rights reserved.
          </p>
          <p className="text-[11px] text-brand-white/35 text-center sm:text-right">
            Public directory discovery remains subject to family privacy protocols and administrative preference.
          </p>
        </div>
      </div>
    </footer>
  );
};
