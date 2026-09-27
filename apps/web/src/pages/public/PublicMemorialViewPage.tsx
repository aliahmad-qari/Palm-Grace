import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Video,
  Play,
  Heart,
  Share2,
  QrCode,
  Download,
  X,
  MessageSquareHeart,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  Send,
  ExternalLink,
  Copy,
  Check,
  Compass
} from 'lucide-react';
import { PublicLayout } from '../../components/public/PublicLayout.js';
import { api, apiUrl } from '../../lib/api.js';
import { Memorial, MemorialMedia, Tribute } from '../../types/index.js';
import { resolveMemorialTemplate } from '../../components/memorial/templateResolver.js';
import { useMemorialSEO } from '../../components/memorial/useMemorialSEO.js';
import { MemorialGalleryLightbox } from '../../components/memorial/MemorialGalleryLightbox.js';
import { MemorialSocialShareModal } from '../../components/memorial/MemorialSocialShareModal.js';

export const PublicMemorialViewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tribute Form State
  const [visitorName, setVisitorName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmittingTribute, setIsSubmittingTribute] = useState(false);
  const [tributeFeedback, setTributeFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Gallery Modal Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Modals & Clipboard State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // SEO & Social Structured Data Hook
  useMemorialSEO(memorial);

  useEffect(() => {
    if (slug) {
      loadMemorial(slug);
    }
  }, [slug]);

  const loadMemorial = async (targetSlug: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getPublicMemorial(targetSlug);
      if (res.success && res.data) {
        // Enforce: only PUBLISHED memorials may render publicly
        if (res.data.publicationStatus !== 'PUBLISHED') {
          setErrorMsg('This memorial is currently private and being prepared by family administrators.');
          setMemorial(null);
        } else {
          setMemorial(res.data);
        }
      } else {
        setErrorMsg(res.error || 'The requested memorial could not be found or is currently private.');
        setMemorial(null);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to the sanctuary.');
      setMemorial(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTributeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !visitorName.trim() || !message.trim()) return;

    setIsSubmittingTribute(true);
    setTributeFeedback(null);

    try {
      const res = await api.submitTribute(slug, {
        visitorName: visitorName.trim(),
        message: message.trim(),
      });

      if (res.success) {
        setTributeFeedback({
          type: 'success',
          text: 'Your words of tribute have been received with profound gratitude. To preserve the sanctuary’s sanctity, it will appear publicly following family moderation.',
        });
        setVisitorName('');
        setMessage('');
      } else {
        setTributeFeedback({
          type: 'error',
          text: res.error || 'Unable to submit tribute at this time. Please try again.',
        });
      }
    } catch (err: any) {
      setTributeFeedback({
        type: 'error',
        text: err.message || 'Network error submitting tribute.',
      });
    } finally {
      setIsSubmittingTribute(false);
    }
  };

  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Structured Service Info parsing
  let serviceInfoObj: { venue?: string; date?: string; address?: string; reception?: string } | null = null;
  if (memorial?.serviceInformation) {
    try {
      serviceInfoObj = JSON.parse(memorial.serviceInformation);
    } catch {
      // plain text fallback handled in render
    }
  }

  // Template Resolver
  const theme = resolveMemorialTemplate(memorial?.templateType);

  // Loading State
  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-stone-400">
          <Loader2 className="w-8 h-8 text-amber-300 animate-spin mb-3" />
          <span className="font-serif text-lg tracking-wider text-stone-200 uppercase">
            Entering The Sanctuary
          </span>
          <span className="text-xs text-stone-500 font-sans mt-1">
            Loading memorial records with reverent care...
          </span>
        </div>
      </PublicLayout>
    );
  }

  // 404 / Private / Error State
  if (errorMsg || !memorial) {
    return (
      <PublicLayout>
        <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-300 mb-4 shadow-lg">
            <Sparkles className="w-6 h-6 opacity-60" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-100 mb-2">
            Sanctuary Not Available
          </h2>
          <p className="text-sm text-stone-400 leading-relaxed mb-6 font-sans">
            {errorMsg || 'This memorial is either unlisted, in private preparation, or does not exist.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => slug && loadMemorial(slug)}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors border border-stone-700"
            >
              Retry Connection
            </button>
            <Link
              to="/memorials"
              className="inline-flex items-center gap-2 px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs uppercase tracking-wider font-bold rounded-lg transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Memorial Directory</span>
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  // Conditional Ceremony Broadcasts: Rule #18 (Only render if at least one URL exists)
  const hasLivestream = Boolean(memorial.livestreamUrl && memorial.livestreamUrl.trim());
  const hasRecording = Boolean(memorial.recordingUrl && memorial.recordingUrl.trim());
  const hasBroadcasts = hasLivestream || hasRecording;

  return (
    <PublicLayout>
      <div className={`min-h-screen ${theme.rootBg} ${theme.bodyTextColor} transition-colors duration-300 pb-24 font-sans`}>
        {/* Navigation & Utilities Header Bar */}
        <div className="border-b border-white/5 py-4 px-4 sm:px-8 bg-stone-950/40 backdrop-blur-xs">
          <div className="max-w-5xl mx-auto flex items-center justify-between text-xs">
            <Link
              to="/memorials"
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Sanctuary Directory</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors border border-white/5"
                title="View &amp; Print Stationery QR Code"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Stationery</span>
                <span>QR</span>
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors border border-white/5"
                title="Share Sanctuary Link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. HERO SECTION (Template Styled: Male / Female / Child) */}
        <section className={`pt-14 sm:pt-20 pb-16 px-4 ${theme.heroGradient} text-center relative overflow-hidden`}>
          {/* Subtle Motif Ornamentation based on template */}
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            {/* Focal Portrait Frame with Responsive Wrap & High-Fidelity Glow */}
            <div className="relative inline-block mx-auto">
              <div
                className={`w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 ${theme.portraitBorder} ${theme.portraitGlow} bg-stone-900 mx-auto transition-transform duration-300`}
              >
                <img
                  src={memorial.mainPhotograph}
                  alt={memorial.fullName}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Template Atmospheric Badge */}
              <div
                className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full border text-[11px] font-sans tracking-widest uppercase shadow-md whitespace-nowrap ${theme.badgeStyle}`}
              >
                In Loving Memory
              </div>
            </div>

            {/* Deceased Full Name (Handles Long Names with Balanced Scaling & Line-Heights) */}
            <div className="space-y-2 pt-3">
              <h1
                className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight ${theme.headingColor} break-words max-w-3xl mx-auto leading-tight`}
              >
                {memorial.fullName}
              </h1>

              {/* Dates of Birth and Passing */}
              <p className={`text-sm sm:text-base tracking-widest ${theme.mutedTextColor} font-light`}>
                {formatDate(memorial.dateOfBirth)} — {formatDate(memorial.dateOfPassing)}
              </p>
            </div>

            {/* Opening Biography Inscription */}
            {memorial.biography && (
              <div className="max-w-2xl mx-auto pt-2 px-4">
                <p className={`font-serif italic text-lg sm:text-xl ${theme.bodyTextColor} leading-relaxed font-normal`}>
                  "{memorial.biography}"
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 2. CONDITIONAL CEREMONY BROADCASTS (Rule #18: Disappears completely if no livestream and no recording exist) */}
        {hasBroadcasts && (
          <section className="max-w-4xl mx-auto px-4 -mt-6 mb-12 relative z-20">
            <div
              className={`p-6 sm:p-7 rounded-2xl border ${theme.cardBorder} ${theme.cardBg} shadow-2xl backdrop-blur-md space-y-4`}
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-200">
                <Video className="w-4 h-4 text-rose-400" />
                <span>Ceremonial Service Broadcasts</span>
              </div>

              <div className={`grid grid-cols-1 ${hasLivestream && hasRecording ? 'sm:grid-cols-2' : ''} gap-4`}>
                {/* Livestream Section */}
                {hasLivestream && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between gap-3 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        <h3 className="font-serif text-base font-semibold text-white">
                          Live Service Stream
                        </h3>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Join family, relatives, and distant friends in real-time communion for the ceremony.
                      </p>
                    </div>
                    <a
                      href={memorial.livestreamUrl!}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                    >
                      <span>Join Live Broadcast</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {/* Service Recording Section */}
                {hasRecording && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between gap-3 shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-amber-300">
                        <Play className="w-4 h-4" />
                        <h3 className="font-serif text-base font-semibold text-white">
                          Ceremony Recording
                        </h3>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Archived broadcast of the memorial ceremony, eulogies, and commemorative readings.
                      </p>
                    </div>
                    <a
                      href={memorial.recordingUrl!}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-800 hover:bg-stone-750 text-amber-200 rounded-lg text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors shadow-sm"
                    >
                      <span>Watch Ceremony Recording</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 3. EXTENDED LIFE STORY / EULOGY (Gracefully handles long multiline prose) */}
        {memorial.lifeStory && (
          <section className="max-w-3xl mx-auto px-4 py-10 space-y-6">
            <div className="text-center space-y-2">
              <span className={`text-[11px] uppercase tracking-widest ${theme.accentColor} font-semibold block`}>
                The Chronicle
              </span>
              <h2 className={`font-serif text-2xl sm:text-4xl ${theme.headingColor}`}>
                The Life &amp; Journey
              </h2>
              <div className={`w-12 h-px ${theme.dividerColor} mx-auto`} />
            </div>

            <div
              className={`prose prose-invert max-w-none ${theme.bodyTextColor} leading-relaxed text-base sm:text-lg whitespace-pre-line ${theme.subtleBoxBg} p-6 sm:p-10 rounded-2xl border ${theme.subtleBoxBorder} shadow-inner font-sans`}
            >
              {memorial.lifeStory}
            </div>
          </section>
        )}

        {/* 4. CEREMONIAL SERVICE INFORMATION (Structured details, venue, address, notes) */}
        {(serviceInfoObj || memorial.serviceInformation) && (
          <section className="max-w-3xl mx-auto px-4 py-8">
            <div className={`p-6 sm:p-8 rounded-2xl border ${theme.cardBorder} ${theme.cardBg} space-y-5 shadow-xl`}>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-stone-200">
                  <MapPin className="w-4 h-4 text-amber-300" />
                  <span>Ceremonial Service Gathering</span>
                </div>
                {serviceInfoObj?.address && (
                  <button
                    onClick={() => handleCopyAddress(serviceInfoObj!.address!)}
                    className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-white transition-colors"
                    title="Copy full venue address"
                  >
                    {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAddress ? 'Address Copied' : 'Copy Address'}</span>
                  </button>
                )}
              </div>

              {serviceInfoObj ? (
                <div className="space-y-4">
                  {serviceInfoObj.venue && (
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                        Sanctuary / Venue
                      </span>
                      <h4 className="font-serif text-xl sm:text-2xl text-white mt-0.5">
                        {serviceInfoObj.venue}
                      </h4>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {serviceInfoObj.date && (
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                          Date &amp; Time
                        </span>
                        <div className="flex items-center gap-2 text-stone-200 text-sm">
                          <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                          <span>{formatDate(serviceInfoObj.date)}</span>
                        </div>
                      </div>
                    )}

                    {serviceInfoObj.address && (
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                          Sanctuary Address
                        </span>
                        <div className="flex items-start gap-2 text-stone-200 text-sm">
                          <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                          <span className="leading-snug">{serviceInfoObj.address}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {serviceInfoObj.reception && (
                    <div className="pt-3 border-t border-white/10 text-xs text-stone-400 leading-relaxed space-y-1">
                      <span className="font-semibold uppercase tracking-wider text-stone-300 text-[10px] block">
                        Reception &amp; Gathering Notes
                      </span>
                      <p className="text-stone-300 italic">{serviceInfoObj.reception}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-line text-sm text-stone-300 leading-relaxed font-sans">
                  {memorial.serviceInformation}
                </p>
              )}
            </div>
          </section>
        )}

        {/* 5. REMEMBRANCE PHOTO GALLERY (Handles Large Galleries with Lightbox) */}
        {memorial.media && memorial.media.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 py-12 space-y-6">
            <div className="text-center space-y-2">
              <span className={`text-[11px] uppercase tracking-widest ${theme.accentColor} font-semibold block`}>
                Archival Photographs
              </span>
              <h2 className={`font-serif text-2xl sm:text-4xl ${theme.headingColor}`}>
                Remembrance Gallery
              </h2>
              <p className="text-xs text-stone-400 font-sans tracking-wider">
                {memorial.media.length} {memorial.media.length === 1 ? 'Photograph' : 'Photographs'} preserved in honor of {memorial.fullName}
              </p>
              <div className={`w-12 h-px ${theme.dividerColor} mx-auto`} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {memorial.media.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => setLightboxIndex(idx)}
                  className={`group relative aspect-4/3 rounded-xl overflow-hidden bg-stone-900 border border-white/10 cursor-pointer shadow-md transition-all duration-300 hover:scale-[1.02] ${theme.cardHoverBorder}`}
                  title="Click to view full photograph"
                >
                  <img
                    src={img.url}
                    alt={img.caption || `Remembrance photo ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors" />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-stone-950/85 p-2 text-[11px] text-stone-300 truncate font-sans">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. FAMILY ACKNOWLEDGEMENT (Words of gratitude) */}
        {memorial.familyAcknowledgement && (
          <section className="max-w-3xl mx-auto px-4 py-10">
            <div className="p-8 sm:p-10 rounded-2xl bg-white/4 border border-white/10 text-center space-y-3 relative overflow-hidden shadow-xl">
              <Heart className="w-6 h-6 text-rose-300 mx-auto opacity-80" />
              <h3 className="font-sans text-xs uppercase tracking-widest text-stone-400 font-semibold">
                Words of Gratitude from the Family
              </h3>
              <p className="font-serif italic text-base sm:text-lg text-stone-200/90 leading-relaxed max-w-xl mx-auto">
                "{memorial.familyAcknowledgement}"
              </p>
            </div>
          </section>
        )}

        {/* 7. WORDS OF TRIBUTE & GUESTBOOK (Rule #17: Displays approved tributes only) */}
        <section className="max-w-4xl mx-auto px-4 py-14 space-y-10" id="tributes">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-amber-300 mb-1">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <h2 className={`font-serif text-3xl sm:text-4xl ${theme.headingColor}`}>
              Words of Tribute &amp; Condolences
            </h2>
            <p className="text-xs text-stone-400 font-sans tracking-wide max-w-md mx-auto">
              Share a memory, heartfelt condolence, or prayer. To protect the family sanctuary, submissions are reviewed respectfully before publication.
            </p>
          </div>

          {/* Tribute Submission Form */}
          <div className={`p-6 sm:p-8 rounded-2xl border ${theme.cardBorder} ${theme.cardBg} shadow-2xl max-w-2xl mx-auto`}>
            <h3 className="font-serif text-lg font-semibold text-white mb-4">
              Leave a Remembrance Tribute
            </h3>

            {tributeFeedback && (
              <div
                className={`mb-5 p-3.5 rounded-lg flex items-start gap-2.5 text-xs font-sans ${
                  tributeFeedback.type === 'success'
                    ? 'bg-emerald-950/80 border border-emerald-700/80 text-emerald-200'
                    : 'bg-rose-950/80 border border-rose-700/80 text-rose-200'
                }`}
              >
                {tributeFeedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{tributeFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleTributeSubmit} className="space-y-4 font-sans">
              {/* Spam/Bot trap honeypot field - invisible to human visitors */}
              <input
                type="text"
                name="website"
                value=""
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden pointer-events-none opacity-0 h-0 w-0 absolute -z-10"
              />

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="e.g. Dr. Alistair MacLeod"
                  className={`w-full px-3.5 py-2.5 rounded-lg ${theme.inputBg} border ${theme.inputBorder} text-white text-sm placeholder-stone-500 focus:outline-hidden`}
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-300 font-semibold mb-1.5">
                  Your Tribute or Memory *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your reflection, a shared memory, or a gentle message to the family..."
                  className={`w-full px-3.5 py-2.5 rounded-lg ${theme.inputBg} border ${theme.inputBorder} text-white text-sm placeholder-stone-500 focus:outline-hidden leading-relaxed`}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-stone-400">
                  Submissions are reviewed respectfully by family caretakers.
                </span>
                <button
                  type="submit"
                  disabled={isSubmittingTribute}
                  className={`px-5 py-2.5 ${theme.buttonPrimary} text-xs uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50`}
                >
                  {isSubmittingTribute ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Post Tribute</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Approved Tributes Wall */}
          <div className="space-y-4 max-w-2xl mx-auto pt-4 rounded-2xl border border-amber-300/30 bg-gradient-to-br from-stone-800 to-stone-900 p-5 sm:p-6 shadow-xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-amber-200/20 pb-3">
              <h3 className="font-serif text-xl text-stone-100">
                Published Tributes ({memorial.tributes?.length || 0})
              </h3>
              <span className="text-[11px] text-amber-300 font-sans">
                Approved by Caretakers
              </span>
            </div>

            {(!memorial.tributes || memorial.tributes.length === 0) ? (
              <div className="text-center py-10 bg-stone-950/60 rounded-xl border border-stone-700">
                <p className="text-sm font-serif italic text-stone-400">
                  Be the first to share a tribute in honor of {memorial.fullName}.
                </p>
              </div>
            ) : (
              memorial.tributes.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-xl bg-stone-950/55 border border-stone-600/80 space-y-2 shadow-xs transition-colors hover:border-amber-300/40 hover:bg-stone-950/75"
                >
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="font-serif text-base font-semibold text-amber-300">
                      {t.visitorName}
                    </span>
                    <span className="text-stone-400 tabular-nums">
                      {formatDate(t.createdAt)}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-stone-200 whitespace-pre-line leading-relaxed italic">
                    "{t.message}"
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 8. GALLERY LIGHTBOX MODAL */}
        {lightboxIndex !== null && memorial.media && (
          <MemorialGalleryLightbox
            media={memorial.media}
            currentIndex={lightboxIndex}
            isOpen={lightboxIndex !== null}
            onClose={() => setLightboxIndex(null)}
            onNavigate={(newIndex) => setLightboxIndex(newIndex)}
          />
        )}

        {/* 9. SOCIAL SHARING MODAL */}
        <MemorialSocialShareModal
          memorial={memorial}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onOpenQr={() => setIsQrModalOpen(true)}
        />

        {/* 10. PHYSICAL MEMORIAL QR MODAL (Lossless Vector SVG & 300+ DPI PNG) */}
        {isQrModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none"
            onClick={() => setIsQrModalOpen(false)}
          >
            <div
              className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                aria-label="Close QR Modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-stone-800 border border-stone-700 text-amber-300 flex items-center justify-center mx-auto">
                <QrCode className="w-6 h-6" />
              </div>

              <div>
                <h3 className="font-serif text-xl text-white font-semibold">
                  Physical Memorial QR Code
                </h3>
                <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Precision digital bridge for ceremony stationery, funeral booklets, prayer cards, and engraved metal plaques.
                </p>
              </div>

              {/* QR Image Preview with White High-Contrast Backdrop */}
              <div className="p-4 bg-white rounded-xl inline-block shadow-inner mx-auto my-1">
                <img
                  src={apiUrl(`/api/memorials/${memorial.slug}/qr?format=png`)}
                  alt={`${memorial.fullName} QR Code`}
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-stone-300 font-semibold block">
                  /{memorial.slug}
                </span>
                <p className="text-[11px] text-stone-400 font-mono">
                  Scan with any smartphone camera to access this sanctuary.
                </p>
              </div>

              {/* Download Vector & Print Assets */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <a
                  href={apiUrl(`/api/memorials/${memorial.slug}/qr?format=svg&download=1`)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Vector SVG</span>
                </a>
                <a
                  href={apiUrl(`/api/memorials/${memorial.slug}/qr?format=png&download=1`)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>300 DPI PNG</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};
