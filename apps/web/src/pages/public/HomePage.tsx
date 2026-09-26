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
import { api } from '../../lib/api.js';
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
        {/* Subtle background ambient light */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900 border border-stone-800 text-xs text-amber-300 font-sans uppercase tracking-widest shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>The Digital Sanctuary for Enduring Remembrance</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-stone-100 leading-[1.15]">
            A timeless sanctuary for the stories that live forever.
          </h1>

          <p className="font-serif italic text-lg sm:text-2xl text-stone-300 max-w-3xl mx-auto leading-relaxed font-normal">
            "A life is far greater than an obituary. It is an enduring legacy of wisdom, photographs, gatherings, ceremonies, and cherished memories."
          </p>

          <p className="font-sans text-xs sm:text-sm text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
            Palm &amp; Grace provides grieving families and communities with an ad-free, reverent digital home to celebrate loved ones, broadcast ceremony livestreams, and preserve heartfelt tributes across generations.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 font-sans text-xs uppercase tracking-wider font-semibold">
            <Link
              to="/memorials"
              className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Explore Public Memorials</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#experience"
              className="w-full sm:w-auto px-8 py-4 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Discover The Experience</span>
              <ChevronDown className="w-4 h-4 text-stone-400" />
            </a>
          </div>

          {/* Core Trust Indicators */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-stone-800/80 max-w-4xl mx-auto text-left font-sans">
            <div className="space-y-1">
              <span className="text-stone-200 font-semibold text-xs block">Zero Advertisements</span>
              <span className="text-[11px] text-stone-400">Pure, reverent, uncommercialized space.</span>
            </div>
            <div className="space-y-1">
              <span className="text-stone-200 font-semibold text-xs block">Family Moderated</span>
              <span className="text-[11px] text-stone-400">All guest tributes reviewed before publishing.</span>
            </div>
            <div className="space-y-1">
              <span className="text-stone-200 font-semibold text-xs block">Ceremonial Livestream</span>
              <span className="text-[11px] text-stone-400">Broadcasts vanish cleanly when inactive.</span>
            </div>
            <div className="space-y-1">
              <span className="text-stone-200 font-semibold text-xs block">Vector Stationery QR</span>
              <span className="text-[11px] text-stone-400">Print ready for funeral cards and plaques.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PALM & GRACE INTRODUCTION */}
      <section className="py-24 bg-stone-900 text-stone-100 border-t border-stone-800/60 font-sans">
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
                Traditional obituaries are often buried in impersonal newspaper archives, while modern social media feeds are cluttered with advertisements, algorithmic noise, and fleeting comments.
              </p>
              <p className="text-stone-300 leading-relaxed text-sm sm:text-base">
                Palm &amp; Grace was created as an intentional sanctuary. Here, a person’s memory is given the room it deserves: an elegant, tailored layout, a high-resolution portrait gallery, a dignified chronicle of their life journey, and a sacred guestbook where every reflection is held with care.
              </p>
              <div className="pt-2">
                <Link
                  to="/memorials"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-amber-200 uppercase tracking-wider"
                >
                  <span>Browse the Memorial Sanctuary Registry</span>
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
              Every soul possesses an unmistakable essence. Palm &amp; Grace offers three carefully crafted visual designs, ensuring the sanctuary feels true to the person being remembered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Template 1: Classic Dignity */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between space-y-6 shadow-xl hover:border-amber-400/40 transition-colors">
              <div className="space-y-4">
                <span className="text-[11px] font-mono tracking-widest uppercase text-amber-300 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 inline-block">
                  Template 1 · Male
                </span>
                <h3 className="font-serif text-2xl text-slate-100 font-semibold">
                  Classic Dignity
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Deep slate, timeless navy, architectural restraint, and stately serif typography. Designed to honor fathers, grandfathers, mentors, and gentlemen of steady conviction.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>Stately serif headline hierarchy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>Subdued slate and bronze accents</span>
                </div>
              </div>
            </div>

            {/* Template 2: Grace & Botanical */}
            <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-8 flex flex-col justify-between space-y-6 shadow-xl hover:border-rose-300/40 transition-colors">
              <div className="space-y-4">
                <span className="text-[11px] font-mono tracking-widest uppercase text-rose-300 px-2.5 py-1 rounded-full bg-stone-800 border border-stone-700 inline-block">
                  Template 2 · Female
                </span>
                <h3 className="font-serif text-2xl text-stone-100 font-semibold">
                  Grace &amp; Botanical
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Warm champagne undertones, poetic typography, soft botanical warmth, and rose accents. Designed to commemorate mothers, matriarchs, and women of enduring joy.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800/80 text-xs text-stone-400 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-rose-300" />
                  <span>Soft stone and champagne warmth</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-rose-300" />
                  <span>Delicate botanical elegance</span>
                </div>
              </div>
            </div>

            {/* Template 3: Gentle Celestial */}
            <div className="bg-sky-950/70 rounded-2xl border border-sky-800/80 p-8 flex flex-col justify-between space-y-6 shadow-xl hover:border-amber-200/40 transition-colors">
              <div className="space-y-4">
                <span className="text-[11px] font-mono tracking-widest uppercase text-amber-200 px-2.5 py-1 rounded-full bg-sky-900 border border-sky-800 inline-block">
                  Template 3 · Child
                </span>
                <h3 className="font-serif text-2xl text-sky-50 font-semibold">
                  Gentle Celestial
                </h3>
                <p className="text-xs sm:text-sm text-sky-200 leading-relaxed">
                  Tender starlight hues, gentle rounded warmth, and age-appropriate reverence. Designed with infinite tenderness for children and bright, young souls held forever in light.
                </p>
              </div>

              <div className="pt-4 border-t border-sky-800/80 text-xs text-sky-300/80 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-200" />
                  <span>Gentle celestial illumination</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-200" />
                  <span>Reverent warmth for youth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-stone-900 text-stone-100 border-t border-stone-800 font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
              The Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">
              Creating a Digital Sanctuary
            </h2>
            <p className="text-sm text-stone-400 font-serif italic">
              Simple, supportive, and unhurried steps to honor their memory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 bg-stone-950/60 p-6 rounded-2xl border border-stone-800">
              <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-300 font-mono font-bold text-sm">
                01
              </div>
              <h3 className="font-serif text-lg text-white font-semibold">
                Curate Life &amp; Imagery
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Add their focal portrait, lifespans, written biography, extended life journey, and an archival photograph gallery.
              </p>
            </div>

            <div className="space-y-4 bg-stone-950/60 p-6 rounded-2xl border border-stone-800">
              <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-300 font-mono font-bold text-sm">
                02
              </div>
              <h3 className="font-serif text-lg text-white font-semibold">
                Connect in Ceremony
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Provide ceremony location, chapel address, and optional private livestream or recording links for distant loved ones.
              </p>
            </div>

            <div className="space-y-4 bg-stone-950/60 p-6 rounded-2xl border border-stone-800">
              <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-300 font-mono font-bold text-sm">
                03
              </div>
              <h3 className="font-serif text-lg text-white font-semibold">
                Gather Tributes
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Invite friends and community to leave condolences. Family administrators review submissions before they appear publicly.
              </p>
            </div>

            <div className="space-y-4 bg-stone-950/60 p-6 rounded-2xl border border-stone-800">
              <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-300 font-mono font-bold text-sm">
                04
              </div>
              <h3 className="font-serif text-lg text-white font-semibold">
                Tangible QR Presence
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Download high-resolution vector QR codes ready for printing onto service stationery, prayer bookmarks, or plaques.
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
                Explore live sanctuaries demonstrating our template aesthetics and remembrance features.
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
                  Every memorial generates an instant, lossless vector QR code. Scan with any camera phone—no application installation required.
                </p>

                {/* Example QR Visual */}
                <div className="p-4 bg-white rounded-xl inline-block shadow-inner mx-auto my-2">
                  <img
                    src="/api/memorials/arthur-pendleton/qr?format=png"
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
                A memorial shouldn't end when guests depart the chapel. Palm &amp; Grace bridges the physical gathering with the digital sanctuary.
              </p>
              <div className="space-y-4 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-stone-800 text-amber-300 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-sans">Funeral Programs &amp; Prayer Cards</strong>
                    <span className="text-stone-400">Print the vector QR code directly onto ceremony booklets so attendees can read eulogies and share memories on their devices.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-stone-800 text-amber-300 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-sans">Keepsake Bookmarks &amp; Flowers</strong>
                    <span className="text-stone-400">Provide family members with pocket memorial cards that link to updated photo galleries and ceremonial recordings.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-stone-800 text-amber-300 mt-0.5">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-white block font-sans">Cemetery Plaques &amp; Urns</strong>
                    <span className="text-stone-400">High-resolution vector assets suitable for laser-etching onto bronze, granite, or stainless steel plaques for generations of visitors.</span>
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
              A sacred haven for love, grief, and shared remembrance.
            </h2>
            <p className="text-sm sm:text-base text-stone-300 font-serif italic max-w-2xl mx-auto leading-relaxed">
              "We believe words written in mourning should be held with the highest dignity."
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white/3 border border-white/10 text-left space-y-4 max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              On generic platforms, comment sections can attract spam, intrusive links, or thoughtless words. On Palm &amp; Grace:
            </p>
            <ul className="space-y-3 text-xs sm:text-sm text-stone-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Every submitted tribute enters a private moderation queue first.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Family administrators can approve, reject, or correct typographical errors.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Only approved condolences are visible to the public.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION (CTA) */}
      <section className="py-24 bg-gradient-to-t from-stone-900 to-stone-950 text-stone-100 border-t border-stone-800 text-center font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="font-serif text-3xl sm:text-5xl text-white tracking-tight">
            Honor a life with the reverence it deserves.
          </h2>
          <p className="text-sm sm:text-base text-stone-400 font-serif italic max-w-2xl mx-auto leading-relaxed">
            Begin exploring published sanctuaries or access the administrator console to create a new memorial.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs uppercase tracking-wider font-semibold">
            <Link
              to="/memorials"
              className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore The Directory</span>
            </Link>
            <Link
              to="/admin"
              className="w-full sm:w-auto px-8 py-4 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-amber-300" />
              <span>Sanctuary Portal Login</span>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
