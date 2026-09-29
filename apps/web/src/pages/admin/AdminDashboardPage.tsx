import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scroll,
  Globe,
  FileEdit,
  MessageSquareHeart,
  Plus,
  ArrowRight,
  Eye,
  Calendar,
  Sparkles,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../lib/api.js';
import { Memorial, Tribute } from '../../types/index.js';
import { MemorialPreviewModal } from '../../components/admin/MemorialPreviewModal.js';

export const AdminDashboardPage: React.FC = () => {
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [pendingTributes, setPendingTributes] = useState<Tribute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewMemorial, setPreviewMemorial] = useState<Memorial | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [mRes, tRes] = await Promise.all([
        api.getAdminMemorials(),
        api.getAdminTributes('PENDING'),
      ]);

      if (mRes.success && mRes.data) {
        setMemorials(mRes.data);
      }
      if (tRes.success && tRes.data) {
        setPendingTributes(tRes.data);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalMemorials = memorials.length;
  const publishedMemorials = memorials.filter((m) => m.publicationStatus === 'PUBLISHED').length;
  const draftMemorials = memorials.filter((m) => m.publicationStatus === 'DRAFT').length;
  const pendingCount = pendingTributes.length;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <AdminLayout
      title="Sanctuary Overview"
      subtitle="Phase 1 Memorial & Tribute Management Dashboard"
      actions={
        <Link
          to="/admin/memorials/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Create Memorial</span>
        </Link>
      }
    >
      {/* 4 Core Summary Metric Cards (Zero-pill, tabular numbers) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Memorials */}
        <Link
          to="/admin/memorials"
          className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-stone-300 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Memorials</span>
            <Scroll className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-stone-900 tabular-nums">
              {isLoading ? '—' : totalMemorials}
            </span>
            <span className="text-xs text-stone-500 font-sans">records</span>
          </div>
        </Link>

        {/* Published Memorials */}
        <Link
          to="/admin/memorials?status=PUBLISHED"
          className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-emerald-200 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Published</span>
            <Globe className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-stone-900 tabular-nums">
              {isLoading ? '—' : publishedMemorials}
            </span>
            <span className="text-xs text-emerald-700 font-sans">active publicly</span>
          </div>
        </Link>

        {/* Draft Memorials */}
        <Link
          to="/admin/memorials?status=DRAFT"
          className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-amber-200 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Drafts</span>
            <FileEdit className="w-4 h-4 text-amber-600 group-hover:text-amber-700 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-stone-900 tabular-nums">
              {isLoading ? '—' : draftMemorials}
            </span>
            <span className="text-xs text-amber-700 font-sans">in progress</span>
          </div>
        </Link>

        {/* Pending Tributes */}
        <Link
          to="/admin/tributes?status=PENDING"
          className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-rose-200 hover:shadow-sm transition-all group"
        >
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Pending Tributes</span>
            <MessageSquareHeart className="w-4 h-4 text-rose-500 group-hover:text-rose-600 transition-colors" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-stone-900 tabular-nums">
              {isLoading ? '—' : pendingCount}
            </span>
            <span className="text-xs text-rose-600 font-sans">needs review</span>
          </div>
        </Link>
      </div>

      {/* Pending Tributes Action Banner (if any pending) */}
      {pendingCount > 0 && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-900">
                {pendingCount} Guest {pendingCount === 1 ? 'Tribute' : 'Tributes'} Awaiting Moderation
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                Review submitted memories and words of condolences before they appear publicly.
              </p>
            </div>
          </div>
          <Link
            to="/admin/tributes"
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-medium rounded-lg inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-colors"
          >
            <span>Review Tributes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Recent Memorials Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg text-stone-900">Memorial Catalog</h3>
            <p className="text-xs text-stone-500 mt-0.5">Recently created and managed memorial records</p>
          </div>
          <Link
            to="/admin/memorials"
            className="text-xs font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1 transition-colors"
          >
            <span>View All ({memorials.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 border-b border-stone-200 font-sans">
              <tr>
                <th className="px-5 py-3">Person &amp; Portrait</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Template</th>
                <th className="px-4 py-3">Service Stream</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-sans">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-xs text-stone-500">
                    Loading memorial records...
                  </td>
                </tr>
              ) : memorials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-xs text-stone-500">
                    No memorials created yet. Click "Create Memorial" to start.
                  </td>
                </tr>
              ) : (
                memorials.slice(0, 5).map((m) => (
                  <tr key={m.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.mainPhotograph}
                          alt={m.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0 bg-stone-100"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <Link
                            to={`/admin/memorials/${m.id}/edit`}
                            className="font-medium text-stone-900 hover:text-amber-800 transition-colors block truncate"
                          >
                            {m.fullName}
                          </Link>
                          <span className="text-xs text-stone-500 truncate block">
                            /{m.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        m.publicationStatus === 'PUBLISHED' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          m.publicationStatus === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`} />
                        {m.publicationStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-stone-600">
                      {m.templateType}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-stone-500">
                      {m.livestreamUrl || m.recordingUrl ? (
                        <span className="text-emerald-700 font-medium">Link Active</span>
                      ) : (
                        <span className="text-stone-400">None</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-xs text-stone-500 tabular-nums">
                      {formatDate(m.updatedAt)}
                    </td>

                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => setPreviewMemorial(m)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
                        title="Preview Memorial"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/admin/memorials/${m.id}/edit`}
                        className="px-2.5 py-1 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                      >
                        Edit
                      </Link>
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
    </AdminLayout>
  );
};
