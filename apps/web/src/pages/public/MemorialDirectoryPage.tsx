import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  X,
  Sparkles,
  Calendar,
  Video,
  ArrowRight,
  AlertCircle,
  Loader2,
  Lock,
  Heart,
  Images,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout.js';
import { api } from '../../lib/api.js';
import { Memorial, TemplateType } from '../../types/index.js';
import { calendarYear } from '../../lib/calendarDate.js';

export const MemorialDirectoryPage: React.FC = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'ALL' | TemplateType>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDirectoryDisabled, setIsDirectoryDisabled] = useState(false);
  const [privacyMessage, setPrivacyMessage] = useState<string | null>(null);

  const fetchMemorials = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getPublicMemorials();
      if (res.directoryDisabled) {
        setIsDirectoryDisabled(true);
        setPrivacyMessage(res.message || 'Public discovery directory is currently restricted for family privacy.');
        setMemorials([]);
      } else if (res.success && res.data) {
        setIsDirectoryDisabled(false);
        // Guarantee only published memorials are shown
        setMemorials(res.data.filter((m: Memorial) => m.publicationStatus === 'PUBLISHED'));
      } else {
        setErrorMsg(res.error || 'Unable to load memorials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to the memorial service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemorials();
  }, []);

  const formatDate = calendarYear;

  const filteredMemorials = memorials.filter((m) => {
    if (selectedTemplate !== 'ALL' && m.templateType !== selectedTemplate) return false;
    const term = search.trim().toLocaleLowerCase();
    return !term || [m.fullName, m.preferredDisplayName, m.biography].some(value => value?.toLocaleLowerCase().includes(term));
  });

  return (
    <PublicLayout>
      <div className="min-h-screen bg-brand-white pb-24 font-sans text-brand-charcoal">
        {/* Directory Header Banner */}
        <section className="border-b border-brand-gold/30 bg-brand-gold-light/20 px-4 pb-12 pt-32 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="block text-xs font-semibold uppercase tracking-widest text-brand-secondary">
              Lives Remembered
            </span>
            <h1 className="font-serif text-4xl tracking-tight text-brand-primary sm:text-6xl">
              Memorials
            </h1>
            <p className="mx-auto max-w-2xl font-serif text-base leading-relaxed text-brand-charcoal/75 sm:text-lg">
              Every life holds a story worth remembering. Find someone you love and spend time with their memories.
            </p>

            {/* Search Input Bar */}
            <div className="pt-6 max-w-xl mx-auto">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-secondary" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search memorials by full name..."
                  aria-label="Search memorials by name"
                  className="w-full rounded-2xl border border-brand-gold/60 bg-white py-3.5 pl-11 pr-10 text-sm text-brand-primary shadow-sm transition-colors placeholder:text-brand-charcoal/50 focus:border-brand-secondary focus:outline-hidden focus:ring-2 focus:ring-brand-gold/40 sm:text-base"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-brand-secondary hover:text-brand-primary"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Keep the person, not the template, at the centre of browsing. */}
            <details className="mx-auto max-w-xl pt-3 text-center text-xs text-brand-secondary">
              <summary className="inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 py-2 font-medium hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-primary">Filter by memorial style{selectedTemplate !== 'ALL' ? ' (active)' : ''}</summary>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setSelectedTemplate('ALL')}
                className={`min-h-11 px-3.5 py-2 rounded-lg font-medium transition-colors ${
                  selectedTemplate === 'ALL'
                    ? 'bg-brand-primary text-white font-bold shadow-xs'
                    : 'border border-brand-gold/50 bg-white text-brand-secondary hover:bg-brand-gold-light/30'
                }`}
              >
                All Memorials
              </button>
              <button
                onClick={() => setSelectedTemplate('MALE')}
                className={`min-h-11 px-3.5 py-2 rounded-lg font-medium transition-colors ${
                  selectedTemplate === 'MALE'
                    ? 'bg-brand-primary text-white font-bold shadow-xs'
                    : 'border border-brand-gold/50 bg-white text-brand-secondary hover:bg-brand-gold-light/30'
                }`}
              >
                Classic Dignity
              </button>
              <button
                onClick={() => setSelectedTemplate('FEMALE')}
                className={`min-h-11 px-3.5 py-2 rounded-lg font-medium transition-colors ${
                  selectedTemplate === 'FEMALE'
                    ? 'bg-brand-primary text-white font-bold shadow-xs'
                    : 'border border-brand-gold/50 bg-white text-brand-secondary hover:bg-brand-gold-light/30'
                }`}
              >
                Grace &amp; Warmth
              </button>
              <button
                onClick={() => setSelectedTemplate('CHILD')}
                className={`min-h-11 px-3.5 py-2 rounded-lg font-medium transition-colors ${
                  selectedTemplate === 'CHILD'
                    ? 'bg-brand-primary text-white font-bold shadow-xs'
                    : 'border border-brand-gold/50 bg-white text-brand-secondary hover:bg-brand-gold-light/30'
                }`}
              >
                Gentle Wonder
              </button>
              </div>
            </details>
          </div>
        </section>

        {/* Directory Content Area */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* Privacy Disabled Notice (Architected to disable directory without rebuilding memorial system) */}
          {isDirectoryDisabled && (
            <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-brand-gold/40 bg-brand-gold-light/20 p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-brand-gold-light">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl text-brand-primary">
                Memorial browsing is unavailable
              </h2>
              <p className="text-sm leading-relaxed text-brand-charcoal/75">
                {privacyMessage || 'Public browsing is currently unavailable. Published memorials remain accessible through their direct links and QR codes.'}
              </p>
              <div className="pt-2 font-mono text-xs text-brand-secondary">
                Direct URL Format: /memorial/[unique-slug]
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && !isDirectoryDisabled && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 sm:gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="motion-safe:animate-pulse space-y-4 rounded-2xl border border-brand-gold/25 bg-brand-gold-light/15 p-4">
                  <div className="h-60 rounded-xl bg-brand-gold/20" />
                  <div className="h-5 w-3/4 rounded-md bg-brand-gold/20" />
                  <div className="h-3 w-1/2 rounded-md bg-brand-gold/15" />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {errorMsg && !isLoading && !isDirectoryDisabled && (
            <div className="p-8 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-center max-w-md mx-auto space-y-3">
              <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
              <h3 className="font-serif text-lg text-white">Unable to Load Memorials</h3>
              <p className="text-xs text-rose-300">{errorMsg}</p>
              <button
                onClick={() => fetchMemorials()}
                className="mt-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty Search State */}
          {!isLoading && !errorMsg && !isDirectoryDisabled && filteredMemorials.length === 0 && (
            <div className="py-16 text-center max-w-md mx-auto space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold-light/40 text-brand-primary">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-brand-primary">No memorials found</h3>
              <p className="text-xs leading-relaxed text-brand-charcoal/70">
                {search
                  ? `No published memorial records match the search term "${search}". Please verify spelling or try another keyword.`
                  : 'No published memorials match the selected template filter.'}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="rounded-lg bg-brand-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-secondary"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Memorial Cards Grid */}
          {!isLoading && !errorMsg && !isDirectoryDisabled && filteredMemorials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredMemorials.map((m) => {
                const birthYear = formatDate(m.dateOfBirth);
                const passYear = formatDate(m.dateOfPassing);

                return (
                  <Link
                    key={m.id}
                    to={`/memorial/${m.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-brand-gold/35 bg-brand-gold-light/15 shadow-[0_14px_35px_rgba(43,67,51,.08)] motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1 hover:border-brand-gold hover:shadow-[0_20px_45px_rgba(43,67,51,.14)]"
                  >
                    <img src={m.mainPhotograph} alt={m.preferredDisplayName || m.fullName} className="h-64 w-full object-cover sm:h-72" style={{ objectPosition: `${m.portraitPositionX ?? 50}% ${m.portraitPositionY ?? 50}%` }} referrerPolicy="no-referrer" loading="lazy" decoding="async" />
                    <div className="flex flex-1 flex-col p-6">
                      {(birthYear || passYear) && <p className="text-xs font-semibold tracking-[0.16em] text-brand-secondary">{birthYear}{birthYear && passYear ? ' — ' : ''}{passYear}</p>}
                      <h2 className="mt-2 font-serif text-2xl text-brand-primary group-hover:text-brand-secondary sm:text-3xl">{m.preferredDisplayName || m.fullName}</h2>
                      {(m.memorialLine || m.biography) && <p className="mt-3 line-clamp-3 text-sm leading-6 text-brand-charcoal/70">{m.memorialLine || m.biography}</p>}
                      <span className="mt-auto inline-flex items-center gap-2 border-t border-brand-gold/35 pt-5 text-sm font-semibold text-brand-primary">View Memorial <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PublicLayout>
  );
};
