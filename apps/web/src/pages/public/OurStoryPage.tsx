import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, BookOpen, Users, Shield, Sparkles } from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout.js';

export const OurStoryPage: React.FC = () => {
  return (
    <PublicLayout>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-950 text-stone-100 min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/50 via-stone-950 to-stone-950" />

        <div className="relative w-full max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 text-xs text-amber-300 font-sans uppercase tracking-widest">
            <Heart className="w-4 h-4" aria-hidden="true" />
            <span>Our Mission</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.05]">
            Honouring Lives. Preserving Legacies.
          </h1>

          <p className="font-sans text-base sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Palm & Grace is a thoughtfully designed digital sanctuary where families preserve memories, share stories, and gather in remembrance.
          </p>
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className="py-24 bg-stone-900 text-stone-100 border-t border-stone-800 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
              Our Foundation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">
              Why Palm & Grace Exists
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-white font-semibold flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-amber-300 shrink-0 mt-1" aria-hidden="true" />
                Preservation of Stories
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Every life is a masterwork of love, perseverance, and quiet miracles. We believe those stories deserve to be preserved with the care and reverence they deserve—not lost to time, but held close by those who remember.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-white font-semibold flex items-start gap-3">
                <Heart className="w-6 h-6 text-amber-300 shrink-0 mt-1" aria-hidden="true" />
                Personal Memorial Experience
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                A memorial should feel personal, not templated. We celebrate the uniqueness of each person through distinctive design atmospheres, photography, biography, and the genuine tributes of those who knew them.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-white font-semibold flex items-start gap-3">
                <Users className="w-6 h-6 text-amber-300 shrink-0 mt-1" aria-hidden="true" />
                Guided Family Process
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                We guide families through the memorial creation journey with clarity and compassion. From capturing their story to sharing service details, our thoughtful process honours their pace and preferences.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-white font-semibold flex items-start gap-3">
                <Shield className="w-6 h-6 text-amber-300 shrink-0 mt-1" aria-hidden="true" />
                Family-Moderated Sanctuary
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                Tributes and memories are reviewed by the family before they appear. This ensures the memorial remains a safe, respectful space—ad-free and thoughtfully curated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CARE PARTNERS */}
      <section className="py-24 bg-stone-950 text-stone-100 border-t border-stone-800 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
              Our Relationships
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">
              Care Partner Network
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              We work alongside funeral homes, crematoriums, memorial planners, and other bereavement service providers. Our Care Partner program strengthens your offering by providing families with a dignified, ad-free digital sanctuary integrated with your services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-6 space-y-3">
              <h3 className="font-serif text-lg text-white font-semibold">Funeral Homes</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Provide Palm & Grace as part of your pre-need and at-need service offerings.
              </p>
            </div>

            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-6 space-y-3">
              <h3 className="font-serif text-lg text-white font-semibold">Crematoria & Cemeteries</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Offer digital memorials alongside physical placement and records.
              </p>
            </div>

            <div className="bg-stone-900/80 border border-stone-800 rounded-xl p-6 space-y-3">
              <h3 className="font-serif text-lg text-white font-semibold">Bereavement Services</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Integrate digital remembrance into your pastoral and support offerings.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800">
            <Link
              to="/our-care-partners"
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-amber-200 uppercase tracking-wider"
            >
              <span>Learn About Partnerships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-24 bg-gradient-to-t from-stone-900 to-stone-950 text-stone-100 border-t border-stone-800 text-center font-sans">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
            Ready to create a memorial?
          </h2>

          <p className="text-sm text-stone-300 leading-relaxed">
            We'll guide you through the process with clarity and compassion.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 text-sm font-semibold">
            <Link
              to="/begin-a-memorial"
              className="min-h-12 w-full sm:w-auto px-6 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-md shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              <span>Begin a Memorial</span>
            </Link>
            <Link
              to="/memorials"
              className="min-h-12 w-full sm:w-auto px-6 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>Explore Memorials</span>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
