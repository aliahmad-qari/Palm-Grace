import React, { useState } from 'react';
import { X, QrCode, Download, ExternalLink, Printer, Check, Copy, Eye } from 'lucide-react';
import { Memorial } from '../../types/index.js';
import { apiUrl, getCanonicalMemorialUrl } from '../../lib/api.js';

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char]!);
}

interface AdminMemorialQrModalProps {
  memorial: Memorial | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminMemorialQrModal: React.FC<AdminMemorialQrModalProps> = ({
  memorial,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !memorial) return null;

  const publicUrl = getCanonicalMemorialUrl(memorial.slug);
  const isPublished = memorial.publicationStatus === 'PUBLISHED';
  const qrSvgUrl = apiUrl(`/api/admin/memorials/${memorial.id}/qr?format=svg&download=1`);
  const qrPngUrl = apiUrl(`/api/admin/memorials/${memorial.id}/qr?format=png&download=1`);
  const qrPreviewSrc = apiUrl(`/api/admin/memorials/${memorial.id}/qr?format=png`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
    } catch {
      if (window.prompt('Copy this memorial link:', publicUrl) === null) return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const escapedName = escapeHtml(memorial.fullName);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Palm & Grace Memorial QR — ${escapedName}</title>
          <style>
            @page { size: auto; margin: 20mm; }
            body {
              font-family: Georgia, serif;
              text-align: center;
              color: #1e293b;
              margin: 0;
              padding: 40px 20px;
            }
            .brand {
              font-size: 14px;
              letter-spacing: 4px;
              text-transform: uppercase;
              color: #78716c;
              margin-bottom: 24px;
            }
            .name {
              font-size: 28px;
              font-weight: normal;
              margin: 0 0 8px 0;
            }
            .lifespan {
              font-family: sans-serif;
              font-size: 13px;
              color: #78716c;
              letter-spacing: 2px;
              margin-bottom: 32px;
            }
            .qr-frame {
              display: inline-block;
              padding: 16px;
              border: 1px solid #e7e5e4;
              border-radius: 12px;
              margin-bottom: 24px;
            }
            .qr-img {
              width: 240px;
              height: 240px;
              display: block;
            }
            .instructions {
              font-family: sans-serif;
              font-size: 12px;
              color: #57534e;
              max-width: 320px;
              margin: 0 auto;
              line-height: 1.5;
            }
            .slug {
              font-family: monospace;
              font-size: 11px;
              color: #a8a29e;
              margin-top: 16px;
            }
          </style>
        </head>
        <body>
          <div class="brand">PALM &amp; GRACE — MEMORIAL</div>
          <h1 class="name">${escapedName}</h1>
          <div class="lifespan">IN LOVING MEMORY</div>
          <div class="qr-frame">
            <img src="${qrPreviewSrc}" class="qr-img" alt="QR Code" />
          </div>
          <div class="instructions">
            Scan with any smartphone camera to visit the memorial, read their story, view photographs and share a memory.
          </div>
          <div class="slug">${publicUrl}</div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-2 font-sans backdrop-blur-xs sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="memorial-qr-title"
        className="flex max-h-[calc(100dvh-1rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-2 border-b border-stone-100 bg-stone-50/60 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-start gap-2 text-stone-900">
            <div className="p-1.5 rounded-lg bg-stone-900 text-amber-300">
              <QrCode className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 id="memorial-qr-title" className="font-serif text-base font-semibold leading-snug text-stone-900 sm:text-lg">
                Memorial Physical QR Bridge
              </h3>
              <p className="text-[11px] text-stone-500 font-sans -mt-0.5">
                Lossless assets ready for stationery, bookmarks, and engraved bronze plaques
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close QR code dialog"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="min-h-0 space-y-5 overflow-y-auto overscroll-contain p-4 sm:space-y-6 sm:p-6">
          {/* Target Memorial Card Header */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80">
            <img
              src={memorial.mainPhotograph}
              alt={memorial.fullName}
              className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-serif text-base font-semibold text-stone-900 truncate">
                {memorial.fullName}
              </h4>
              <div className="flex min-w-0 items-center gap-2 font-mono text-xs text-stone-500">
                <span className="min-w-0 truncate">/{memorial.slug}</span>
                <span className="shrink-0 rounded-md bg-stone-200 px-2 py-0.5 font-sans text-[10px] font-medium uppercase text-stone-700">
                  {memorial.publicationStatus}
                </span>
              </div>
            </div>
            {isPublished && <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/70 transition-colors"
              title="Open public memorial page"
            >
              <ExternalLink className="w-4 h-4" />
            </a>}
          </div>

          {!isPublished && <p className="rounded-lg border border-brand-gold/50 bg-brand-gold-light/25 px-4 py-3 text-xs leading-5 text-brand-primary">This memorial is {memorial.publicationStatus.toLowerCase().replace('_', ' ')}. Its QR and link can be prepared now; the public page will open after publication.</p>}

          {/* QR Code Presentation Box */}
          <div className="text-center space-y-2">
            <div className="p-4 bg-white rounded-2xl border-2 border-stone-200 shadow-sm inline-block">
              <img
                src={qrPreviewSrc}
                alt={`${memorial.fullName} QR Code`}
                className="mx-auto h-40 w-40 sm:h-48 sm:w-48"
              />
            </div>
            <p className="text-xs text-stone-500">
              Encodes canonical production URL with high fault tolerance (Level M).
            </p>
          </div>

          {/* Direct Link Copy */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
              Memorial Canonical Destination
            </label>
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl p-1.5 pr-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                aria-label="Memorial public URL"
                className="min-w-0 flex-1 truncate bg-transparent px-2.5 font-mono text-xs text-stone-700 focus:outline-hidden"
              />
              <button
                onClick={handleCopyLink}
                className={`flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-800 hover:bg-stone-900 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Physical Print Specifications */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">Format</span>
              <span className="font-medium text-stone-800">SVG &amp; PNG</span>
            </div>
            <div className="border-x border-stone-200">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">Resolution</span>
              <span className="font-medium text-stone-800">300+ DPI / Vector</span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">Application</span>
              <span className="font-medium text-stone-800">Plaques / Booklets</span>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-stone-100 bg-stone-50 px-4 py-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:px-6 sm:py-4">
          <button
            onClick={handlePrint}
            className="col-span-2 flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-xs font-semibold text-stone-800 shadow-xs transition-colors hover:bg-stone-100 sm:col-span-1"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Print Sheet</span>
          </button>

          <div className="col-span-2 grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <a
              href={qrSvgUrl}
              className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-stone-200 bg-stone-100 px-2 py-2 text-xs font-semibold text-stone-800 transition-colors hover:bg-stone-200 sm:px-3.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Vector SVG</span>
            </a>

            <a
              href={qrPngUrl}
              className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-stone-900 px-2 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-stone-800 sm:px-4"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>300 DPI PNG</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
