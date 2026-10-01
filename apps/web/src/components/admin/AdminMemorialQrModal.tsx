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
          <div class="brand">PALM &amp; GRACE — DIGITAL SANCTUARY</div>
          <h1 class="name">${escapedName}</h1>
          <div class="lifespan">IN LOVING MEMORY</div>
          <div class="qr-frame">
            <img src="${qrPreviewSrc}" class="qr-img" alt="QR Code" />
          </div>
          <div class="instructions">
            Scan with any smartphone camera to visit the digital memorial sanctuary, read eulogies, view photographs, and leave a tribute.
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
      className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-2 text-stone-900">
            <div className="p-1.5 rounded-lg bg-stone-900 text-amber-300">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Memorial Physical QR Bridge
              </h3>
              <p className="text-[11px] text-stone-500 font-sans -mt-0.5">
                Lossless assets ready for stationery, bookmarks, and engraved bronze plaques
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
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
              <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                <span>/{memorial.slug}</span>
                <span className="text-[10px] uppercase font-sans font-medium px-2 py-0.5 rounded-md bg-stone-200 text-stone-700">
                  {memorial.publicationStatus}
                </span>
              </div>
            </div>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200/70 transition-colors"
              title="Open public memorial page"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* QR Code Presentation Box */}
          <div className="text-center space-y-2">
            <div className="p-4 bg-white rounded-2xl border-2 border-stone-200 shadow-sm inline-block">
              <img
                src={qrPreviewSrc}
                alt={`${memorial.fullName} QR Code`}
                className="w-48 h-48 mx-auto"
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
                className="flex-1 bg-transparent px-2.5 text-xs text-stone-700 font-mono focus:outline-hidden truncate"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
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
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg border border-stone-200 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>Print Sheet</span>
          </button>

          <div className="flex items-center gap-2">
            <a
              href={qrSvgUrl}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-200 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Vector SVG</span>
            </a>

            <a
              href={qrPngUrl}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
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
