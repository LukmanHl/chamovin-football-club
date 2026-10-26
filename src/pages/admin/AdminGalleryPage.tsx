import React, { useState, useEffect } from 'react';
import {
  Camera,
  Plus,
  Trash2,
  Edit2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  Star,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { api } from '../../services/api';
import { GalleryItem } from '../../types/index';

type GalleryCategory = 'Scouting & Matches' | 'Training & Performance' | 'Travel & Tours' | 'Management & Events';

interface GalleryFormData {
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  location: string;
  date: string;
  isFeatured: boolean;
}

const INITIAL_FORM: GalleryFormData = {
  title: '',
  category: 'Scouting & Matches',
  imageUrl: '',
  location: '',
  date: '',
  isFeatured: false
};

export const AdminGalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<GalleryFormData>(INITIAL_FORM);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Preview lightbox
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  const categories: GalleryCategory[] = [
    'Scouting & Matches',
    'Training & Performance',
    'Travel & Tours',
    'Management & Events'
  ];

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await api.getGallery();
      setItems(data);
    } catch (err: any) {
      console.error('Failed to load gallery items:', err);
      setFeedbackMsg({ type: 'error', text: 'Could not load gallery items from server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      location: item.location || '',
      date: item.date || '',
      isFeatured: !!item.isFeatured
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setModalError(null);
    try {
      const res = await api.uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl: res.url }));
    } catch (err: any) {
      setModalError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!formData.title.trim()) {
      setModalError('Please enter a photo title.');
      return;
    }
    if (!formData.imageUrl.trim()) {
      setModalError('Please upload an image or provide an image URL.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        imageUrl: formData.imageUrl.trim(),
        description: '', // Write-ups removed per user specification
        location: formData.location.trim() || undefined,
        date: formData.date.trim() || undefined,
        isFeatured: formData.isFeatured
      };

      if (editingId) {
        await api.updateGalleryItem(editingId, payload);
        setFeedbackMsg({ type: 'success', text: `Gallery photo "${payload.title}" updated successfully!` });
      } else {
        await api.createGalleryItem(payload);
        setFeedbackMsg({ type: 'success', text: `New photo "${payload.title}" added to gallery!` });
      }

      setIsModalOpen(false);
      await loadGallery();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setModalError(err.message || 'Failed to save gallery photo.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await api.deleteGalleryItem(itemToDelete.id);
      setFeedbackMsg({ type: 'success', text: `"${itemToDelete.title}" was removed from the gallery.` });
      setItemToDelete(null);
      await loadGallery();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Failed to delete gallery item.' });
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = filterCategory === 'All'
    ? items
    : items.filter(item => item.category === filterCategory);

  const featuredCount = items.filter(i => i.isFeatured).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Media Content CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Moments & Matchday Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add, edit, or delete photos for the homepage gallery. Public display is clean: title only, no write-ups.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gallery Photo</span>
        </button>
      </div>

      {/* Notification Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm transition-all ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span className="font-medium">{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Photos</span>
            <span className="text-2xl font-black text-slate-900">{items.length}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Featured on Home</span>
            <span className="text-2xl font-black text-slate-900">{featuredCount}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Categories</span>
            <span className="text-2xl font-black text-slate-900">{categories.length}</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategory('All')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
            filterCategory === 'All'
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Photos ({items.length})
        </button>
        {categories.map(cat => {
          const count = items.filter(i => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filterCategory === cat
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Photos Grid */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading gallery photos...</div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No photos in this category</h3>
          <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
            Click the button below to upload your first photo to this gallery category.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            + Add Photo Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              {/* Photo Preview Container */}
              <div className="aspect-4/3 bg-slate-900 relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                {/* Category Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="bg-slate-950/80 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                    {item.category}
                  </span>
                  {item.isFeatured && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-0.5 shadow-xs">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Quick Expand Button */}
                <button
                  type="button"
                  onClick={() => setPreviewItem(item)}
                  className="absolute bottom-3 right-3 p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-emerald-600 transition-colors shadow"
                  title="View full-size photo"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Photo Content: Clean Title Only */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
                    {item.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {item.location}
                      </span>
                    )}
                    {item.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {item.date}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 px-2.5 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Title / Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemToDelete(item)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative my-8 text-left animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                {editingId ? 'Update Existing Photo' : 'New Gallery Upload'}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                {editingId ? 'Edit Gallery Photo' : 'Add Photo to Gallery'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Public display shows only the photo title (write-ups have been removed).
              </p>
            </div>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Photo Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. European Scouting Match & Technical Assessment"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gallery Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as GalleryCategory })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Image Upload / URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo Source *
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Image URL or upload file below..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                    <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md text-xs font-semibold text-slate-700 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                      <Upload className="w-3.5 h-3.5 text-slate-600" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Image Preview Box */}
                  {formData.imageUrl && (
                    <div className="aspect-16/9 bg-slate-900 rounded-lg overflow-hidden border border-slate-200 relative">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] rounded font-mono">
                        Preview
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lisbon, Portugal"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date / Season (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2026 Season"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Featured Flag */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <span>Feature this photo prominently on the homepage gallery</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {saving ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{editingId ? 'Update Photo' : 'Save & Publish Photo'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative text-left animate-fade-in space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Delete Gallery Photo?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-slate-800">"{itemToDelete.title}"</span>? This will remove it from the homepage gallery and sync with Supabase.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={deleting}
                className="px-3.5 py-1.5 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-size Preview Lightbox */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="max-w-3xl w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white line-clamp-1">{previewItem.title}</h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                className="max-w-full max-h-[65vh] object-contain rounded"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
