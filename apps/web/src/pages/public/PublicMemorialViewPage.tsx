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
  Compass,
  ArrowDown
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
  const [lifeStoryExpanded, setLifeStoryExpanded] = useState(false);

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
          text: 'Your words of remembrance have been received with gratitude. To preserve the sanctuary’s reverence, your memory will appear publicly following family moderation.',
        });
        setVisitorName('');
        setMessage('');
      } else {
        setTributeFeedback({
          type: 'error',
          text: res.error || 'Unable to submit your memory at this time. Please try again.',
        });
      }
    } catch (err: any) {
      setTributeFeedback({
        type: 'error',
        text: err.message || 'Network error submitting your memory.',
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

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Structured Service Info parsing
  let serviceInfoObj: { title?: string; venue?: string; date?: string; time?: string; address?: string; reception?: string } | null = null;
  if (memorial?.serviceInformation) {
    try {
      serviceInfoObj = JSON.parse(memorial.serviceInformation);
    } catch {
      // plain text fallback handled in render
    }
  }

  const hasStructuredService = Boolean(memorial && (memorial.serviceTitle || memorial.serviceDate || memorial.serviceTime || memorial.serviceVenue || memorial.serviceAddress));
  if (memorial && hasStructuredService) {
    serviceInfoObj = {
      title: memorial.serviceTitle || undefined,
      venue: memorial.serviceVenue || undefined,
      date: memorial.serviceDate || undefined,
      time: memorial.serviceTime || undefined,
      address: memorial.serviceAddress || undefined,
    };
  }
  if (memorial?.viewingWakeInformation && !serviceInfoObj) serviceInfoObj = {};

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
  const displayName = memorial.preferredDisplayName || memorial.fullName;
  const visibleBirthDate = memorial.showBirthDate === false ? null : (memorial.birthDate || memorial.dateOfBirth);
  const visibleDeathDate = memorial.showDeathDate === false ? null : (memorial.deathDate || memorial.dateOfPassing);
  const hasDates = Boolean(visibleBirthDate || visibleDeathDate);
  const photos = (memorial.media || []).filter((item) => item.mediaType !== 'VIDEO');
  const videos = (memorial.media || []).filter((item) => item.mediaType === 'VIDEO');
  const hasGallery = photos.length > 0 || videos.length > 0;
  const hasService = Boolean(serviceInfoObj || memorial.serviceInformation || memorial.viewingWakeInformation);
  const arrivalImage = photos[0]?.url || memorial.mainPhotograph;
  const storyParagraphs = memorial.lifeStory?.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean) || [];
  const hasLongStory = (memorial.lifeStory?.length || 0) > 700;
  const storyPreview = hasLongStory ? `${memorial.lifeStory!.slice(0, 700).replace(/\s+\S*$/, '')}…` : memorial.lifeStory;
  const backgroundImage = memorial.templateType === 'MALE'
    ? '/homepage image.png'
    : memorial.templateType === 'FEMALE'
      ? '/Golden Memories by the Lake.png'
      : arrivalImage;

  return (
    <PublicLayout>
      <div className={`min-h-screen ${theme.rootBg} ${theme.bodyTextColor} transition-colors duration-300 font-sans`}>
        {/* Navigation Bar - Minimal, persistent */}
        <div className="sticky top-0 z-40 border-b border-white/5 py-3 px-4 sm:px-8 bg-stone-950/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs">
            <Link
              to="/memorials"
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to Directory</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsQrModalOpen(true)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors border border-white/5"
                title="View &amp; Print Stationery QR Code"
                aria-label="Download QR code"
              >
                <QrCode className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors border border-white/5"
                title="Share Sanctuary Link"
                aria-label="Share memorial"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* =============== EMOTIONAL JOURNEY: ARRIVAL =============== */}
        {/* 1. ARRIVAL SECTION - Portrait, Name, Dates, Memorial Line (Minimal Controls) */}
        <section className={`relative flex min-h-[100svh] items-center overflow-hidden px-4 pb-20 pt-28 text-center sm:pt-32 ${theme.heroGradient}`}>
          <img src={backgroundImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" referrerPolicy="no-referrer" />
          <div className={`absolute inset-0 ${memorial.templateType === 'FEMALE' ? 'bg-gradient-to-b from-[#554a40]/35 via-[#554a40]/60 to-[#453a33]/85' : 'bg-gradient-to-b from-stone-950/45 via-stone-950/65 to-stone-950/95'}`} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(198,165,101,.16),transparent_48%)]" />
          {/* Subtle Motif Ornamentation based on template */}
          <div className="relative z-10 mx-auto w-full max-w-3xl px-2 py-5 sm:px-8">
            {/* Focal Portrait Frame with Responsive Wrap & High-Fidelity Glow */}
            <div className="relative mx-auto inline-block">
              <div
                className={`h-36 w-28 overflow-hidden border-4 sm:h-56 sm:w-44 lg:h-64 lg:w-52 ${theme.portraitShape} ${theme.portraitBorder} ${theme.portraitGlow} bg-stone-900 mx-auto shadow-[0_24px_65px_rgba(0,0,0,.45)]`}
              >
                <img
                  src={memorial.mainPhotograph}
                  alt={memorial.fullName}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-brand-gold/60 bg-brand-primary px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[.16em] text-brand-gold-light shadow-lg">In Loving Memory</span>

            </div>

            {/* Deceased Full Name (Handles Long Names with Balanced Scaling & Line-Heights) */}
            <div className="mt-8 space-y-3">
              <h1
                className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-light ${theme.headingStyle} break-words max-w-3xl mx-auto leading-tight text-white`}
              >
                {displayName}
              </h1>

              {/* Dates of Birth and Passing */}
              {hasDates && <p className="text-[11px] uppercase tracking-[.2em] text-brand-gold-light sm:text-sm">{visibleBirthDate && formatDate(visibleBirthDate)}{visibleBirthDate && visibleDeathDate ? ' — ' : ''}{visibleDeathDate && formatDate(visibleDeathDate)}</p>}
            </div>

            {/* Opening Biography Inscription */}
            {(memorial.memorialLine || memorial.biography) && <div className="mx-auto mt-4 max-w-2xl px-3"><p className="line-clamp-2 font-serif text-sm italic leading-relaxed text-white sm:text-xl">“{memorial.memorialLine || memorial.biography}”</p></div>}
            {memorial.biography && <div className="mx-auto mt-4 max-w-2xl border-t border-brand-gold/45 pt-3"><p className="mb-1 text-[10px] font-semibold uppercase tracking-[.22em] text-brand-gold-light">Who They Were</p><p className="line-clamp-2 text-xs leading-relaxed text-white/85 sm:line-clamp-4 sm:text-sm">{memorial.biography}</p></div>}
          </div>
          <a href={memorial.lifeStory ? '#life-story' : '#tributes'} className="absolute bottom-5 right-5 z-10 flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[.22em] text-white/90 sm:right-10" aria-label="Scroll to remember"><ArrowDown className="h-5 w-5 motion-safe:animate-bounce" /><span>Scroll to remember</span></a>
        </section>

        {/* 2. CONDITIONAL CEREMONY BROADCASTS (Rule #18: Disappears completely if no livestream and no recording exist) */}
        {false && hasBroadcasts && (
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
                      href={memorial!.livestreamUrl!}
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
                      href={memorial!.recordingUrl!}
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

        {/* =============== EMOTIONAL JOURNEY: RECOGNITION =============== */}
        {/* 3. RECOGNITION SECTION - Life Story inscription (Opening Hook) */}

        {/* =============== EMOTIONAL JOURNEY: STORY =============== */}
        {/* 4. EXTENDED LIFE STORY / EULOGY (Gracefully handles long multiline prose) */}
        {memorial.lifeStory && (
          <section id="life-story" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-10">
            <div className="space-y-8 rounded-[1.75rem] border border-brand-gold/35 bg-[#f4efe4] px-6 py-9 text-brand-charcoal shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:px-10 sm:py-12">
            <div className="text-center space-y-2 sm:text-left">
              <span className="block text-[11px] font-semibold uppercase tracking-widest text-brand-secondary">
                The Chronicle
              </span>
              <h2 className="font-serif text-3xl text-brand-primary sm:text-5xl">
                The Life &amp; Journey
              </h2>
              <div className="h-px w-16 bg-brand-gold sm:mx-0" />
            </div>

            <div className="space-y-7 text-base leading-8 text-brand-charcoal sm:text-lg">
              {(hasLongStory && !lifeStoryExpanded ? [storyPreview!] : storyParagraphs).map((paragraph, index) => (
                <React.Fragment key={`${index}-${paragraph.slice(0, 20)}`}>
                  <p className={index === 0 ? 'font-serif text-xl leading-9 sm:text-2xl' : ''}>{paragraph}</p>
                  {index === 0 && photos[0] && (
                    <figure className={`my-9 overflow-hidden border ${theme.subtleBoxBorder} ${memorial.templateType === 'MALE' ? 'aspect-[16/8]' : memorial.templateType === 'FEMALE' ? 'aspect-[4/3] max-w-xl mx-auto' : 'aspect-[3/2] max-w-lg mx-auto'}`}>
                      <img src={photos[0].url} alt={photos[0].caption || `A memory of ${displayName}`} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      {photos[0].caption && <figcaption className="sr-only">{photos[0].caption}</figcaption>}
                    </figure>
                  )}
                </React.Fragment>
              ))}
            </div>
            {hasLongStory && <div className="text-center"><button type="button" onClick={() => setLifeStoryExpanded(value => !value)} aria-expanded={lifeStoryExpanded} className="inline-flex min-h-11 items-center justify-center rounded-full border border-brand-gold bg-brand-primary px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-secondary">{lifeStoryExpanded ? 'Read Less' : 'Read More'}</button></div>}
            </div>
          </section>
        )}

        <div className="mx-auto grid max-w-6xl items-start gap-5 px-4 py-8 lg:grid-cols-2">

        {/* =============== EMOTIONAL JOURNEY: CONNECTION =============== */}
        {/* 5. WORDS OF REMEMBRANCE & SHARED MEMORIES (Rule #17: Displays approved memories only) */}
        {/* Connection happens here - visitors share memories, person's impact shown through others' perspectives */}
        <section className="scroll-mt-28 space-y-10 rounded-2xl border border-brand-gold/30 bg-brand-primary/95 px-5 py-10 shadow-xl lg:col-span-2" id="tributes">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-amber-300 mb-1">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-3xl text-white sm:text-4xl">
              Memories & Words of Remembrance
            </h2>
            <p className="text-xs text-stone-400 font-sans tracking-wide max-w-md mx-auto">
              Share a memory or heartfelt words of remembrance. To preserve the sanctuary's integrity, all submissions are reviewed with care before appearing publicly.
            </p>
          </div>

          {/* Tribute Submission Form */}
          <div className={`p-6 sm:p-8 rounded-2xl border ${theme.cardBorder} ${theme.cardBg} shadow-2xl max-w-2xl mx-auto`}>
            <h3 className="font-serif text-lg font-semibold text-white mb-4">
              Share a Memory
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
                  Your Memory or Words *
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
                      <span>Share Memory</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Approved Tributes Wall */}
          <div className="space-y-4 max-w-2xl mx-auto pt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6 shadow-xl shadow-black/30">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <h3 className="font-serif text-xl text-stone-900">
                Shared Memories ({memorial.tributes?.length || 0})
              </h3>
              <span className="text-[11px] text-amber-800 font-sans">
                Approved by Caretakers
              </span>
            </div>

            {(!memorial.tributes || memorial.tributes.length === 0) ? (
              <div className="text-center py-10 bg-white/80 rounded-xl border border-amber-200">
                <p className="text-sm font-serif italic text-stone-600">
                  Be the first to share a memory in honor of {memorial.fullName}.
                </p>
              </div>
            ) : (
              memorial.tributes.map((t) => (
                <div
                  key={t.id}
                  className="p-5 rounded-xl bg-white/85 border border-amber-200 space-y-2 shadow-xs transition-colors hover:border-amber-400 hover:bg-white"
                >
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="font-serif text-base font-semibold text-amber-900">
                      {t.visitorName}{t.relationship ? ` · ${t.relationship}` : ''}
                    </span>
                    <span className="text-stone-500 tabular-nums">
                      {formatDate(t.createdAt)}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-stone-800 whitespace-pre-line leading-relaxed italic">
                    "{t.message}"
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* =============== EMOTIONAL JOURNEY: REMEMBRANCE =============== */}
        {/* 6. CEREMONIAL SERVICE INFORMATION (Structured details, venue, address, notes) */}
        {hasService && (
          <section id="service-details" className={`w-full scroll-mt-28 ${hasGallery ? '' : 'lg:col-span-2 lg:mx-auto lg:max-w-3xl'}`}>
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
                  {(serviceInfoObj.title || serviceInfoObj.venue) && (
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                        Sanctuary / Venue
                      </span>
                      {serviceInfoObj.title && <h4 className="font-serif text-xl sm:text-2xl text-white mt-0.5">{serviceInfoObj.title}</h4>}
                      {serviceInfoObj.venue && <p className="mt-1 text-sm text-stone-300">{serviceInfoObj.venue}</p>}
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
                          <span>{formatDate(serviceInfoObj.date)}{serviceInfoObj.time ? ` at ${serviceInfoObj.time}` : ''}</span>
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
                  {memorial.viewingWakeInformation && (
                    <div className="pt-3 border-t border-white/10 text-sm leading-relaxed">
                      <span className="font-semibold uppercase tracking-wider text-stone-400 text-[10px] block mb-1">Viewing / Wake Information</span>
                      <p className="text-stone-300 whitespace-pre-line">{memorial.viewingWakeInformation}</p>
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

        {/* 7. REMEMBRANCE PHOTO GALLERY (Handles Large Galleries with Lightbox) */}
        {hasGallery && (
          <section id="remembrance-gallery" className={`w-full scroll-mt-28 space-y-6 rounded-2xl border border-brand-gold/30 bg-brand-primary/95 p-6 shadow-xl ${hasService ? '' : 'lg:col-span-2 lg:mx-auto lg:max-w-3xl'}`}>
            <div className="text-center space-y-2">
              <span className={`text-[11px] uppercase tracking-widest ${theme.accentColor} font-semibold block`}>
                Archival Photographs
              </span>
              <h2 className="font-serif text-2xl text-white sm:text-4xl">
                Remembrance Gallery
              </h2>
              <p className="text-xs text-stone-400 font-sans tracking-wider">
                {photos.length + videos.length} {photos.length + videos.length === 1 ? 'memory' : 'memories'} preserved in honour of {displayName}
              </p>
              <div className={`w-12 h-px ${theme.dividerColor} mx-auto`} />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {photos.map((img, idx) => (
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
            {videos.length > 0 && (
              <div className="grid grid-cols-1 gap-5 pt-4 md:grid-cols-2">
                {videos.map((video) => <figure key={video.id} className={`overflow-hidden border ${theme.cardBorder} ${theme.cardBg}`}><video src={video.url} controls preload="metadata" className="aspect-video w-full bg-black object-contain" />{video.caption && <figcaption className="p-3 text-sm text-stone-300">{video.caption}</figcaption>}</figure>)}
              </div>
            )}
          </section>
        )}

        {hasBroadcasts && (
          <section id="memorial-broadcast" className="w-full scroll-mt-28 lg:col-span-2">
            <div className={`space-y-5 rounded-2xl border p-6 shadow-xl sm:p-8 ${theme.cardBorder} ${theme.cardBg}`}>
              <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs uppercase tracking-widest text-stone-200"><Video className="h-4 w-4 text-brand-gold" /><span>Livestream &amp; Recording</span></div>
              <div className={`grid gap-4 ${hasLivestream && hasRecording ? 'sm:grid-cols-2' : ''}`}>
                {hasLivestream && <a href={memorial.livestreamUrl!} target="_blank" rel="noreferrer" className={`flex min-h-12 items-center justify-center gap-2 px-4 text-sm ${theme.buttonPrimary}`}><Video className="h-4 w-4" /> Join the Livestream</a>}
                {hasRecording && <a href={memorial.recordingUrl!} target="_blank" rel="noreferrer" className={`flex min-h-12 items-center justify-center gap-2 px-4 text-sm ${theme.buttonSecondary}`}><Play className="h-4 w-4" /> Watch the Recording</a>}
              </div>
            </div>
          </section>
        )}

        </div>

        {/* =============== EMOTIONAL JOURNEY: REFLECTION =============== */}
        {/* 8. CLOSING REFLECTION - Intentional End */}
        {/* Family Acknowledgement Section */}
        {memorial.familyAcknowledgement && (
          <section className="max-w-3xl mx-auto px-4 py-10">
            <div className={`p-8 sm:p-10 rounded-2xl border text-center space-y-3 relative overflow-hidden shadow-xl ${memorial.templateType === 'FEMALE' ? 'bg-brand-gold-light/20 border-brand-gold/35' : 'bg-white/4 border-white/10'}`}>
              <Heart className="w-6 h-6 text-rose-300 mx-auto opacity-80" />
              <h3 className={`font-sans text-xs uppercase tracking-widest font-semibold ${memorial.templateType === 'FEMALE' ? 'text-brand-secondary' : 'text-stone-400'}`}>
                Words of Gratitude from the Family
              </h3>
              <p className={`font-serif italic text-base sm:text-lg leading-relaxed max-w-xl mx-auto ${memorial.templateType === 'FEMALE' ? 'text-brand-charcoal' : 'text-stone-200/90'}`}>
                "{memorial.familyAcknowledgement}"
              </p>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-3xl px-4 pb-20 pt-10 text-center">
          <div className={`border-t ${theme.dividerColor} pt-12`}>
            <img src={memorial.mainPhotograph} alt="" className={`mx-auto h-24 w-24 object-cover ${theme.portraitShape} ${theme.portraitGlow}`} referrerPolicy="no-referrer" />
            {memorial.closingWords && <p className={`mx-auto mt-7 max-w-xl font-serif text-2xl italic leading-relaxed ${theme.headingColor}`}>“{memorial.closingWords}”</p>}
            <h2 className={`mt-6 font-serif text-2xl ${theme.headingColor}`}>{displayName}</h2>
            {hasDates && <p className={`mt-2 text-xs tracking-widest ${theme.mutedTextColor}`}>{visibleBirthDate && formatDate(visibleBirthDate)}{visibleBirthDate && visibleDeathDate ? ' — ' : ''}{visibleDeathDate && formatDate(visibleDeathDate)}</p>}
          </div>
        </section>

        {/* 9. GALLERY LIGHTBOX MODAL */}
        {lightboxIndex !== null && photos.length > 0 && (
          <MemorialGalleryLightbox
            media={photos}
            currentIndex={lightboxIndex}
            isOpen={lightboxIndex !== null}
            onClose={() => setLightboxIndex(null)}
            onNavigate={(newIndex) => setLightboxIndex(newIndex)}
          />
        )}

        {/* 10. SOCIAL SHARING MODAL */}
        <MemorialSocialShareModal
          memorial={memorial}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          onOpenQr={() => setIsQrModalOpen(true)}
        />

        {/* 11. PHYSICAL MEMORIAL QR MODAL (Lossless Vector SVG & 300+ DPI PNG) */}
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
