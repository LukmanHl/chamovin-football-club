import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Edit, Trash2, Calendar, User, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '../../services/api';
import { NewsArticle, NewsCategory } from '../../types/index';
import { useAuth } from '../../context/AuthContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminNewsPage: React.FC = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // In-app Delete & Feedback State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const categories: NewsCategory[] = [
    'Football Management',
    'Player Announcements',
    'Sports Opportunities',
    'Travel & Visa Updates',
    'Company News'
  ];

  const initialForm = {
    title: '',
    slug: '',
    coverImage: '/src/assets/images/hero_football_pitch_stands_1792410704308.jpg',
    category: 'Football Management' as NewsCategory,
    publicationDate: new Date().toISOString().split('T')[0],
    author: user?.name || 'Chamonvin Directorate',
    content: '',
    status: 'published' as 'published' | 'draft'
  };

  const [form, setForm] = useState(initialForm);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await api.getNews();
      setArticles(data);
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (article: NewsArticle) => {
    setEditingId(article.id);
    setForm({
      title: article.title,
      slug: article.slug,
      coverImage: article.coverImage,
      category: article.category,
      publicationDate: article.publicationDate,
      author: article.author,
      content: article.content,
      status: article.status
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      setForm(prev => ({ ...prev, coverImage: res.url }));
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.content) {
      setError('Please provide title and content.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        coverImage: form.coverImage.trim(),
        category: form.category,
        publicationDate: form.publicationDate,
        author: form.author.trim(),
        content: form.content.trim(),
        status: form.status
      };

      if (editingId) {
        await api.updateNews(editingId, payload);
        setFeedbackMsg({ type: 'success', text: `Article "${payload.title}" updated successfully!` });
      } else {
        await api.createNews(payload);
        setFeedbackMsg({ type: 'success', text: `Article "${payload.title}" created successfully!` });
      }
      setIsModalOpen(false);
      await loadNews();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteNews(deleteTarget.id);
      setFeedbackMsg({ type: 'success', text: `Article "${deleteTarget.title}" deleted successfully.` });
      setDeleteTarget(null);
      await loadNews();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: `Delete failed: ${err.message}` });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Feedback Banner */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl text-xs flex items-center justify-between gap-3 ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
            Media & Insights
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            News & Press Releases Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish sports announcements, player career milestones, and immigration updates.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Article List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500">Loading articles...</div>
        ) : articles.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {articles.map(article => (
              <div key={article.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-12 bg-slate-900 rounded-md overflow-hidden shrink-0">
                    <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <span className="text-emerald-700 font-bold uppercase">{article.category}</span>
                      <span>·</span>
                      <span>{article.publicationDate}</span>
                      <span>·</span>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        article.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {article.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-950">{article.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditModal(article)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(article.id, article.title)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-500">No news articles found.</div>
        )}
      </div>

      {/* Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-950">
                {editingId ? 'Edit Article' : 'Write New Article'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">{error}</div>}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as NewsCategory })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded bg-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Publication Date</label>
                  <input
                    type="date"
                    value={form.publicationDate}
                    onChange={(e) => setForm({ ...form, publicationDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="text-xs font-semibold text-slate-800 block">Cover Image</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs text-slate-500" />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={form.coverImage}
                    onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
                {uploadingImage && <span className="text-[10px] text-emerald-700">Uploading image...</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Author Byline</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Article Body Content *</label>
                <textarea
                  rows={6}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.status === 'published'}
                    onChange={(e) => setForm({ ...form, status: e.target.checked ? 'published' : 'draft' })}
                  />
                  <span>Publish to Website</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 rounded"
                  >
                    {saving ? 'Saving...' : 'Save Article'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-app Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete News Article"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"?`}
        confirmLabel="Yes, Delete Article"
        isLoading={deleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
