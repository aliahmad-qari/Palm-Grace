import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2, Link2 } from 'lucide-react';
import { api } from '../../lib/api.js';

interface CloudinaryUploaderProps {
  onUploadSuccess: (result: { url: string; publicId?: string }) => void;
  currentImageUrl?: string;
  label?: string;
  hint?: string;
  maxSizeMB?: number;
  aspectRatioLabel?: string;
}

export const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  onUploadSuccess,
  currentImageUrl,
  label = 'Upload Image',
  hint = 'Supports JPG, PNG, WEBP up to 8MB',
  maxSizeMB = 8,
  aspectRatioLabel = 'Recommended 3:4 or 1:1 portrait'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isManualUrlOpen, setIsManualUrlOpen] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // File type validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Only JPG, PNG, and WEBP images are supported.';
    }

    // Reasonable file size validation (default 8MB)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File exceeds maximum limit of ${maxSizeMB}MB. Please compress or choose a smaller image.`;
    }

    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMsg(validationError);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);

    try {
      // 1. Request secure signature from backend
      const sigRes = await api.getUploadSignature();
      if (!sigRes.success || !sigRes.data) {
        throw new Error(sigRes.error || 'Failed to authenticate upload signature with server');
      }

      const { cloudName, apiKey, timestamp, folder, signature } = sigRes.data;

      // In development mode or if demo credentials
      if (sigRes.mode === 'mock' || apiKey === 'demo-key' || !cloudName || cloudName === 'demo') {
        // Read as data URL for seamless local preview and simulated persistent storage
        const reader = new FileReader();
        reader.onload = () => {
          const resultUrl = reader.result as string;
          setPreviewUrl(resultUrl);
          setIsUploading(false);
          onUploadSuccess({
            url: resultUrl,
            publicId: `local-upload-${Date.now()}`,
          });
        };
        reader.readAsDataURL(file);
        return;
      }

      // 2. Direct upload to Cloudinary (API secret is never present on client)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!cloudinaryRes.ok) {
        const errJson = await cloudinaryRes.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Cloudinary upload failed with status ${cloudinaryRes.status}`);
      }

      const uploadData = await cloudinaryRes.json();
      setPreviewUrl(uploadData.secure_url);
      onUploadSuccess({
        url: uploadData.secure_url,
        publicId: uploadData.public_id,
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      setErrorMsg(err.message || 'Image upload failed. You can also provide a direct HTTPS image URL below.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrlInput.trim()) return;

    try {
      new URL(manualUrlInput.trim());
      setPreviewUrl(manualUrlInput.trim());
      setErrorMsg(null);
      setIsManualUrlOpen(false);
      onUploadSuccess({ url: manualUrlInput.trim() });
    } catch {
      setErrorMsg('Please enter a valid HTTP or HTTPS image URL');
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onUploadSuccess({ url: '' });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setIsManualUrlOpen(!isManualUrlOpen)}
          className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 transition-colors"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>{isManualUrlOpen ? 'Choose File' : 'Paste Direct URL'}</span>
        </button>
      </div>

      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden border border-stone-200 bg-stone-100 group max-w-sm">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover transition-opacity duration-200"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-stone-900 text-xs font-medium rounded-md shadow-xs hover:bg-stone-50 transition-colors"
            >
              Replace Photo
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
              title="Remove Photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 bg-stone-900/80 text-white text-[11px] px-2 py-0.5 rounded-sm flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Ready</span>
          </div>
        </div>
      ) : isManualUrlOpen ? (
        <form onSubmit={handleManualUrlSubmit} className="flex gap-2">
          <input
            type="url"
            value={manualUrlInput}
            onChange={(e) => setManualUrlInput(e.target.value)}
            placeholder="https://example.com/portrait.jpg"
            className="flex-1 px-3 py-2 text-sm border border-stone-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-stone-800 text-white text-xs font-medium rounded-md hover:bg-stone-900 transition-colors shrink-0"
          >
            Apply URL
          </button>
        </form>
      ) : (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isUploading
              ? 'border-stone-400 bg-stone-50 cursor-wait'
              : 'border-stone-300 hover:border-stone-500 bg-stone-50/50 hover:bg-stone-50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-stone-600 animate-spin" />
              <span className="text-xs font-medium text-stone-600">Uploading photograph to Cloudinary...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-600">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-800">
                  Click to select photo or drag and drop
                </p>
                <p className="text-xs text-stone-500 mt-0.5">{hint} · {aspectRatioLabel}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error Message Display */}
      {errorMsg && (
        <div className="flex items-start gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
