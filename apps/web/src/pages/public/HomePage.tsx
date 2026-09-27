import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  QrCode,
  Heart,
  Video,
  Sparkles,
  Search,
  BookOpen,
  Images,
  Layers,
  CheckCircle,
  Eye,
  Calendar,
  Lock,
  ChevronDown
} from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout.js';
import { api, apiUrl } from '../../lib/api.js';
import { Memorial } from '../../types/index.js';

export const HomePage: React.FC = () => {
  const [featuredMemorials, setFeaturedMemorials] = useState<Memorial[]>([]);
  const [isLoadingExamples, setIsLoadingExamples] = useState(true);

  useEffect(() => {
    loadFeaturedMemorials();
  }, []);

  const loadFeaturedMemorials = async () => {
    setIsLoadingExamples(true);
    try {
      const res = await api.getPublicMemorials();
      if (res.success && res.data) {
        // Show up to 3 published memorials as real examples
        setFeaturedMemorials(res.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Error loading featured memorials:', err);
    } finally {
      setIsLoadingExamples(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).getFullYear().toString();
    } catch {
      return dateStr;
    }
  };

  return (
    <PublicLayout>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-950 text-stone-100 min-h-[92vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <img
          src={featuredMemorials[0]?.mainPhotograph || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2000&q=85'}
          alt={featuredMemorials[0] ? `Memorial portrait of ${featuredMemorials[0].fullName}` : 'Sunlight through a quiet woodland'}
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-stone-950/65" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 text-xs text-amber-200 font-sans uppercase tracking-widest">
              <Heart className="w-4 h-4" aria-hidden="true" />
              <span>Palm &amp; Grace Memorials</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.05]">
              A place to remember a life well lived.
            </h1>

            <p className="font-sans text-base sm:text-lg text-stone-200 max-w-xl leading-relaxed">
              Preserve their story, photographs and the words of those who remember them.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 font-sans text-sm font-semibold">
              <Link
                to="/memorials"
                className="min-h-12 w-full sm:w-auto px-6 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>Explore memorials</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <a
                href="#experience"
                className="min-h-12 w-full sm:w-auto px-6 bg-stone-950/40 hover:bg-stone-900/80 text-white border border-white/40 rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>How it works</span>
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>

            <div className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 border-t border-white/25 font-sans text-xs text-stone-200">
              <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-amber-300" aria-hidden="true" /><span>Family moderated</span></div>
              <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-amber-300" aria-hidden="true" /><span>Ad free</span></div>
              <div className="flex items-center gap-2"><Video className="w-4 h-4 text-amber-300" aria-hidden="true" /><span>Service details</span></div>
              <div className="flex items-center gap-2"><QrCode className="w-4 h-4 text-amber-300" aria-hidden="true" /><span>Print ready QR</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PALM & GRACE INTRODUCTION */}
      <section className="py-24 bg-stone-800 text-stone-100 border-t border-stone-700 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
                Preserving What Cannot Be Replaced
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                Designed for reverence, not algorithms.
              </h2>
              <p className="text-stone-300 leading-relaxed text-sm sm:text-base">
                A calm, ad-free memorial brings their life story, photographs, service details and family-reviewed tributes together in one place.
              </p>
              <div className="pt-2">
                <Link
                  to="/memorials"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-amber-200 uppercase tracking-wider"
                >
                  <span>Browse memorials</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-stone-700/80 bg-stone-950 p-2 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80"
                  alt="Dignified forest sunlight symbolizing eternal memory"
                  className="rounded-xl w-full h-[380px] object-cover filter brightness-90"
                />
                <div className="absolute inset-2 rounded-xl bg-gradient-to-t from-stone-950/90 via-transparent to-transparent flex items-end p-6">
                  <p className="font-serif italic text-stone-200 text-sm sm:text-base">
                    "Every life is a masterwork of love, perseverance, and quiet miracles."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEMORIAL EXPERIENCE & THREE TEMPLATES */}
      <section id="experience" className="py-24 bg-stone-950 text-stone-100 border-t border-stone-800 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
              Curated Atmosphere
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
              Three Distinctive Memorial Atmospheres
            </h2>
            <p className="text-sm sm:text-base text-stone-400 font-serif italic leading-relaxed">
              Choose a thoughtful design that feels right for the person being remembered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Template 1: Classic Dignity */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8 flex flex-col justify-between space-y-6 shadow-xl shadow-black/20 hover:border-amber-400 transition-colors">
              <div className="space-y-4">
                <span className="text-[11px] font-mono tracking-widest uppercase text-stone-800 px-2.5 py-1 rounded-full bg-white border border-amber-200 inline-block">
                  Template 1 · Male
                </span>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-stone-900 border border-amber-500/50 flex items-center justify-center text-amber-300">
                    <BookOpen className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-serif text-2xl text-stone-900 font-semibold">Classic Dignity</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Quiet slate tones and timeless serif typography.
                </p>
              </div>

            </div>

            {/* Template 2: Grace & Botanical */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8 flex flex-col justify-between space-y-6 shadow-xl shadow-black/20 hover:border-amber-400 transition-colors">
              <div className="space-y-4">
                <span className="text-[11px] font-mono tracking-widest uppercase text-stone-800 px-2.5 py-1 rounded-full bg-white border border-amber-200 inline-block">
                  Template 2 · Female
                </span>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-stone-900 border border-amber-500/50 flex items-center justify-center text-amber-300">
                    <Sparkles className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-serif text-2xl text-stone-900 font-semibold">Grace &amp; Botanical</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Soft botanical details with gentle, warm accents.
                </p>
              </div>

            </div>

            {/* Template 3: Gentle Celestial */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8 flex flex-col justify-between space-y-6 shadow-xl shadow-black/20 hover:border-amber-400 transition-colors">
              <div className="space-y-4">
                <span className="text-[11px] font-mono tracking-widest uppercase text-stone-800 px-2.5 py-1 rounded-full bg-white border border-amber-200 inline-block">
                  Template 3 · Child
                </span>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-stone-900 border border-amber-500/50 flex items-center justify-center text-amber-300">
                    <Heart className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-serif text-2xl text-stone-900 font-semibold">Gentle Celestial</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Tender colors and a gentle sense of light.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-stone-100 text-stone-900 border-t border-stone-300 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
              The Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Creating a Digital Sanctuary
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 bg-stone-900 p-6 rounded-2xl border border-stone-700 shadow-lg shadow-stone-900/20">
              <div className="w-10 h-10 rounded-full bg-amber-300 border border-amber-500 flex items-center justify-center text-stone-950">
                <Images className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-lg text-stone-100 font-semibold">
                Curate Life &amp; Imagery
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Share their story and favorite photographs.
              </p>
            </div>

            <div className="space-y-4 bg-stone-900 p-6 rounded-2xl border border-stone-700 shadow-lg shadow-stone-900/20">
              <div className="w-10 h-10 rounded-full bg-amber-300 border border-amber-500 flex items-center justify-center text-stone-950">
                <Calendar className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-lg text-stone-100 font-semibold">
                Connect in Ceremony
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Add service details and a livestream or recording.
              </p>
            </div>

            <div className="space-y-4 bg-stone-900 p-6 rounded-2xl border border-stone-700 shadow-lg shadow-stone-900/20">
              <div className="w-10 h-10 rounded-full bg-amber-300 border border-amber-500 flex items-center justify-center text-stone-950">
                <Heart className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-lg text-stone-100 font-semibold">
                Gather Tributes
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Receive words of remembrance, reviewed by family first.
              </p>
            </div>

            <div className="space-y-4 bg-stone-900 p-6 rounded-2xl border border-stone-700 shadow-lg shadow-stone-900/20">
              <div className="w-10 h-10 rounded-full bg-amber-300 border border-amber-500 flex items-center justify-center text-stone-950">
                <QrCode className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-lg text-stone-100 font-semibold">
                Tangible QR Presence
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Share a print-ready QR code on cards or plaques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEMORIAL EXAMPLES SHOWCASE (REAL PUBLISHED DATA) */}
      <section className="py-24 bg-stone-950 text-stone-100 border-t border-stone-800 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block mb-2">
                Sanctuary Showcase
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">
                Published Memorial Examples
              </h2>
              <p className="text-sm text-stone-400 font-serif italic mt-1">
                Visit published memorials and their stories.
              </p>
            </div>

            <Link
              to="/memorials"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 uppercase tracking-wider"
            >
              <span>View All In Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingExamples ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="bg-stone-900 rounded-2xl p-6 border border-stone-800 animate-pulse h-80" />
              ))
            ) : featuredMemorials.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-stone-500 text-xs">
                No published memorials currently in showcase.
              </div>
            ) : (
              featuredMemorials.map((m) => (
                <Link
                  key={m.id}
                  to={`/memorial/${m.slug}`}
                  className="group bg-stone-900/80 hover:bg-stone-900 border border-stone-800 hover:border-amber-400/60 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                      <span className="text-amber-300 uppercase">
                        {m.templateType === 'MALE' && 'Classic Dignity'}
                        {m.templateType === 'FEMALE' && 'Grace & Botanical'}
                        {m.templateType === 'CHILD' && 'Gentle Celestial'}
                      </span>
                      <span>{formatDate(m.dateOfBirth)} — {formatDate(m.dateOfPassing)}</span>
                    </div>

                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-stone-700 group-hover:border-amber-300 transition-colors mx-auto bg-stone-800 shadow-md">
                      <img
                        src={m.mainPhotograph}
                        alt={m.fullName}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="text-center space-y-1">
                      <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                        {m.fullName}
                      </h3>
                      {m.biography && (
                        <p className="text-xs text-stone-300 line-clamp-2 italic font-serif leading-relaxed px-1">
                          "{m.biography}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                    <span className="text-[11px] text-stone-500 font-mono">/memorial/{m.slug}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-300 group-hover:translate-x-0.5 transition-transform">
                      <span>Visit Sanctuary</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. PHYSICAL QR MEMORIAL EXPLANATION */}
      <section id="qr-memorials" className="py-24 bg-stone-900 text-stone-100 border-t border-stone-800 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="p-8 rounded-2xl bg-stone-950 border border-stone-800 text-center space-y-4 shadow-2xl relative">
                <div className="w-12 h-12 rounded-full bg-stone-900 border border-stone-700 text-amber-300 flex items-center justify-center mx-auto">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-white font-semibold">
                  Bridging the Physical &amp; Digital
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Scan with a phone camera to open a memorial. Download a vector or high-resolution print file.
                </p>

                {/* Example QR Visual */}
                <div className="p-4 bg-white rounded-xl inline-block shadow-inner mx-auto my-2">
                  <img
                    src={apiUrl('/api/memorials/arthur-pendleton/qr?format=png')}
                    alt="Sample Memorial QR Code"
                    className="w-40 h-40 mx-auto"
                  />
                </div>

                <div className="text-[11px] text-stone-400 font-mono">
                  Example: Arthur William Pendleton Sanctuary
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
                The Tangible Bridge
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
                From ceremony stationery to permanent monuments.
              </h2>
              <p className="text-stone-300 leading-relaxed text-sm sm:text-base">
                Keep a memorial close, from service cards to a permanent plaque.
              </p>
              <div className="space-y-4 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-stone-800 text-amber-300 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-sans">Funeral Programs &amp; Prayer Cards</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-stone-800 text-amber-300 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-sans">Keepsake Bookmarks &amp; Flowers</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-stone-800 text-amber-300 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-sans">Cemetery Plaques &amp; Urns</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRIBUTE & MEMORY SANCTUARY CONCEPT */}
      <section className="py-24 bg-stone-950 text-stone-100 border-t border-stone-800 font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-rose-300 flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
              Respectful Moderation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Tributes, shared with care.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto text-sm text-stone-300">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <Shield className="w-5 h-5 text-amber-300 shrink-0" aria-hidden="true" />
              <span>Family reviews every tribute.</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <Lock className="w-5 h-5 text-amber-300 shrink-0" aria-hidden="true" />
              <span>Unapproved messages stay private.</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <CheckCircle className="w-5 h-5 text-amber-300 shrink-0" aria-hidden="true" />
              <span>Only approved tributes appear.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION (CTA) */}
      <section className="py-24 bg-gradient-to-t from-stone-900 to-stone-950 text-stone-100 border-t border-stone-800 text-center font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
            Keep their story close.
          </h2>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 text-sm font-semibold">
            <Link
              to="/memorials"
              className="min-h-12 w-full sm:w-auto px-6 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-md shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore memorials</span>
            </Link>
            <Link
              to="/admin/login"
              className="min-h-12 w-full sm:w-auto px-6 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-300" />
              <span>Administrator sign in</span>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
