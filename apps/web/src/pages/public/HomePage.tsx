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
  Calendar,
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
      <section className="relative overflow-hidden text-white min-h-[88vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <img
          src={featuredMemorials[0]?.mainPhotograph || 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2000&q=85'}
          alt="Memorial background"
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/95 via-brand-secondary/90 to-brand-primary/85" />

        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-3xl space-y-6 sm:space-y-8">
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-tight drop-shadow-xl">
              Honouring Lives. Preserving Legacies.
            </h1>

            <p className="font-sans text-lg text-brand-white/95 max-w-2xl leading-relaxed font-medium">
              Create beautiful digital memorials where families and friends gather to remember, reflect, and preserve the moments that made a life uniquely theirs.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/memorials"
                className="px-8 py-3.5 bg-brand-gold hover:bg-brand-gold-light text-brand-primary rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm"
              >
                <Search className="w-5 h-5" />
                Explore Memorials
              </Link>

              <Link
                to="/our-story"
                className="px-8 py-3.5 bg-white/20 hover:bg-white/35 text-white backdrop-blur-md rounded-lg border-2 border-white/50 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm"
              >
                <BookOpen className="w-5 h-5" />
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION - White Section */}
      <section className="py-24 bg-white text-brand-charcoal font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-serif text-5xl lg:text-6xl text-brand-primary font-light leading-tight">
                More than dates. More than photographs.
              </h2>
              <p className="text-lg text-brand-charcoal/85 leading-relaxed font-medium">
                A dignified digital space where photographs, stories, voices and memories live together long after a service has ended. Families preserve a life in the details for those who knew them and generations to come.
              </p>
              <Link
                to="/our-story"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-bold uppercase tracking-wide rounded-lg transition-all hover:scale-105 text-sm"
              >
                <span>Discover Palm & Grace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden bg-brand-secondary border-8 border-brand-gold p-1 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80"
                  alt="Peaceful forest"
                  className="rounded-xl w-full h-96 object-cover brightness-95"
                />
                <div className="absolute inset-1 rounded-xl bg-gradient-to-t from-brand-secondary/80 via-transparent to-transparent flex items-end p-6">
                  <p className="font-serif italic text-white text-base">
                    "Every life is a masterwork of love, perseverance, and quiet miracles."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE MEMORIAL TEMPLATES - Green Section */}
      <section className="py-24 bg-brand-primary text-white font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="font-serif text-5xl lg:text-6xl text-white font-light">
              Every memorial belongs to one life
            </h2>
            <p className="text-lg text-brand-white/85 font-serif italic leading-relaxed">
              Three thoughtful directions provide structure. Story, photography and personality keep each memorial unmistakably theirs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Template 1 */}
            <div className="bg-brand-secondary/70 backdrop-blur-md rounded-2xl border-2 border-brand-gold/60 p-8 flex flex-col space-y-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-lg bg-brand-gold/30 flex items-center justify-center text-brand-gold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-brand-gold-light font-semibold">A Life in Full</h3>
              <p className="text-sm text-brand-white/90 leading-relaxed">
                Quiet slate tones and timeless serif typography honour strength and enduring legacy.
              </p>
              <p className="text-xs text-brand-gold-light/70 uppercase font-bold tracking-widest">For Gentlemen</p>
            </div>

            {/* Template 2 */}
            <div className="bg-brand-secondary/70 backdrop-blur-md rounded-2xl border-2 border-brand-gold/60 p-8 flex flex-col space-y-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-lg bg-brand-gold/30 flex items-center justify-center text-brand-gold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-brand-gold-light font-semibold">Stories Held Close</h3>
              <p className="text-sm text-brand-white/90 leading-relaxed">
                Soft botanical details with gentle, warm accents celebrate grace and connection.
              </p>
              <p className="text-xs text-brand-gold-light/70 uppercase font-bold tracking-widest">For Ladies</p>
            </div>

            {/* Template 3 */}
            <div className="bg-brand-secondary/70 backdrop-blur-md rounded-2xl border-2 border-brand-gold/60 p-8 flex flex-col space-y-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-lg bg-brand-gold/30 flex items-center justify-center text-brand-gold">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-brand-gold-light font-semibold">Wonder Remembered</h3>
              <p className="text-sm text-brand-white/90 leading-relaxed">
                A restrained space shaped around personality, wonder and the love that remains.
              </p>
              <p className="text-xs text-brand-gold-light/70 uppercase font-bold tracking-widest">For Children</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS - White Section with Green Accents */}
      <section className="py-24 bg-white font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-serif text-5xl lg:text-6xl text-brand-primary font-light">
              Creating a Living Legacy
            </h2>
            <p className="text-lg text-brand-charcoal/80 font-medium">
              Four simple steps to build a beautiful memorial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col space-y-4 p-8 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-2xl border border-brand-primary/20 hover:border-brand-gold/60 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-brand-gold/30 flex items-center justify-center text-brand-primary font-bold text-lg">1</div>
              <h3 className="font-serif text-xl text-brand-primary font-semibold">
                Curate Life
              </h3>
              <p className="text-sm text-brand-charcoal/80 leading-relaxed">
                Share their story, legacy, and the photographs that mattered most.
              </p>
            </div>

            <div className="flex flex-col space-y-4 p-8 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-2xl border border-brand-primary/20 hover:border-brand-gold/60 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-brand-gold/30 flex items-center justify-center text-brand-primary font-bold text-lg">2</div>
              <h3 className="font-serif text-xl text-brand-primary font-semibold">
                Connect
              </h3>
              <p className="text-sm text-brand-charcoal/80 leading-relaxed">
                Honour their service with details and a livestream or recording.
              </p>
            </div>

            <div className="flex flex-col space-y-4 p-8 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-2xl border border-brand-primary/20 hover:border-brand-gold/60 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-brand-gold/30 flex items-center justify-center text-brand-primary font-bold text-lg">3</div>
              <h3 className="font-serif text-xl text-brand-primary font-semibold">
                Gather Tributes
              </h3>
              <p className="text-sm text-brand-charcoal/80 leading-relaxed">
                Invite loved ones to share memories, reviewed with care.
              </p>
            </div>

            <div className="flex flex-col space-y-4 p-8 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-2xl border border-brand-primary/20 hover:border-brand-gold/60 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-lg bg-brand-gold/30 flex items-center justify-center text-brand-primary font-bold text-lg">4</div>
              <h3 className="font-serif text-xl text-brand-primary font-semibold">
                Share Forever
              </h3>
              <p className="text-sm text-brand-charcoal/80 leading-relaxed">
                Print-ready QR codes for cards, plaques and monuments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MEMORIAL EXAMPLES - Secondary Green Section */}
      <section className="py-24 bg-brand-secondary text-white font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-5xl lg:text-6xl text-white font-light">
                Published Memorials
              </h2>
              <p className="text-lg text-brand-white/80 font-serif italic mt-2">
                Real memorials, real stories.
              </p>
            </div>
            <Link
              to="/memorials"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold hover:bg-brand-gold-light text-brand-primary font-bold uppercase tracking-wide rounded-lg transition-all hover:scale-105 text-sm"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoadingExamples ? (
              [1, 2, 3].map((n) => (
                <div key={n} className="bg-brand-primary/50 rounded-2xl p-8 border border-brand-gold/30 animate-pulse h-80" />
              ))
            ) : featuredMemorials.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-brand-white/50 text-sm">
                No published memorials yet.
              </div>
            ) : (
              featuredMemorials.map((m) => (
                <Link
                  key={m.id}
                  to={`/memorial/${m.slug}`}
                  className="group bg-brand-primary/60 backdrop-blur-md border-2 border-brand-gold/50 hover:border-brand-gold rounded-2xl p-8 flex flex-col justify-between transition-all hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-xs font-mono text-brand-white/70">
                      <span className="text-brand-gold-light uppercase font-bold">
                        {m.templateType === 'MALE' && 'Classic'}
                        {m.templateType === 'FEMALE' && 'Grace'}
                        {m.templateType === 'CHILD' && 'Wonder'}
                      </span>
                      <span>{formatDate(m.dateOfBirth)} — {formatDate(m.dateOfPassing)}</span>
                    </div>

                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-brand-gold/60 group-hover:border-brand-gold transition-all mx-auto">
                      <img
                        src={m.mainPhotograph}
                        alt={m.fullName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="text-center space-y-2">
                      <h3 className="font-serif text-2xl text-white group-hover:text-brand-gold-light transition-colors line-clamp-1 font-semibold">
                        {m.fullName}
                      </h3>
                      {m.biography && (
                        <p className="text-xs text-brand-white/70 line-clamp-2 italic font-serif">
                          "{m.biography}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-brand-gold/30 flex items-center justify-between">
                    <span className="text-xs text-brand-white/50 font-mono">/memorial/{m.slug}</span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-brand-gold-light group-hover:translate-x-0.5 transition-transform">
                      <span>Visit</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. QR SECTION - Primary Green */}
      <section className="py-24 bg-brand-primary text-white font-sans">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-brand-secondary/60 backdrop-blur-md rounded-2xl border-2 border-brand-gold/60 p-8 text-center space-y-6 shadow-xl">
                <h3 className="font-serif text-3xl text-brand-gold-light font-semibold">
                  Tangible & Digital
                </h3>
                <p className="text-lg text-brand-white/90 font-medium">
                  Scan with any phone to open a memorial instantly.
                </p>
                <div className="p-4 bg-white rounded-xl inline-block shadow-lg mx-auto">
                  <img
                    src={apiUrl('/api/memorials/arthur-pendleton/qr?format=png')}
                    alt="QR Code"
                    className="w-40 h-40"
                  />
                </div>
                <p className="text-sm text-brand-white/70 font-mono">
                  Arthur William Pendleton Memorial
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="font-serif text-5xl lg:text-6xl text-brand-gold-light font-light">
                From ceremony to monument.
              </h2>
              <p className="text-lg text-brand-white/90 leading-relaxed font-medium">
                Print-ready QR codes designed for:
              </p>
              <ul className="space-y-4 text-base text-brand-white/85">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
                  <span className="font-medium">Funeral programs & prayer cards</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
                  <span className="font-medium">Cemetery plaques & urns</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-brand-gold shrink-0 mt-0.5" />
                  <span className="font-medium">Memorial bookmarks & flowers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MODERATION - Secondary Green */}
      <section className="py-24 bg-brand-secondary text-white font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <div className="space-y-3">
            <h2 className="font-serif text-5xl lg:text-6xl text-white font-light">
              Tributes, shared with care.
            </h2>
            <p className="text-lg text-brand-white/80 font-medium">
              Every memory is reviewed. Only approved tributes appear.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-brand-primary/50 backdrop-blur-md p-6 rounded-2xl border border-brand-gold/40">
              <Shield className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <p className="text-base font-medium text-brand-white/90">Family reviews every tribute</p>
            </div>
            <div className="bg-brand-primary/50 backdrop-blur-md p-6 rounded-2xl border border-brand-gold/40">
              <Layers className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <p className="text-base font-medium text-brand-white/90">Unapproved messages stay private</p>
            </div>
            <div className="bg-brand-primary/50 backdrop-blur-md p-6 rounded-2xl border border-brand-gold/40">
              <Heart className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <p className="text-base font-medium text-brand-white/90">Respectful, dignified always</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA - White */}
      <section className="py-24 bg-white font-sans">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="font-serif text-5xl lg:text-6xl text-brand-primary font-light">
            Keep their memory close.
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/memorials"
              className="px-8 py-3.5 bg-brand-gold hover:bg-brand-gold-light text-brand-primary rounded-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm"
            >
              <Search className="w-5 h-5" />
              Explore a Memorial
            </Link>
            <Link
              to="/begin-a-memorial"
              className="px-8 py-3.5 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wide text-sm"
            >
              <Heart className="w-5 h-5" />
              Begin a Memorial
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
