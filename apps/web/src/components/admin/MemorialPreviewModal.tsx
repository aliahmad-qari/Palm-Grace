import React from 'react';
import { formatCalendarDate } from '../../lib/calendarDate.js';
import { X, Calendar, MapPin, Video, Eye, Heart, Share2, Sparkles, ExternalLink } from 'lucide-react';
import { Memorial } from '../../types/index.js';

interface MemorialPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  memorial: Partial<Memorial>;
}

export const MemorialPreviewModal: React.FC<MemorialPreviewModalProps> = ({
  isOpen,
  onClose,
  memorial,
}) => {
  if (!isOpen) return null;

  const template = memorial.templateType || 'MALE';

  // Template aesthetics
  const templateStyles = {
    MALE: {
      bg: 'bg-slate-900',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      cardBg: 'bg-slate-800/80 border-slate-700',
      accentColor: 'text-amber-300',
      tagBg: 'bg-slate-800 text-amber-200 border-slate-700',
      fontHeading: 'font-serif',
      badge: 'Classic Dignity (Male)',
    },
    FEMALE: {
      bg: 'bg-stone-900',
      textPrimary: 'text-stone-100',
      textSecondary: 'text-stone-300',
      cardBg: 'bg-stone-800/80 border-stone-700',
      accentColor: 'text-rose-200',
      tagBg: 'bg-stone-800 text-rose-200 border-stone-700',
      fontHeading: 'font-serif',
      badge: 'Grace & Warmth (Female)',
    },
    CHILD: {
      bg: 'bg-sky-950',
      textPrimary: 'text-sky-50',
      textSecondary: 'text-sky-200',
      cardBg: 'bg-sky-900/60 border-sky-800',
      accentColor: 'text-amber-200',
      tagBg: 'bg-sky-900 text-amber-200 border-sky-800',
      fontHeading: 'font-serif',
      badge: 'Gentle Wonder (Child)',
    },
  }[template];

  const formatDate = formatCalendarDate;
  const displayName = memorial.preferredDisplayName || memorial.fullName || 'Full Name';
  const birthDate = memorial.showBirthDate === false ? null : memorial.birthDate || memorial.dateOfBirth;
  const deathDate = memorial.showDeathDate === false ? null : memorial.deathDate || memorial.dateOfPassing;
  const showBiography = Boolean(memorial.biography?.trim() && memorial.biography.trim().replace(/[“”"'\s.]/g, '').toLowerCase() !== memorial.memorialLine?.trim().replace(/[“”"'\s.]/g, '').toLowerCase());

  let serviceInfoObj: { venue?: string; date?: string; address?: string; reception?: string } | null = null;
  if (memorial.serviceInformation) {
    try {
      serviceInfoObj = JSON.parse(memorial.serviceInformation);
    } catch {
      // plain text fallback
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-100 border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold tracking-wider uppercase text-stone-600">
              Live Preview
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 font-medium">
              Template: {templateStyles.badge}
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              memorial.publicationStatus === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {memorial.publicationStatus === 'PUBLISHED' ? 'Published' : memorial.publicationStatus === 'PRIVATE_PREVIEW' ? 'Private Preview' : memorial.publicationStatus === 'ARCHIVED' ? 'Archived' : 'Draft'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Memorial Body */}
        <div className={`overflow-y-auto p-6 md:p-10 ${templateStyles.bg} ${templateStyles.textPrimary}`}>
          {/* Hero Section */}
          <div className="relative isolate flex flex-col items-center overflow-hidden rounded-xl p-5 text-center max-w-2xl mx-auto space-y-4 sm:p-8">
            {memorial.heroBackgroundUrl && <img src={memorial.heroBackgroundUrl} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" referrerPolicy="no-referrer" />}
            {memorial.heroBackgroundUrl && <div className="absolute inset-0 -z-10 bg-brand-primary/75" />}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-xl bg-stone-800">
              {memorial.mainPhotograph ? (
                <img
                  src={memorial.mainPhotograph}
                  alt={memorial.fullName}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: `${memorial.portraitPositionX ?? 50}% ${memorial.portraitPositionY ?? 50}%` }}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-500 text-xs">
                  No Portrait Added
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h1 className={`text-3xl sm:text-4xl ${templateStyles.fontHeading} tracking-tight`}>
                {displayName}
              </h1>
              {(birthDate || deathDate) && <p className={`text-sm ${templateStyles.textSecondary} tracking-wide`}>
                {birthDate && formatDate(birthDate)}{birthDate && deathDate ? ' — ' : ''}{deathDate && formatDate(deathDate)}
              </p>}
            </div>

            {memorial.memorialLine && <p className="font-serif text-base italic leading-relaxed text-brand-gold-light sm:text-lg">“{memorial.memorialLine}”</p>}
            {showBiography && (
              <p className={`text-base sm:text-lg italic leading-relaxed ${templateStyles.textSecondary} pt-2`}>
                {memorial.biography}
              </p>
            )}
          </div>

          {/* Conditional Livestream Section */}
          {memorial.livestreamUrl && (
            <div className={`mt-8 p-5 rounded-lg border ${templateStyles.cardBg} max-w-2xl mx-auto`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5 animate-pulse" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">Service Livestream Available</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Family and friends can join the ceremony online.</p>
                </div>
                <a
                  href={memorial.livestreamUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium rounded-md flex items-center gap-1 transition-colors"
                >
                  <span>Watch Stream</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Conditional Recording Section */}
          {memorial.recordingUrl && (
            <div className={`mt-4 p-5 rounded-lg border ${templateStyles.cardBg} max-w-2xl mx-auto`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">Service Recording Available</h3>
                  <p className="text-xs text-stone-400 mt-0.5">Recorded broadcast of the memorial ceremony.</p>
                </div>
                <a
                  href={memorial.recordingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-white text-xs font-medium rounded-md flex items-center gap-1 transition-colors"
                >
                  <span>View Recording</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Life Story Section */}
          {memorial.lifeStory && (
            <div className="mt-10 max-w-2xl mx-auto space-y-3">
              <h2 className={`text-xl ${templateStyles.fontHeading} tracking-wide border-b border-white/10 pb-2`}>
                The Life &amp; Journey
              </h2>
              <div className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${templateStyles.textSecondary}`}>
                {memorial.lifeStory}
              </div>
            </div>
          )}

          {/* Service Information */}
          {(serviceInfoObj || memorial.serviceInformation) && (
            <div className="mt-10 max-w-2xl mx-auto space-y-3">
              <h2 className={`text-xl ${templateStyles.fontHeading} tracking-wide border-b border-white/10 pb-2`}>
                Service &amp; Gathering Details
              </h2>
              <div className={`p-4 rounded-lg border ${templateStyles.cardBg} space-y-2 text-sm`}>
                {serviceInfoObj ? (
                  <>
                    {serviceInfoObj.venue && <div className="font-semibold text-white">{serviceInfoObj.venue}</div>}
                    {serviceInfoObj.date && <div className="flex items-center gap-2 text-stone-300"><Calendar className="w-4 h-4 text-amber-400" /> {formatDate(serviceInfoObj.date)}</div>}
                    {serviceInfoObj.address && <div className="flex items-center gap-2 text-stone-300"><MapPin className="w-4 h-4 text-amber-400" /> {serviceInfoObj.address}</div>}
                    {serviceInfoObj.reception && <div className="text-xs text-stone-400 pt-2 border-t border-white/10">{serviceInfoObj.reception}</div>}
                  </>
                ) : (
                  <p className="whitespace-pre-line text-stone-300">{memorial.serviceInformation}</p>
                )}
              </div>
            </div>
          )}

          {/* Photo Gallery Grid */}
          {memorial.media && memorial.media.length > 0 && (
            <div className="mt-10 max-w-3xl mx-auto space-y-3">
              <h2 className={`text-xl ${templateStyles.fontHeading} tracking-wide border-b border-white/10 pb-2`}>
                Remembrance Gallery ({memorial.media.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {memorial.media.map((img) => (
                  <div key={img.id} className="relative aspect-4/3 rounded-lg overflow-hidden bg-stone-800 border border-white/10">
                    <img
                      src={img.url}
                      alt={img.caption || 'Memorial Photo'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-stone-900/80 px-2 py-1 text-[11px] text-stone-300 truncate">
                        {img.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Family Acknowledgement */}
          {memorial.familyAcknowledgement && (
            <div className="mt-10 max-w-2xl mx-auto text-center space-y-2 p-6 rounded-lg bg-white/5 border border-white/10">
              <Heart className="w-5 h-5 mx-auto text-rose-300 opacity-80" />
              <h3 className="text-xs uppercase tracking-widest text-stone-400">Words of Gratitude</h3>
              <p className={`text-sm italic leading-relaxed ${templateStyles.textSecondary}`}>
                "{memorial.familyAcknowledgement}"
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>This is an administrative preview simulating visitor view.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white rounded-md transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
