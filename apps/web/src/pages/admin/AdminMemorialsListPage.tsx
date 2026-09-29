import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Eye,
  FileEdit,
  Trash2,
  ExternalLink,
  Globe,
  Clock,
  Filter,
  CheckCircle,
  AlertCircle,
  QrCode,
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../lib/api.js';
import { Memorial, PublicationStatus, TemplateType } from '../../types/index.js';
import { MemorialPreviewModal } from '../../components/admin/MemorialPreviewModal.js';
import { AdminMemorialQrModal } from '../../components/admin/AdminMemorialQrModal.js';

export const AdminMemorialsListPage: React.FC = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PublicationStatus>('ALL');
  const [templateFilter, setTemplateFilter] = useState<'ALL' | TemplateType>('ALL');
  const [previewMemorial, setPreviewMemorial] = useState<Memorial | null>(null);
  const [qrMemorial, setQrMemorial] = useState<Memorial | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchMemorials = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminMemorials({
        search: search.trim() || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        template: templateFilter === 'ALL' ? undefined : templateFilter,
      });

      if (res.success && res.data) {
        setMemorials(res.data);
      }
    } catch (err: any) {
      console.error('Error fetching memorials:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMemorials();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, statusFilter, templateFilter]);

  const handleTogglePublish = async (m: Memorial) => {
    const newStatus = m.publicationStatus === 'PUBLISHED' ? false : true;
    try {
      const res = await api.publishMemorial(m.id, newStatus);
      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: `"${m.fullName}" is now ${newStatus ? 'Published' : 'Draft'}`,
        });
        fetchMemorials();
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to update status' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error updating status' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the memorial for "${name}"? This will permanently remove all associated photos and tributes.`)) {
      return;
    }

    try {
      const res = await api.deleteMemorial(id);
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: `Memorial for "${name}" has been deleted.` });
        fetchMemorials();
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to delete memorial' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error deleting memorial' });
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout
      title="Memorial Directory &amp; Management"
      subtitle="Complete registry of public sanctuaries, draft memoirs, and remembrance pages"
      breadcrumbs={[{ label: 'Memorials' }]}
      actions={
        <Link
          to="/admin/memorials/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>New Memorial</span>
        </Link>
      }
    >
      {/* Feedback Toast Banner */}
      {feedbackMsg && (
        <div
          className={`mb-5 p-3 rounded-lg flex items-center justify-between text-xs ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-stone-400 hover:text-stone-600 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by full name or URL slug..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs md:text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
          />
        </div>

        {/* Filter Controls (Zero pill, clean segmented controls) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'ALL' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('PUBLISHED')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'PUBLISHED' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter('DRAFT')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                statusFilter === 'DRAFT' ? 'bg-white text-amber-800 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Drafts
            </button>
          </div>

          {/* Template Filter */}
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value as any)}
            className="px-3 py-2 bg-stone-100 border-none rounded-lg text-xs font-medium text-stone-700 focus:ring-1 focus:ring-stone-800 cursor-pointer"
          >
            <option value="ALL">All Templates</option>
            <option value="MALE">Template 1 (Male)</option>
            <option value="FEMALE">Template 2 (Female)</option>
            <option value="CHILD">Template 3 (Child)</option>
          </select>
        </div>
      </div>

      {/* Memorials Grid / Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 border-b border-stone-200 font-sans">
              <tr>
                <th className="px-5 py-3.5">Memorial Details</th>
                <th className="px-4 py-3.5">Template</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Gallery &amp; Tributes</th>
                <th className="px-4 py-3.5">Dates</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-xs text-stone-500">
                    Loading records from database...
                  </td>
                </tr>
              ) : memorials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-xs text-stone-500">
                    No memorials match your filter criteria.
                  </td>
                </tr>
              ) : (
                memorials.map((m) => (
                  <tr key={m.id} className="hover:bg-stone-50/60 transition-colors">
                    {/* Person Details */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.mainPhotograph}
                          alt={m.fullName}
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0 bg-stone-100 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/admin/memorials/${m.id}/edit`}
                            className="font-medium text-stone-900 hover:text-amber-800 transition-colors text-sm truncate block"
                          >
                            {m.fullName}
                          </Link>
                          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono mt-0.5">
                            <span>/{m.slug}</span>
                            {m.livestreamUrl && (
                              <span className="text-[10px] text-rose-600 font-sans font-medium">· Livestream Active</span>
                            )}
                            {m.recordingUrl && (
                              <span className="text-[10px] text-amber-600 font-sans font-medium">· Recording Active</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Template */}
                    <td className="px-4 py-4 text-xs">
                      <span className="font-medium text-stone-700">
                        {m.templateType === 'MALE' && 'Classic (Male)'}
                        {m.templateType === 'FEMALE' && 'Grace (Female)'}
                        {m.templateType === 'CHILD' && 'Gentle (Child)'}
                      </span>
                    </td>

                    {/* Status Toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleTogglePublish(m)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                          m.publicationStatus === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                        }`}
                        title="Click to toggle Draft / Published"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          m.publicationStatus === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        <span>{m.publicationStatus === 'PUBLISHED' ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>

                    {/* Gallery & Tributes */}
                    <td className="px-4 py-4 text-xs text-stone-600">
                      <div className="space-y-0.5">
                        <div>{m.media?.length || 0} photos</div>
                        <div className="text-stone-400">
                          {m._count?.tributes ?? m.tributes?.length ?? 0} tributes
                        </div>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="px-4 py-4 text-xs text-stone-500 tabular-nums">
                      <div>Born: {formatDate(m.dateOfBirth)}</div>
                      <div>Passed: {formatDate(m.dateOfPassing)}</div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setPreviewMemorial(m)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
                          title="Preview Memorial"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {m.publicationStatus === 'PUBLISHED' && (
                          <button
                            onClick={() => setQrMemorial(m)}
                            className="p-1.5 text-amber-700 hover:text-amber-900 rounded-md hover:bg-amber-50 transition-colors"
                            title="View & Download Physical QR Code"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}

                        {m.publicationStatus === 'PUBLISHED' && (
                          <a
                            href={`/memorial/${m.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
                            title="Open Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        <Link
                          to={`/admin/memorials/${m.id}/edit`}
                          className="p-1.5 text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
                          title="Edit Memorial"
                        >
                          <FileEdit className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(m.id, m.fullName)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                          title="Delete Memorial"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewMemorial && (
        <MemorialPreviewModal
          isOpen={Boolean(previewMemorial)}
          onClose={() => setPreviewMemorial(null)}
          memorial={previewMemorial}
        />
      )}

      {/* Physical QR Modal */}
      {qrMemorial && (
        <AdminMemorialQrModal
          isOpen={Boolean(qrMemorial)}
          onClose={() => setQrMemorial(null)}
          memorial={qrMemorial}
        />
      )}
    </AdminLayout>
  );
};
