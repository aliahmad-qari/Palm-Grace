import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  Eye,
  ArrowLeft,
  Calendar,
  Sparkles,
  Video,
  FileText,
  MapPin,
  Heart,
  Images,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Globe,
  Lock,
  Plus
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../lib/api.js';
import { Memorial, MemorialMedia, TemplateType, PublicationStatus } from '../../types/index.js';
import { CloudinaryUploader } from '../../components/admin/CloudinaryUploader.js';
import { MemorialPreviewModal } from '../../components/admin/MemorialPreviewModal.js';

export const AdminMemorialEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState('');
  const [slug, setSlug] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [dateOfPassing, setDateOfPassing] = useState('');
  const [biography, setBiography] = useState('');
  const [lifeStory, setLifeStory] = useState('');
  const [mainPhotograph, setMainPhotograph] = useState('');
  const [templateType, setTemplateType] = useState<TemplateType>('MALE');
  const [publicationStatus, setPublicationStatus] = useState<PublicationStatus>('DRAFT');

  // Service Information
  const [serviceVenue, setServiceVenue] = useState('');
  const [serviceDate, setServiceDate] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [serviceReception, setServiceReception] = useState('');

  // Acknowledgements
  const [familyAcknowledgement, setFamilyAcknowledgement] = useState('');

  // Media / Streaming
  const [livestreamUrl, setLivestreamUrl] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');

  // Gallery
  const [gallery, setGallery] = useState<MemorialMedia[]>([]);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Load existing memorial if editing
  useEffect(() => {
    if (isEditing && id) {
      loadMemorial(id);
    }
  }, [id, isEditing]);

  const loadMemorial = async (memorialId: string) => {
    setIsLoading(true);
    try {
      const res = await api.getAdminMemorial(memorialId);
      if (res.success && res.data) {
        const m = res.data;
        setFullName(m.fullName);
        setSlug(m.slug);
        setDateOfBirth(m.dateOfBirth ? m.dateOfBirth.slice(0, 10) : '');
        setDateOfPassing(m.dateOfPassing ? m.dateOfPassing.slice(0, 10) : '');
        setBiography(m.biography);
        setLifeStory(m.lifeStory || '');
        setMainPhotograph(m.mainPhotograph);
        setTemplateType(m.templateType);
        setPublicationStatus(m.publicationStatus);
        setFamilyAcknowledgement(m.familyAcknowledgement || '');
        setLivestreamUrl(m.livestreamUrl || '');
        setRecordingUrl(m.recordingUrl || '');
        setGallery(m.media || []);

        if (m.serviceInformation) {
          try {
            const parsed = JSON.parse(m.serviceInformation);
            setServiceVenue(parsed.venue || '');
            setServiceDate(parsed.date ? parsed.date.slice(0, 16) : '');
            setServiceAddress(parsed.address || '');
            setServiceReception(parsed.reception || '');
          } catch {
            setServiceVenue(m.serviceInformation);
          }
        }
      } else {
        setErrorMsg(res.error || 'Failed to load memorial details');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading memorial');
    } finally {
      setIsLoading(false);
    }
  };

  const constructServiceInformation = (): string | null => {
    if (!serviceVenue && !serviceDate && !serviceAddress && !serviceReception) {
      return null;
    }
    return JSON.stringify({
      venue: serviceVenue,
      date: serviceDate ? new Date(serviceDate).toISOString() : null,
      address: serviceAddress,
      reception: serviceReception,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSaving(true);

    const payload = {
      fullName: fullName.trim(),
      slug: slug.trim() || undefined,
      dateOfBirth: dateOfBirth,
      dateOfPassing: dateOfPassing,
      biography: biography.trim(),
      lifeStory: lifeStory.trim() || null,
      mainPhotograph: mainPhotograph.trim(),
      templateType,
      publicationStatus,
      familyAcknowledgement: familyAcknowledgement.trim() || null,
      serviceInformation: constructServiceInformation(),
      livestreamUrl: livestreamUrl.trim() || null,
      recordingUrl: recordingUrl.trim() || null,
    };

    try {
      if (isEditing && id) {
        const res = await api.updateMemorial(id, payload);
        if (res.success && res.data) {
          setSuccessMsg('Memorial updated successfully');
          setSlug(res.data.slug);
        } else {
          setErrorMsg(res.error || 'Failed to update memorial');
        }
      } else {
        const res = await api.createMemorial(payload);
        if (res.success && res.data) {
          setSuccessMsg('Memorial created successfully');
          navigate(`/admin/memorials/${res.data.id}/edit`, { replace: true });
        } else {
          setErrorMsg(res.error || 'Failed to create memorial');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error saving memorial');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddGalleryPhoto = async (result: { url: string; publicId?: string }) => {
    if (!result.url || !id) return;
    try {
      const res = await api.addMedia({
        memorialId: id,
        url: result.url,
        cloudinaryPublicId: result.publicId || null,
        caption: null,
        sortOrder: gallery.length,
      });

      if (res.success && res.data) {
        setGallery([...gallery, res.data]);
        setIsGalleryUploading(false);
      }
    } catch (err) {
      console.error('Error adding gallery image:', err);
    }
  };

  const handleDeleteGalleryPhoto = async (photoId: string) => {
    try {
      const res = await api.deleteMedia(photoId);
      if (res.success) {
        setGallery(gallery.filter((g) => g.id !== photoId));
      }
    } catch (err) {
      console.error('Error removing gallery photo:', err);
    }
  };

  // Live preview snapshot
  const currentPreviewState: Partial<Memorial> = {
    fullName: fullName || 'Full Name',
    slug: slug || 'preview-slug',
    dateOfBirth,
    dateOfPassing,
    biography,
    lifeStory,
    mainPhotograph,
    templateType,
    publicationStatus,
    familyAcknowledgement,
    serviceInformation: constructServiceInformation(),
    livestreamUrl: livestreamUrl || null,
    recordingUrl: recordingUrl || null,
    media: gallery,
  };

  return (
    <AdminLayout
      title={isEditing ? `Edit: ${fullName || 'Memorial'}` : 'Create New Memorial'}
      subtitle="Configure remembrance details, biography, photography, and ceremonial streams"
      breadcrumbs={[
        { label: 'Memorials', href: '/admin/memorials' },
        { label: isEditing ? (fullName || 'Edit') : 'New Memorial' },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-stone-600" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-amber-300" />}
            <span>{isSaving ? 'Saving...' : 'Save Memorial'}</span>
          </button>
        </div>
      }
    >
      {/* Toast Feedback */}
      {successMsg && (
        <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-stone-400 hover:text-stone-600">×</button>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-stone-400 hover:text-stone-600">×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 pb-12 font-sans">
        {/* Section 1: Template Selection (Required Male / Female / Child) */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-serif font-bold text-stone-900">
              1. Memorial Design Template
            </h3>
            <p className="text-xs text-stone-500">
              Choose the visual character and atmosphere appropriate for honoring their life.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Template 1: Male */}
            <div
              onClick={() => setTemplateType('MALE')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                templateType === 'MALE'
                  ? 'border-stone-900 bg-stone-900 text-stone-50 shadow-md'
                  : 'border-stone-200 hover:border-stone-400 bg-stone-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Template 1</span>
                {templateType === 'MALE' && <CheckCircle className="w-4 h-4 text-amber-300" />}
              </div>
              <h4 className="font-serif text-lg font-bold">Classic Dignity</h4>
              <p className={`text-xs mt-1 leading-relaxed ${templateType === 'MALE' ? 'text-stone-300' : 'text-stone-500'}`}>
                Refined dark slate, deep navy, architectural restraint, and stately serif typography. (Male)
              </p>
            </div>

            {/* Template 2: Female */}
            <div
              onClick={() => setTemplateType('FEMALE')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                templateType === 'FEMALE'
                  ? 'border-stone-800 bg-stone-800 text-stone-50 shadow-md'
                  : 'border-stone-200 hover:border-stone-400 bg-stone-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Template 2</span>
                {templateType === 'FEMALE' && <CheckCircle className="w-4 h-4 text-rose-300" />}
              </div>
              <h4 className="font-serif text-lg font-bold">Grace &amp; Botanical</h4>
              <p className={`text-xs mt-1 leading-relaxed ${templateType === 'FEMALE' ? 'text-stone-300' : 'text-stone-500'}`}>
                Warm champagne, delicate floral serif elegance, and tender grace. (Female)
              </p>
            </div>

            {/* Template 3: Child */}
            <div
              onClick={() => setTemplateType('CHILD')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                templateType === 'CHILD'
                  ? 'border-sky-950 bg-sky-950 text-sky-50 shadow-md'
                  : 'border-stone-200 hover:border-stone-400 bg-stone-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Template 3</span>
                {templateType === 'CHILD' && <CheckCircle className="w-4 h-4 text-amber-200" />}
              </div>
              <h4 className="font-serif text-lg font-bold">Gentle Celestial</h4>
              <p className={`text-xs mt-1 leading-relaxed ${templateType === 'CHILD' ? 'text-sky-200' : 'text-stone-500'}`}>
                Softer starlight tones, gentle rounded warmth, and age-appropriate reverence. (Child)
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Person & Identity Details */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base font-serif font-bold text-stone-900">
              2. Identity &amp; Essential Dates
            </h3>
            <p className="text-xs text-stone-500">Core personal information for the memorial sanctuary.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Legal / Remembrance Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Arthur William Pendleton"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                URL Slug (Shareable Path)
              </label>
              <div className="flex rounded-lg overflow-hidden border border-stone-300 bg-stone-50">
                <span className="px-3 py-2.5 text-xs text-stone-500 bg-stone-100 border-r border-stone-300 select-none">
                  /memorial/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-from-name"
                  className="flex-1 px-3 py-2.5 bg-transparent text-sm text-stone-900 focus:outline-hidden"
                />
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Leave blank to auto-generate safely with collision protection.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Date of Passing *
              </label>
              <input
                type="date"
                required
                value={dateOfPassing}
                onChange={(e) => setDateOfPassing(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
            </div>
          </div>

          {/* Main Portrait Photograph */}
          <div className="pt-2">
            <CloudinaryUploader
              label="Main Memorial Portrait Photograph *"
              hint="Primary focal photograph displayed in header and memorial cards."
              currentImageUrl={mainPhotograph}
              onUploadSuccess={({ url }) => setMainPhotograph(url)}
            />
          </div>
        </div>

        {/* Section 3: Biography & Life Story */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base font-serif font-bold text-stone-900">
              3. Biography &amp; Life Story
            </h3>
            <p className="text-xs text-stone-500">Document their character, accomplishments, and enduring legacy.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Short Biography / Memorial Inscription *
            </label>
            <textarea
              required
              rows={3}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="A heartfelt summary or opening inscription commemorating their spirit..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
              Complete Life Story / Eulogy (Optional)
            </label>
            <textarea
              rows={6}
              value={lifeStory}
              onChange={(e) => setLifeStory(e.target.value)}
              placeholder="Extended chronicle of their life journey, passions, family milestones, and enduring memories..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800 leading-relaxed"
            />
          </div>
        </div>

        {/* Section 4: Service Information */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base font-serif font-bold text-stone-900">
              4. Service &amp; Gathering Information
            </h3>
            <p className="text-xs text-stone-500">Provide attendees with date, chapel, address, and reception details.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Venue / Sanctuary Name
              </label>
              <input
                type="text"
                value={serviceVenue}
                onChange={(e) => setServiceVenue(e.target.value)}
                placeholder="e.g. St. Jude Chapel of Grace"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Service Date &amp; Time
              </label>
              <input
                type="datetime-local"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Physical Address
              </label>
              <input
                type="text"
                value={serviceAddress}
                onChange={(e) => setServiceAddress(e.target.value)}
                placeholder="e.g. 420 Cathedral Way, St. Giles"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Reception / Post-Service Gathering Notes
              </label>
              <input
                type="text"
                value={serviceReception}
                onChange={(e) => setServiceReception(e.target.value)}
                placeholder="e.g. The Grand Conservatory following the ceremony"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Livestream & Recording URLs (Strict conditional visibility) */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-rose-600" />
              <span>5. Livestream &amp; Ceremony Recording</span>
            </h3>
            <p className="text-xs text-stone-500">
              Note: Sections automatically hide on public memorial pages whenever links are left empty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Live Broadcast Link (YouTube / Vimeo / Zoom)
              </label>
              <input
                type="url"
                value={livestreamUrl}
                onChange={(e) => setLivestreamUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Hidden automatically when empty.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                Archived Service Recording Link
              </label>
              <input
                type="url"
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
                placeholder="https://vimeo.com/..."
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">
                Can be updated after service to display recorded stream.
              </span>
            </div>
          </div>
        </div>

        {/* Section 6: Family Acknowledgements */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500" />
              <span>6. Family Acknowledgements</span>
            </h3>
            <p className="text-xs text-stone-500">Express gratitude to friends, caregivers, and community supporters.</p>
          </div>

          <div>
            <textarea
              rows={3}
              value={familyAcknowledgement}
              onChange={(e) => setFamilyAcknowledgement(e.target.value)}
              placeholder="The family wishes to express our deepest gratitude to all who offered comfort, floral tributes, and prayers..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-stone-900 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800 leading-relaxed"
            />
          </div>
        </div>

        {/* Section 7: Remembrance Photo Gallery (If already created) */}
        {isEditing && (
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-4">
            <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                  <Images className="w-5 h-5 text-amber-600" />
                  <span>7. Remembrance Photo Gallery ({gallery.length})</span>
                </h3>
                <p className="text-xs text-stone-500">Upload multiple remembrance photos to the Cloudinary gallery.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsGalleryUploading(!isGalleryUploading)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Gallery Photo</span>
              </button>
            </div>

            {isGalleryUploading && (
              <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 mb-4">
                <CloudinaryUploader
                  label="Add Photo to Gallery"
                  hint="Select a photograph to add to the public remembrance gallery"
                  onUploadSuccess={handleAddGalleryPhoto}
                />
              </div>
            )}

            {gallery.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-2">
                No gallery photos added yet. Click "Add Gallery Photo" to upload photographs.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {gallery.map((photo) => (
                  <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-stone-200 bg-stone-100 aspect-4/3">
                    <img
                      src={photo.url}
                      alt={photo.caption || 'Gallery photo'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryPhoto(photo.id)}
                        className="p-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
                        title="Delete photo from gallery"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Section 8: Publication Status & Submission */}
        <div className="bg-stone-900 text-stone-100 p-6 rounded-xl border border-stone-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-serif font-bold text-white">
              Publication Visibility
            </h4>
            <p className="text-xs text-stone-400 mt-0.5">
              Drafts are private to administrators. Published records appear on the public directory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center p-1 bg-stone-800 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setPublicationStatus('DRAFT')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  publicationStatus === 'DRAFT'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Keep as Draft
              </button>
              <button
                type="button"
                onClick={() => setPublicationStatus('PUBLISHED')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  publicationStatus === 'PUBLISHED'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Publish Live
              </button>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Memorial'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Preview Modal */}
      <MemorialPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        memorial={currentPreviewState}
      />
    </AdminLayout>
  );
};
