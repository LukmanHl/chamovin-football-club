import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Star,
  Quote,
  X,
  Trophy,
  Compass
} from 'lucide-react';
import { api } from '../../services/api';
import { Testimonial } from '../../types/index';

interface ReviewFormData {
  name: string;
  role: string;
  category: 'sports' | 'travel';
  location: string;
  rating: number;
  content: string;
  date: string;
}

const INITIAL_FORM: ReviewFormData = {
  name: '',
  role: '',
  category: 'sports',
  location: '',
  rating: 5,
  content: '',
  date: '2026 Season'
};

export const AdminTestimonialsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<'all' | 'sports' | 'travel'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ReviewFormData>(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Delete modal state
  const [reviewToDelete, setReviewToDelete] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await api.getTestimonials();
      setReviews(data);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to load reviews.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData(INITIAL_FORM);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) {
      setModalError('Client name and review content are required.');
      return;
    }
    setSaving(true);
    setModalError(null);
    try {
      await api.createTestimonial(formData);
      await loadReviews();
      setIsModalOpen(false);
      setFeedbackMsg({ type: 'success', text: 'New client review added successfully!' });
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setModalError(err.message || 'Error saving review.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    setDeleting(true);
    try {
      await api.deleteTestimonial(reviewToDelete.id);
      setReviews(prev => prev.filter(r => r.id !== reviewToDelete.id));
      setReviewToDelete(null);
      setFeedbackMsg({ type: 'success', text: `Review by ${reviewToDelete.name} was deleted successfully.` });
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Error deleting review.' });
    } finally {
      setDeleting(false);
    }
  };

  const filtered = filterCategory === 'all'
    ? reviews
    : reviews.filter(r => r.category === filterCategory);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">Client Reviews & Testimonials</h1>
          </div>
          <p className="text-sm text-slate-500">
            Manage, add, and delete client and athlete testimonials shown on the website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Review</span>
        </button>
      </div>

      {/* Global Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between gap-3 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilterCategory('all')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            filterCategory === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterCategory('sports')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            filterCategory === 'sports'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Sports Management ({reviews.filter(r => r.category === 'sports').length})</span>
        </button>
        <button
          type="button"
          onClick={() => setFilterCategory('travel')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            filterCategory === 'travel'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Travel & Visa ({reviews.filter(r => r.category === 'travel').length})</span>
        </button>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm">
          Loading client reviews...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">No reviews found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterCategory === 'all'
              ? 'No testimonials are currently in the database. Click "Add New Review" to publish one.'
              : `No reviews match the selected filter category.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-6 flex flex-col justify-between shadow-xs relative group"
            >
              <div className="space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.category === 'sports'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                  }`}>
                    {item.category === 'sports' ? 'Sports' : 'Travel & Visa'}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic line-clamp-5">
                  "{item.content}"
                </p>
              </div>

              {/* Author & Action Footer */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 block truncate">{item.name}</span>
                  <span className="text-[11px] text-slate-500 block truncate">{item.role}</span>
                  <span className="text-[10px] text-emerald-700 font-mono block mt-0.5">
                    {item.location} {item.date ? `· ${item.date}` : ''}
                  </span>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => setReviewToDelete(item)}
                  className="px-2.5 py-1.5 text-xs text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-colors flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                  title="Delete this review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Add Client / Athlete Review</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-800 text-xs border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client or Athlete Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Emmanuel Oduro"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role or Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Forward · Represented Player"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Division Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="sports">Sports Management</option>
                    <option value="travel">Travel & Visa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / Club City</label>
                  <input
                    type="text"
                    placeholder="e.g. Lisbon, Portugal"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Star Rating (1 - 5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Testimonial Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write the client's quote or experience with Chamonvin..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  {saving ? 'Publishing...' : 'Save & Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Delete Review Permanently?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete the review by <strong>{reviewToDelete.name}</strong>?
                This will immediately remove it from the website testimonials section and the database.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs italic text-slate-700">
              "{reviewToDelete.content.slice(0, 120)}..."
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="px-5 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
