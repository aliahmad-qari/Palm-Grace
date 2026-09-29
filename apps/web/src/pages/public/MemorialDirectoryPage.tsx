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

export const MemorialDirectoryPage: React.FC = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'ALL' | TemplateType>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDirectoryDisabled, setIsDirectoryDisabled] = useState(false);
  const [privacyMessage, setPrivacyMessage] = useState<string | null>(null);

  const fetchMemorials = async (searchTerm = '') => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getPublicMemorials(searchTerm);
      if (res.directoryDisabled) {
        setIsDirectoryDisabled(true);
        setPrivacyMessage(res.message || 'Public discovery directory is currently restricted for family privacy.');
        setMemorials([]);
      } else if (res.success && res.data) {
        setIsDirectoryDisabled(false);
        // Guarantee only published memorials are shown
        setMemorials(res.data.filter((m: Memorial) => m.publicationStatus === 'PUBLISHED'));
      } else {
        setErrorMsg(res.error || 'Failed to retrieve memorials from the sanctuary registry.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to the memorial service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMemorials(search);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const filteredMemorials = memorials.filter((m) => {
    if (selectedTemplate === 'ALL') return true;
    return m.templateType === selectedTemplate;
  });

  return (
    <PublicLayout>
      <div className="bg-stone-900 text-stone-100 min-h-screen font-sans pb-24">
        {/* Directory Header Banner */}
        <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-stone-800 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-900">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold block">
              Public Sanctuary Registry
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl tracking-tight text-white">
              The Memorial Directory
            </h1>
            <p className="text-sm sm:text-base text-stone-400 font-serif italic max-w-2xl mx-auto leading-relaxed">
              "To live in hearts we leave behind is not to die. Discover and honor the lives commemorated across our digital sanctuary."
            </p>

            {/* Search Input Bar */}
            <div className="pt-6 max-w-xl mx-auto">
              <div className="relative">
                <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search memorials by full name..."
                  className="w-full pl-11 pr-10 py-3.5 bg-stone-800/90 border border-stone-700 rounded-xl text-sm sm:text-base text-white placeholder-stone-500 focus:outline-hidden focus:border-amber-400 focus:ring-1 focus:ring-amber-400 shadow-md transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white p-1"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Template Filters */}
            <div className="flex items-center justify-center gap-2 pt-3 flex-wrap text-xs">
              <button
                onClick={() => setSelectedTemplate('ALL')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedTemplate === 'ALL'
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                    : 'bg-stone-800 text-stone-300 hover:text-white'
                }`}
              >
                All Sanctuaries
              </button>
              <button
                onClick={() => setSelectedTemplate('MALE')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedTemplate === 'MALE'
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                    : 'bg-stone-800 text-stone-300 hover:text-white'
                }`}
              >
                Classic Dignity
              </button>
              <button
                onClick={() => setSelectedTemplate('FEMALE')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedTemplate === 'FEMALE'
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                    : 'bg-stone-800 text-stone-300 hover:text-white'
                }`}
              >
                Grace &amp; Botanical
              </button>
              <button
                onClick={() => setSelectedTemplate('CHILD')}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedTemplate === 'CHILD'
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                    : 'bg-stone-800 text-stone-300 hover:text-white'
                }`}
              >
                Gentle Celestial
              </button>
            </div>
          </div>
        </section>

        {/* Directory Content Area */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* Privacy Disabled Notice (Architected to disable directory without rebuilding memorial system) */}
          {isDirectoryDisabled && (
            <div className="p-8 sm:p-12 rounded-2xl bg-stone-800/80 border border-stone-700 text-center max-w-2xl mx-auto space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl text-white">
                Directory Restricted by Privacy Policy
              </h2>
              <p className="text-sm text-stone-400 leading-relaxed">
                {privacyMessage || 'Public discovery of memorials is currently restricted to uphold family privacy preferences. Individual memorials remain fully active and accessible via direct private links and stationery QR codes.'}
              </p>
              <div className="pt-2 text-xs text-stone-500 font-mono">
                Direct URL Format: /memorial/[unique-slug]
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && !isDirectoryDisabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-stone-800/50 rounded-2xl p-6 border border-stone-800 space-y-4 animate-pulse">
                  <div className="w-24 h-24 rounded-full bg-stone-700/60 mx-auto" />
                  <div className="h-5 bg-stone-700/60 rounded-md w-3/4 mx-auto" />
                  <div className="h-3 bg-stone-700/40 rounded-md w-1/2 mx-auto" />
                  <div className="h-16 bg-stone-700/30 rounded-md w-full" />
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
                onClick={() => fetchMemorials(search)}
                className="mt-2 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty Search State */}
          {!isLoading && !errorMsg && !isDirectoryDisabled && filteredMemorials.length === 0 && (
            <div className="py-16 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-white">No Memorials Found</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {search
                  ? `No published memorial records match the search term "${search}". Please verify spelling or try another keyword.`
                  : 'No published memorials match the selected template filter.'}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold rounded-lg transition-colors shadow-xs"
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
                    className="group bg-stone-800/70 hover:bg-stone-800 border border-stone-700/70 hover:border-amber-400/60 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-5">
                        <span className="text-[11px] font-mono tracking-wider text-amber-300 uppercase px-2.5 py-0.5 rounded-full bg-stone-900/80 border border-stone-700">
                          {m.templateType === 'MALE' && 'Classic Dignity'}
                          {m.templateType === 'FEMALE' && 'Grace & Botanical'}
                          {m.templateType === 'CHILD' && 'Gentle Celestial'}
                        </span>

                        {m.livestreamUrl && (
                          <span className="flex items-center gap-1 text-[11px] text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span>Livestream</span>
                          </span>
                        )}
                      </div>

                      {/* Portrait & Identity */}
                      <div className="text-center space-y-3">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-stone-600 group-hover:border-amber-300 transition-colors mx-auto bg-stone-900 shadow-md">
                          <img
                            src={m.mainPhotograph}
                            alt={m.fullName}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div>
                          <h2 className="font-serif text-xl sm:text-2xl text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                            {m.fullName}
                          </h2>
                          <p className="text-xs text-stone-400 tracking-wider font-light mt-0.5">
                            {birthYear} — {passYear}
                          </p>
                        </div>
                      </div>

                      {/* Life Story excerpt */}
                      {m.biography && (
                        <p className="mt-4 text-xs sm:text-sm text-stone-300 line-clamp-3 italic font-serif leading-relaxed text-center px-2">
                          "{m.biography}"
                        </p>
                      )}
                    </div>

                    {/* Bottom Metadata & Enter Button */}
                    <div className="mt-6 pt-4 border-t border-stone-700/60 flex items-center justify-between text-xs text-stone-400">
                      <div className="flex items-center gap-3">
                        {m.media && m.media.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Images className="w-3.5 h-3.5 text-stone-400" />
                            <span>{m.media.length}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-400" />
                          <span>{m._count?.tributes ?? m.tributes?.length ?? 0}</span>
                        </span>
                      </div>

                      <span className="inline-flex items-center gap-1 font-semibold text-amber-300 group-hover:translate-x-0.5 transition-transform">
                        <span>Enter Sanctuary</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
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
