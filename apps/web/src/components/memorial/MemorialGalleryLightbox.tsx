import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { MemorialMedia } from '../../types/index.js';

interface MemorialGalleryLightboxProps {
  media: MemorialMedia[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const MemorialGalleryLightbox: React.FC<MemorialGalleryLightboxProps> = ({
  media,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) onNavigate(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < media.length - 1) onNavigate(currentIndex + 1);
      } else if (e.key === 'Tab') {
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not([disabled])') || []);
        if (!controls.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); previouslyFocused?.focus(); };
  }, [isOpen, currentIndex, media.length, onClose, onNavigate]);

  if (!isOpen || media.length === 0) return null;

  const currentPhoto = media[currentIndex] || media[0];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < media.length - 1;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Memorial photo gallery"
      className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with Counter & Close */}
        <div className="w-full flex items-center justify-between pb-3 text-stone-300 font-sans text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono tabular-nums text-stone-200">
              Photograph {currentIndex + 1} of {media.length}
            </span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-lg bg-stone-900/80 text-stone-300 transition-colors hover:bg-stone-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Display */}
        <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-xl bg-stone-900/60 border border-white/10 shadow-2xl">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption || `Memorial remembrance photo ${currentIndex + 1}`}
            className="max-h-[75vh] w-auto max-w-full object-contain"
            referrerPolicy="no-referrer"
          />

          {/* Previous Arrow */}
          {hasPrevious && (
            <button
              type="button"
              onClick={() => onNavigate(currentIndex - 1)}
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-stone-900/80 text-white shadow-lg transition-colors hover:bg-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Arrow */}
          {hasNext && (
            <button
              type="button"
              onClick={() => onNavigate(currentIndex + 1)}
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-stone-900/80 text-white shadow-lg transition-colors hover:bg-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold"
              aria-label="Next photograph"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Caption */}
        {currentPhoto.caption && (
          <div className="mt-3 px-4 py-2 rounded-lg bg-stone-900/90 border border-white/10 text-center max-w-2xl">
            <p className="font-serif italic text-sm text-stone-200 leading-relaxed">
              "{currentPhoto.caption}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
