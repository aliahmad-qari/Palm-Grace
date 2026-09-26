import React, { useEffect, useState } from 'react';
import {
  MessageSquareHeart,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  Flame
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout.js';
import { api } from '../../lib/api.js';
import { Tribute, TributeStatus } from '../../types/index.js';

export const AdminTributesPage: React.FC = () => {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingTribute, setEditingTribute] = useState<Tribute | null>(null);
  const [editVisitorName, setEditVisitorName] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTributes = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminTributes(activeTab === 'ALL' ? undefined : activeTab);
      if (res.success && res.data) {
        setTributes(res.data);
        if (res.counts) {
          setCounts(res.counts);
        }
      }
    } catch (err: any) {
      console.error('Error fetching tributes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTributes();
  }, [activeTab]);

  const handleApprove = async (id: string) => {
    try {
      const res = await api.approveTribute(id);
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: 'Tribute approved and published to the memorial wall.' });
        fetchTributes();
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to approve tribute' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error approving tribute' });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await api.rejectTribute(id);
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: 'Tribute rejected and hidden from public view.' });
        fetchTributes();
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to reject tribute' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error rejecting tribute' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this tribute?')) return;
    try {
      const res = await api.deleteTribute(id);
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: 'Tribute removed successfully.' });
        fetchTributes();
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to delete tribute' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error deleting tribute' });
    }
  };

  const handleSaveEdit = async () => {
    if (!editingTribute) return;
    try {
      const res = await api.updateTribute(editingTribute.id, {
        visitorName: editVisitorName.trim(),
        message: editMessage.trim(),
      });
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: 'Tribute updated successfully.' });
        setEditingTribute(null);
        fetchTributes();
      } else {
        setFeedbackMsg({ type: 'error', text: res.error || 'Failed to update tribute' });
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error updating tribute' });
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const filteredTributes = tributes.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.visitorName.toLowerCase().includes(q) ||
      t.message.toLowerCase().includes(q) ||
      t.memorial?.fullName.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout
      title="Tributes &amp; Moderation"
      subtitle="Review visitor messages, condolences, and memories before publication"
      breadcrumbs={[{ label: 'Tributes' }]}
    >
      {/* Toast Feedback */}
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

      {/* Tabs & Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 font-sans">
        {/* Status Tabs (Segmented buttons) */}
        <div className="flex items-center p-1 bg-stone-100 rounded-lg text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'bg-white text-amber-800 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Pending Review</span>
            {counts.pending > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center justify-center tabular-nums">
                {counts.pending}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('APPROVED')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'APPROVED'
                ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Approved &amp; Live</span>
            <span className="text-[10px] text-stone-500 tabular-nums">({counts.approved})</span>
          </button>

          <button
            onClick={() => setActiveTab('REJECTED')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'REJECTED'
                ? 'bg-white text-rose-800 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Rejected</span>
            <span className="text-[10px] text-stone-500 tabular-nums">({counts.rejected})</span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              activeTab === 'ALL'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Submissions
          </button>
        </div>

        {/* Live Filter Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search visitor name or text..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:border-stone-800"
          />
        </div>
      </div>

      {/* Tributes List */}
      <div className="space-y-3 font-sans">
        {isLoading ? (
          <div className="bg-white p-12 text-center text-xs text-stone-500 rounded-xl border border-stone-200">
            Loading tributes...
          </div>
        ) : filteredTributes.length === 0 ? (
          <div className="bg-white p-12 text-center text-xs text-stone-500 rounded-xl border border-stone-200">
            No tributes found for status "{activeTab.toLowerCase()}".
          </div>
        ) : (
          filteredTributes.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                {/* Header: Visitor name, memorial link, status, timestamp */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-stone-900 text-sm">{t.visitorName}</span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-500">
                    Memorial:{' '}
                    {t.memorial ? (
                      <a
                        href={`/memorial/${t.memorial.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-stone-800 hover:text-amber-800 font-medium inline-flex items-center gap-1"
                      >
                        {t.memorial.fullName}
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                      </a>
                    ) : (
                      'Unknown'
                    )}
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-400 tabular-nums">{formatDate(t.createdAt)}</span>

                  {/* Status Indicator */}
                  <span
                    className={`ml-auto px-2 py-0.5 rounded-sm text-[11px] font-medium uppercase tracking-wider ${
                      t.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : t.status === 'REJECTED'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                {/* Tribute message body */}
                <p className="text-sm text-stone-800 whitespace-pre-line leading-relaxed italic bg-stone-50 p-3 rounded-lg border border-stone-100">
                  "{t.message}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-start pt-1">
                {t.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleApprove(t.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
                    title="Approve Tribute"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {t.status !== 'REJECTED' && (
                  <button
                    onClick={() => handleReject(t.id)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs font-medium rounded-lg flex items-center gap-1 border border-stone-200 transition-colors"
                    title="Reject Tribute"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setEditingTribute(t);
                    setEditVisitorName(t.visitorName);
                    setEditMessage(t.message);
                  }}
                  className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 border border-stone-200 transition-colors"
                  title="Edit Tribute"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 border border-stone-200 transition-colors"
                  title="Delete Tribute"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Tribute Modal */}
      {editingTribute && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Edit Tribute Submission
            </h3>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Visitor Name
              </label>
              <input
                type="text"
                value={editVisitorName}
                onChange={(e) => setEditVisitorName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tribute Message
              </label>
              <textarea
                rows={4}
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-800"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingTribute(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
