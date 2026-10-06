import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Mail,
  QrCode,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { Memorial } from '../../types/index.js';
import { getCanonicalMemorialUrl } from '../../lib/api.js';

interface MemorialSocialShareModalProps {
  memorial: Memorial;
  isOpen: boolean;
  onClose: () => void;
  onOpenQr: () => void;
}

export const MemorialSocialShareModal: React.FC<MemorialSocialShareModalProps> = ({
  memorial,
  isOpen,
  onClose,
  onOpenQr,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? getCanonicalMemorialUrl(memorial.slug) : '';
  const shareTitle = `In Loving Memory of ${memorial.fullName}`;
  const shareText = `Please join us in honouring and remembering ${memorial.fullName} with Palm & Grace.`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      if (window.prompt('Copy this memorial link:', currentUrl) !== null) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl,
        });
      } catch (err) {
        if (!(err instanceof DOMException && err.name === 'AbortError')) {
          await handleCopyLink();
        }
      }
    }
  };

  const hasNativeShare = typeof navigator !== 'undefined' && Boolean(navigator.share);

  // Social URLs
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(`${shareText}\n\n${currentUrl}`);
  const encodedSubject = encodeURIComponent(shareTitle);
  const encodedBody = encodeURIComponent(
    `Dear friends and family,\n\nA memorial has been created to honour and remember ${memorial.fullName}.\n\nYou are warmly invited to visit, view photographs, read the story of their life, and share a memory:\n\n${currentUrl}\n\nWith warmth,\nPalm & Grace`
  );

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const mailtoUrl = `mailto:?subject=${encodedSubject}&body=${encodedBody}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none"
      onClick={onClose}
    >
      <div
        className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-6 text-stone-100 shadow-2xl relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-stone-800">
          <div className="flex items-center gap-2 text-amber-300">
            <Share2 className="w-5 h-5" />
            <h3 className="font-serif text-xl text-white font-semibold">
              Share Memorial
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed font-sans">
          Share this memorial link with family and friends to remember {memorial.fullName} together.
        </p>

        {/* Copy Link Input Bar */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
            Memorial Link
          </label>
          <div className="flex items-center gap-2 bg-stone-950 border border-stone-700/80 rounded-xl p-1.5 pr-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-transparent px-2.5 text-xs text-stone-300 font-mono focus:outline-hidden truncate"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-500 text-stone-950'
                  : 'bg-amber-400 hover:bg-amber-300 text-stone-950'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Share Buttons Grid */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
            Share Directly Via
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {hasNativeShare && (
              <button
                onClick={handleNativeShare}
                className="col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-white border border-stone-700 transition-colors font-medium"
              >
                <Share2 className="w-4 h-4 text-amber-300" />
                <span>Open Device Share Menu</span>
              </button>
            )}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-800/60 transition-colors font-medium"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>

            <a
              href={mailtoUrl}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 transition-colors font-medium"
            >
              <Mail className="w-4 h-4 text-amber-300" />
              <span>Email Family</span>
            </a>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 text-sky-200 border border-sky-800/60 transition-colors font-medium"
            >
              <span>Facebook</span>
              <ExternalLink className="w-3 h-3 text-sky-400" />
            </a>

            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 transition-colors font-medium"
            >
              <span>X (Twitter)</span>
              <ExternalLink className="w-3 h-3 text-stone-400" />
            </a>
          </div>
        </div>

        {/* QR Access Link */}
        <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>Need funeral stationery cards or plaques?</span>
          <button
            onClick={() => {
              onClose();
              onOpenQr();
            }}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
          >
            <QrCode className="w-4 h-4" />
            <span>Stationery QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
