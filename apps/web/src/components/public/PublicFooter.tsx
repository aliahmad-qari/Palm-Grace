import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Heart } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-brand-secondary to-brand-primary text-brand-white border-t border-brand-gold/30 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="w-16 h-12 bg-white/20 backdrop-blur-md flex items-center justify-center shadow-md hover:shadow-lg transition-all border border-white/40 group-hover:border-brand-gold/50">
                <BrandLogo 
                  variant="icon" 
                  size="small"
                  className="opacity-100"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-base font-bold text-white">Palm & Grace</span>
                <span className="text-xs text-brand-gold-light font-bold tracking-widest">MEMORIALS</span>
              </div>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-brand-gold-light/90 font-serif italic">
              "A digital sanctuary where a life is remembered through story, image, voice and the people who carry it forward."
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-gold-light">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-white/85">
              <li>
                <Link to="/" className="hover:text-brand-gold transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/memorials" className="hover:text-brand-gold transition-colors font-medium">
                  Memorials
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="hover:text-brand-gold transition-colors font-medium">Our Story</Link>
              </li>
              <li>
                <Link to="/begin-a-memorial" className="hover:text-brand-gold transition-colors font-medium">Begin a Memorial</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-gold-light">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-white/85">
              <li>
                <Link to="/our-care-partners" className="hover:text-brand-gold transition-colors font-medium">Care Partners</Link>
              </li>
              <li>
                <Link to="/our-story#contact" className="hover:text-brand-gold transition-colors font-medium">Contact</Link>
              </li>
              <li><span className="text-brand-white/50 text-xs">(Privacy pending)</span></li>
            </ul>
          </div>

          {/* Principles */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-gold-light">
              Our Values
            </h4>
            <ul className="space-y-2 text-sm text-brand-white/85">
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-brand-gold" />
                <span className="font-medium">Respectful Moderation</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-brand-gold" />
                <span className="font-medium">Family Privacy</span>
              </li>
              <li className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-brand-gold" />
                <span className="font-medium">Permanent Care</span>
              </li>
            </ul>
          </div>

          {/* Admin Access */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-brand-gold-light">
              For Caretakers
            </h4>
            <p className="text-sm text-brand-white/85 leading-relaxed font-medium">
              Authorized administrators can manage memorials and tributes.
            </p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-gold hover:bg-brand-gold-light text-brand-primary font-bold text-sm border border-brand-gold/50 transition-all hover:scale-105 uppercase tracking-wide"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-14 pt-8 border-t border-brand-gold/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-white/60">
          <p className="font-medium">
            &copy; {new Date().getFullYear()} Palm &amp; Grace. All rights reserved.
          </p>
          <p className="text-center sm:text-right font-medium">
            Honouring lives. Preserving legacies.
          </p>
        </div>
      </div>
    </footer>
  );
};
