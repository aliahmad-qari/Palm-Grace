import React, { useEffect, useState } from 'react';
import {
  Images,
  Upload,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowUpDown,
  Scroll,
  Info
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../lib/api.js';
import { Memorial, MemorialMedia } from '../../types/index.js';
import { CloudinaryUploader } from '../../components/admin/CloudinaryUploader.js';

export const AdminMediaPage: React.FC = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [selectedMemorialId, setSelectedMemorialId] = useState<string>('');
  const [selectedMemorial, setSelectedMemorial] = useState<Memorial | null>(null);
  const [cloudinaryConfig, setCloudinaryConfig] = useState<{
    cloudName: string;
    isConfigured: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [mRes, cRes] = await Promise.all([
        api.getAdminMemorials(),
        api.getMediaConfig(),
      ]);

      if (mRes.success && mRes.data && mRes.data.length > 0) {
        setMemorials(mRes.data);
        setSelectedMemorialId(mRes.data[0].id);
        loadMemorialDetails(mRes.data[0].id);
      }

      if (cRes.success && cRes.data) {
        setCloudinaryConfig(cRes.data);
      }
    } catch (err) {
      console.error('Error loading media data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMemorialDetails = async (id: string) => {
    try {
      const res = await api.getAdminMemorial(id);
      if (res.success && res.data) {
        setSelectedMemorial(res.data);
      }
    } catch (err) {
      console.error('Error loading memorial details:', err);
    }
  };

  const handleMemorialChange = (id: string) => {
    setSelectedMemorialId(id);
    loadMemorialDetails(id);
  };

  const handleUploadSuccess = async ({ url, publicId }: { url: string; publicId?: string }) => {
    if (!selectedMemorialId || !url) return;

    try {
      const res = await api.addMedia({
        memorialId: selectedMemorialId,
        url,
        cloudinaryPublicId: publicId || null,
        sortOrder: (selectedMemorial?.media?.length || 0),
      });

      if (res.success) {
        setFeedbackMsg({ type: 'success', text: 'Photograph added to memorial gallery' });
        setIsUploadOpen(false);
        loadMemorialDetails(selectedMemorialId);
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to add media' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error adding media' });
    }
  };

  const handleDeleteMedia = async (photoId: string) => {
    if (!confirm('Are you sure you want to remove this photograph from the gallery?')) return;

    try {
      const res = await api.deleteMedia(photoId);
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: 'Photograph removed from gallery' });
        if (selectedMemorialId) loadMemorialDetails(selectedMemorialId);
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to delete photo' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error deleting photo' });
    }
  };

  const movePhoto = async (index: number, direction: 'up' | 'down') => {
    if (!selectedMemorial?.media) return;
    const items = [...selectedMemorial.media];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= items.length) return;

    // Swap items
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    const reorderPayload = items.map((item, idx) => ({
      id: item.id,
      sortOrder: idx,
    }));

    try {
      const res = await api.reorderMedia(selectedMemorialId, reorderPayload);
      if (res.success) {
        loadMemorialDetails(selectedMemorialId);
      }
    } catch (err) {
      console.error('Error reordering photos:', err);
    }
  };

  return (
    <AdminLayout
      title="Media &amp; Gallery Library"
      subtitle="Manage portraits, multi-photo galleries, and Cloudinary media assets"
      breadcrumbs={[{ label: 'Media' }]}
    >
      {/* Feedback Toast */}
      {feedbackMsg && (
        <div
          className={`mb-5 p-3 rounded-lg flex items-center justify-between text-xs ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button onClick={() => setFeedbackMsg(null)} className="text-stone-400 hover:text-stone-600">×</button>
        </div>
      )}

      {/* Cloudinary Integration Status Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700 shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900">
              Cloudinary Storage Infrastructure
            </h3>
            <p className="text-xs text-stone-500">
              Folder: <code className="bg-stone-100 px-1 py-0.5 rounded-sm text-stone-800">palm-and-grace/memorials</code> ·
              Cloud: <span className="font-medium text-stone-700">{cloudinaryConfig?.cloudName || 'Configured via Server'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Secure Signed Mode</span>
          </span>
          <span className="text-[11px] text-stone-400">Secret never sent to client</span>
        </div>
      </div>

      {/* Memorial Selector Bar */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs mb-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Select Memorial To Manage Gallery
            </label>
            <select
              value={selectedMemorialId}
              onChange={(e) => handleMemorialChange(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800 cursor-pointer"
            >
              {memorials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.templateType} · {m.publicationStatus})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setIsUploadOpen(!isUploadOpen)}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>{isUploadOpen ? 'Close Uploader' : 'Upload Photos'}</span>
            </button>
          </div>
        </div>

        {/* Upload Container */}
        {isUploadOpen && (
          <div className="mt-5 pt-5 border-t border-stone-200">
            <CloudinaryUploader
              label={`Upload Photo to ${selectedMemorial?.fullName || 'Gallery'}`}
              hint="Images are uploaded securely via signed Cloudinary parameters."
              onUploadSuccess={handleUploadSuccess}
            />
          </div>
        )}
      </div>

      {/* Active Memorial Gallery Content */}
      {selectedMemorial && (
        <div className="space-y-6 font-sans">
          {/* Main Portrait Section */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800 mb-4">
              Main Memorial Portrait
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="w-32 h-32 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shrink-0 shadow-xs">
                <img
                  src={selectedMemorial.mainPhotograph}
                  alt={selectedMemorial.fullName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-1 text-xs text-stone-600">
                <div className="font-medium text-sm text-stone-900">{selectedMemorial.fullName}</div>
                <div>URL Slug: <code className="bg-stone-100 px-1 py-0.5 rounded-sm">/memorial/{selectedMemorial.slug}</code></div>
                <div>Status: <span className="font-semibold text-emerald-700">{selectedMemorial.publicationStatus}</span></div>
                <p className="text-stone-400 pt-1">
                  To replace the main portrait, edit the memorial from the Memorials tab.
                </p>
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-800">
                  Remembrance Gallery Photos ({selectedMemorial.media?.length || 0})
                </h3>
                <p className="text-xs text-stone-500">
                  Drag or use arrows to organize display order on the public remembrance page.
                </p>
              </div>
            </div>

            {(!selectedMemorial.media || selectedMemorial.media.length === 0) ? (
              <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50">
                <Images className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-xs text-stone-600 font-medium">No gallery photographs added yet</p>
                <p className="text-xs text-stone-400 mt-0.5">Click "Upload Photos" above to add pictures to this memorial.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedMemorial.media.map((photo, idx) => (
                  <div
                    key={photo.id}
                    className="relative group rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-xs flex flex-col justify-between"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-stone-200">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Memorial Photo'}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-sm bg-stone-900/80 text-white text-[11px] font-mono tabular-nums">
                        #{idx + 1}
                      </div>
                    </div>

                    <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between text-xs">
                      <span className="text-stone-500 truncate max-w-[120px]">
                        {photo.caption || `Photo ${idx + 1}`}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => movePhoto(idx, 'up')}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-sm disabled:opacity-30 text-[11px]"
                          title="Move Left / Earlier"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          disabled={idx === (selectedMemorial.media?.length || 0) - 1}
                          onClick={() => movePhoto(idx, 'down')}
                          className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-sm disabled:opacity-30 text-[11px]"
                          title="Move Right / Later"
                        >
                          →
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(photo.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded-sm hover:bg-rose-50"
                          title="Delete photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
