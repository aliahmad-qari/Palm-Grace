import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  QrCode,
  Heart,
  Sparkles,
  Search,
  BookOpen,
  Images,
  Layers,
  CheckCircle,
  Eye,
  Calendar,
  Lock,
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

  const formatDate = (dateStr?: string | null) => {
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
      <section className="relative overflow-hidden text-brand-white min-h-[92vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <img
          src={featuredMemorials[0]?.mainPhotograph || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2000&q=85'}
          alt={featuredMemorials[0] ? `Memorial portrait of ${featuredMemorials[0].fullName}` : 'Sunlight through a quiet woodland'}
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/90 via-brand-primary/85 to-brand-primary/70" />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 text-xs text-brand-gold-light font-sans uppercase tracking-widest bg-brand-primary/40 px-3 py-1.5 rounded-full border border-brand-gold/40 w-fit">
              <Heart className="w-4 h-4" aria-hidden="true" />
              <span>Palm &amp; Grace Memorials</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.05] drop-shadow-lg">
              Honouring Lives. Preserving Legacies.
            </h1>

            <p className="font-sans text-base sm:text-lg text-brand-white/95 max-w-2xl leading-relaxed">
              Every life leaves a story worth holding close. Palm &amp; Grace creates beautiful digital spaces where families and friends can remember, reflect and preserve the photographs, stories and memories that made a life uniquely theirs.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1 font-sans text-sm font-semibold">
              <Link
                to="/memorials"
                className="min-h-12 w-full sm:w-auto px-6 bg-brand-gold hover:bg-brand-gold-light text-brand-primary rounded-lg shadow-lg transition-all hover:shadow-xl flex items-center justify-center gap-2 font-bold"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>Explore a Memorial</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>

              <Link
                to="/our-story"
                className="min-h-12 w-full sm:w-auto px-6 bg-white/15 hover:bg-white/25 text-brand-white border-2 border-brand-gold-light rounded-lg transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>Discover Palm &amp; Grace</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PALM & GRACE INTRODUCTION */}
      <section className="py-24 bg-white text-brand-charcoal border-t-8 border-brand-primary font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold block">
                Remembrance deserves a place of its own
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brand-primary tracking-tight leading-tight">
                More than dates. More than photographs.
              </h2>
              <p className="text-brand-charcoal leading-relaxed text-base">
                A place where photographs, stories, voices and memories can live together with dignity, long after a service has ended. Palm &amp; Grace helps families preserve a life in the details, for those who knew them and for generations still to come.
              </p>
              <div className="pt-2">
                <Link
                  to="/our-story"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-primary hover:text-brand-secondary uppercase tracking-wider transition-colors group"
                >
                  <span>Discover Palm &amp; Grace</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border-8 border-brand-gold/40 bg-brand-primary p-2 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80"
                  alt="Dignified forest sunlight symbolizing eternal memory"
                  className="rounded-lg w-full h-[380px] object-cover filter brightness-95"
                />
                <div className="absolute inset-2 rounded-lg bg-gradient-to-t from-brand-primary/85 via-transparent to-transparent flex items-end p-6">
                  <p className="font-serif italic text-brand-white text-sm sm:text-base">
                    "Every life is a masterwork of love, perseverance, and quiet miracles."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MEMORIAL EXPERIENCE & THREE TEMPLATES */}
      <section id="experience" className="py-24 bg-brand-primary text-white border-t-8 border-brand-gold font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-brand-gold-light font-semibold block">
              Curated Atmosphere
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-white tracking-tight">
              Every memorial belongs to one life
            </h2>
            <p className="text-sm sm:text-base text-brand-white/85 font-serif italic leading-relaxed">
              Three considered directions provide a starting point, while story, photography and personality keep each memorial unmistakably personal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Template 1: Classic Dignity */}
            <div className="bg-white rounded-2xl border-4 border-brand-gold p-8 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all">
              <div className="space-y-4">
                <span className="text-[11px] font-mono tracking-widest uppercase text-brand-primary px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold inline-block">
                  Memorial direction · Male
                </span>
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-full bg-brand-primary border-2 border-brand-gold flex items-center justify-center text-brand-gold-light">
                    <BookOpen className="w-6 h-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-serif text-2xl text-brand-primary font-semibold">A Life in Full</h3>
                </div>
                <p className="text-sm text-brand-charcoal leading-relaxed">
                  Quiet slate tones and timeless serif typography honour strength and enduring legacy.
                </p>
              </div>
            </div>

            {/* Template 2: Grace & Botanical */}
            <div className="bg-white rounded-2xl border-4 border-brand-gold p-8 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all">
              <div className="space-y-4">
                <span className="text-[11px] font-mono tracking-widest uppercase text-brand-primary px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold inline-block">
                  Memorial direction · Female
                </span>
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-full bg-brand-primary border-2 border-brand-gold flex items-center justify-center text-brand-gold-light">
                    <Sparkles className="w-6 h-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-serif text-2xl text-brand-primary font-semibold">Stories Held Close</h3>
                </div>
                <p className="text-sm text-brand-charcoal leading-relaxed">
                  Soft botanical details with gentle, warm accents celebrate grace and connection.
                </p>
              </div>
            </div>

            {/* Template 3: Gentle Celestial */}
            <div className="bg-white rounded-2xl border-4 border-brand-gold p-8 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all">
              <div className="space-y-4">
                <span className="text-[11px] font-mono tracking-widest uppercase text-brand-primary px-3 py-1 rounded-full bg-brand-gold/20 border border-brand-gold inline-block">
                  Memorial direction · Child
                </span>
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-full bg-brand-primary border-2 border-brand-gold flex items-center justify-center text-brand-gold-light">
                    <Heart className="w-6 h-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-serif text-2xl text-brand-primary font-semibold">Wonder Remembered</h3>
                </div>
                <p className="text-sm text-brand-charcoal leading-relaxed">
                  A restrained space shaped around personality, wonder and the love that remains.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-brand-gold-light text-brand-primary border-t-8 border-brand-gold font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest text-brand-primary font-semibold block">
              The Process
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-brand-primary tracking-tight">
              Creating a Living Legacy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 bg-brand-primary p-6 rounded-2xl border-2 border-brand-gold shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-brand-gold/20 border-2 border-brand-gold flex items-center justify-center text-brand-gold">
                <Images className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl text-white font-semibold">
                Curate Life &amp; Imagery
              </h3>
              <p className="text-sm text-brand-white/85 leading-relaxed">
                Share their story, legacy, and the photographs that mattered most.
              </p>
            </div>

            <div className="space-y-4 bg-brand-primary p-6 rounded-2xl border-2 border-brand-gold shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-brand-gold/20 border-2 border-brand-gold flex items-center justify-center text-brand-gold">
                <Calendar className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl text-white font-semibold">
                Connect in Ceremony
              </h3>
              <p className="text-sm text-brand-white/85 leading-relaxed">
                Honour their service with details and a livestream or recording.
              </p>
            </div>

            <div className="space-y-4 bg-brand-primary p-6 rounded-2xl border-2 border-brand-gold shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-brand-gold/20 border-2 border-brand-gold flex items-center justify-center text-brand-gold">
                <Heart className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl text-white font-semibold">
                Gather Memories &amp; Tributes
              </h3>
              <p className="text-sm text-brand-white/85 leading-relaxed">
                Invite loved ones to share words of remembrance, reviewed with care.
              </p>
            </div>

            <div className="space-y-4 bg-brand-primary p-6 rounded-2xl border-2 border-brand-gold shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-full bg-brand-gold/20 border-2 border-brand-gold flex items-center justify-center text-brand-gold">
                <QrCode className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-xl text-white font-semibold">
                Tangible QR Presence
              </h3>
              <p className="text-sm text-brand-white/85 leading-relaxed">
                Share a print-ready QR code on cards or plaques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEMORIAL EXAMPLES SHOWCASE (REAL PUBLISHED DATA) */}
      <section className="py-24 bg-brand-secondary text-white border-t-8 border-brand-primary font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-brand-gold-light font-semibold block mb-2">
                Sanctuary Showcase
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-white tracking-tight">
                Published Memorial Examples
              </h2>
              <p className="text-sm text-brand-white/80 font-serif italic mt-1">
                Visit published memorials and their stories.
              </p>
            </div>

            <Link
              to="/memorials"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold-light hover:text-brand-gold uppercase tracking-wider transition-colors"
            >
              <span>View All In Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingExamples ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="bg-brand-primary/80 rounded-2xl p-6 border-2 border-brand-gold/40 animate-pulse h-80" />
              ))
            ) : featuredMemorials.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-brand-white/60 text-xs">
                No published memorials currently in showcase.
              </div>
            ) : (
              featuredMemorials.map((m) => (
                <Link
                  key={m.id}
                  to={`/memorial/${m.slug}`}
                  className="group bg-brand-primary/80 hover:bg-brand-primary border-2 border-brand-gold/40 hover:border-brand-gold rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[11px] font-mono text-brand-white/70">
                      <span className="text-brand-gold-light uppercase">
                        {m.templateType === 'MALE' && 'Classic Dignity'}
                        {m.templateType === 'FEMALE' && 'Grace & Botanical'}
                        {m.templateType === 'CHILD' && 'Gentle Celestial'}
                      </span>
                      <span>{formatDate(m.dateOfBirth)} — {formatDate(m.dateOfPassing)}</span>
                    </div>

                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand-gold/60 group-hover:border-brand-gold transition-colors mx-auto bg-brand-primary shadow-md">
                      <img
                        src={m.mainPhotograph}
                        alt={m.fullName}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="text-center space-y-1">
                      <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-brand-gold-light transition-colors line-clamp-1">
                        {m.fullName}
                      </h3>
                      {m.biography && (
                        <p className="text-xs text-brand-white/70 line-clamp-2 italic font-serif leading-relaxed px-1">
                          "{m.biography}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-brand-gold/30 flex items-center justify-between text-xs text-brand-white/60">
                    <span className="text-[11px] text-brand-white/50 font-mono">/memorial/{m.slug}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-brand-gold-light group-hover:translate-x-0.5 transition-transform">
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
      <section id="qr-memorials" className="py-24 bg-white text-brand-charcoal border-t-8 border-brand-gold font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="p-8 rounded-2xl bg-brand-primary border-4 border-brand-gold text-center space-y-4 shadow-2xl">
                <div className="w-12 h-12 rounded-full bg-brand-gold/20 border-2 border-brand-gold text-brand-gold flex items-center justify-center mx-auto">
                  <QrCode className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl text-white font-semibold">
                  Bridging the Physical &amp; Digital
                </h3>
                <p className="text-sm text-brand-white/85 leading-relaxed">
                  Scan with a phone camera to open a memorial. Download a vector or high-resolution print file.
                </p>

                {/* Example QR Visual */}
                <div className="p-4 bg-white rounded-xl inline-block shadow-lg mx-auto my-3">
                  <img
                    src={apiUrl('/api/memorials/arthur-pendleton/qr?format=png')}
                    alt="Sample Memorial QR Code"
                    className="w-40 h-40 mx-auto"
                  />
                </div>

                <div className="text-xs text-brand-white/70 font-mono">
                  Example: Arthur William Pendleton Sanctuary
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="text-xs uppercase tracking-widest text-brand-gold font-semibold block">
                The Tangible Bridge
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-brand-primary tracking-tight leading-tight">
                From ceremony stationery to permanent monuments.
              </h2>
              <p className="text-brand-charcoal leading-relaxed text-base">
                Keep a memorial close, from service cards to a permanent plaque.
              </p>
              <div className="space-y-4 text-sm text-brand-charcoal">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-brand-gold/20 border border-brand-gold text-brand-gold mt-0.5 shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-brand-primary block font-sans">Funeral Programs &amp; Prayer Cards</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-brand-gold/20 border border-brand-gold text-brand-gold mt-0.5 shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-brand-primary block font-sans">Keepsake Bookmarks &amp; Flowers</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-brand-gold/20 border border-brand-gold text-brand-gold mt-0.5 shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-brand-primary block font-sans">Cemetery Plaques &amp; Urns</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRIBUTE & MEMORY SANCTUARY CONCEPT */}
      <section className="py-24 bg-brand-primary text-white border-t-8 border-brand-gold font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="w-12 h-12 rounded-full bg-brand-gold/20 border-2 border-brand-gold text-brand-gold flex items-center justify-center mx-auto">
            <Heart className="w-6 h-6" />
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-brand-gold-light font-semibold block">
              Respectful Moderation
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight">
              Tributes, shared with care.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto text-sm text-brand-white/85">
            <div className="flex items-center justify-center sm:justify-start gap-3 bg-brand-secondary/50 p-4 rounded-lg border border-brand-gold/30">
              <Shield className="w-5 h-5 text-brand-gold shrink-0" aria-hidden="true" />
              <span>Family reviews every tribute.</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3 bg-brand-secondary/50 p-4 rounded-lg border border-brand-gold/30">
              <Layers className="w-5 h-5 text-brand-gold shrink-0" aria-hidden="true" />
              <span>Unapproved messages stay private.</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3 bg-brand-secondary/50 p-4 rounded-lg border border-brand-gold/30">
              <CheckCircle className="w-5 h-5 text-brand-gold shrink-0" aria-hidden="true" />
              <span>Only approved tributes appear.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION (CTA) */}
      <section className="py-24 bg-gradient-to-b from-brand-primary to-brand-secondary text-white border-t-8 border-brand-gold text-center font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="font-serif text-4xl sm:text-5xl text-white tracking-tight">
            Keep their memory close.
          </h2>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 text-sm font-semibold">
            <Link
              to="/memorials"
              className="min-h-12 w-full sm:w-auto px-6 bg-brand-gold hover:bg-brand-gold-light text-brand-primary rounded-lg shadow-lg hover:shadow-xl transition-all font-bold flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Explore a Memorial</span>
            </Link>
            <Link
              to="/begin-a-memorial"
              className="min-h-12 w-full sm:w-auto px-6 bg-white/20 hover:bg-white/30 text-white border-2 border-brand-gold-light rounded-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 text-brand-gold-light" />
              <span>Begin a Memorial</span>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
