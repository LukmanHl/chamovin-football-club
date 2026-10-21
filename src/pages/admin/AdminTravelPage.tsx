import React, { useState, useEffect } from 'react';
import { Compass, Plus, Edit, Trash2, MapPin, Calendar, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { api } from '../../services/api';
import { TravelPackage } from '../../types/index';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminTravelPage: React.FC = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
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

  const initialForm = {
    title: '',
    destination: '',
    coverImage: '/src/assets/images/hero_football_pitch_stands_1792410704308.jpg',
    duration: '',
    description: '',
    price: '',
    currency: 'GBP',
    travelDates: '',
    status: 'published' as 'published' | 'draft',
    inclusions: [] as string[],
    newInclusion: '',
    exclusions: [] as string[],
    newExclusion: ''
  };

  const [form, setForm] = useState(initialForm);

  const loadPackages = async () => {
    try {
      setLoading(true);
      const data = await api.getPackages();
      setPackages(data);
    } catch (err) {
      console.error('Failed to load packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: TravelPackage) => {
    setEditingId(pkg.id);
    setForm({
      title: pkg.title,
      destination: pkg.destination,
      coverImage: pkg.coverImage,
      duration: pkg.duration,
      description: pkg.description,
      price: pkg.price || '',
      currency: pkg.currency || 'GBP',
      travelDates: pkg.travelDates || '',
      status: pkg.status,
      inclusions: pkg.inclusions || [],
      newInclusion: '',
      exclusions: pkg.exclusions || [],
      newExclusion: ''
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
    if (!form.title || !form.destination || !form.duration) {
      setError('Please provide title, destination, and duration.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        destination: form.destination.trim(),
        coverImage: form.coverImage.trim(),
        duration: form.duration.trim(),
        description: form.description.trim(),
        price: form.price.trim() || undefined,
        currency: form.currency.trim() || undefined,
        travelDates: form.travelDates.trim() || undefined,
        status: form.status,
        inclusions: form.inclusions,
        exclusions: form.exclusions
      };

      if (editingId) {
        await api.updatePackage(editingId, payload);
        setFeedbackMsg({ type: 'success', text: `Travel package "${payload.title}" updated successfully!` });
      } else {
        await api.createPackage(payload);
        setFeedbackMsg({ type: 'success', text: `Travel package "${payload.title}" created successfully!` });
      }
      setIsModalOpen(false);
      await loadPackages();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save travel package');
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
      await api.deletePackage(deleteTarget.id);
      setFeedbackMsg({ type: 'success', text: `Package "${deleteTarget.title}" deleted successfully.` });
      setDeleteTarget(null);
      await loadPackages();
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
            Travel & Mobility
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            Travel Packages Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage sports delegations, tourist itineraries, package pricing, and public visibility.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Travel Package</span>
        </button>
      </div>

      {/* Package List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map(pkg => (
          <div key={pkg.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="aspect-16/9 bg-slate-900 relative">
                <img src={pkg.coverImage} alt={pkg.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  {pkg.destination}
                </span>
                <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  pkg.status === 'published' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'
                }`}>
                  {pkg.status}
                </span>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{pkg.duration}</span>
                  {pkg.price && <span>· {pkg.price} {pkg.currency}</span>}
                </div>
                <h3 className="text-lg font-bold text-slate-950">{pkg.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{pkg.description}</p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">ID: {pkg.id}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(pkg.id, pkg.title)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-950">
                {editingId ? 'Edit Travel Package' : 'Create New Travel Package'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">✕</button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Package Title *</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Madrid, Spain"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 7 Days / 6 Nights"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Indicative Price</label>
                  <input
                    type="text"
                    placeholder="e.g. Inquire or 1,200"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
                  <input
                    type="text"
                    placeholder="GBP, EUR, USD"
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Dates / Season</label>
                  <input
                    type="text"
                    placeholder="e.g. Summer 2026"
                    value={form.travelDates}
                    onChange={(e) => setForm({ ...form, travelDates: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="text-xs font-semibold text-slate-800 block">Cover Image</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-slate-500"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={form.coverImage}
                    onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
                {uploadingImage && <span className="text-[10px] text-emerald-700">Uploading...</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
                />
              </div>

              {/* Inclusions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Inclusions</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Hotel accommodation included"
                    value={form.newInclusion}
                    onChange={(e) => setForm({ ...form, newInclusion: e.target.value })}
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!form.newInclusion.trim()) return;
                      setForm({ ...form, inclusions: [...form.inclusions, form.newInclusion.trim()], newInclusion: '' });
                    }}
                    className="px-3 py-1.5 text-xs bg-slate-900 text-white rounded"
                  >
                    Add
                  </button>
                </div>
                <ul className="space-y-1">
                  {form.inclusions.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-xs bg-slate-50 p-1.5 rounded">
                      <span>✓ {item}</span>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, inclusions: form.inclusions.filter((_, i) => i !== idx) })}
                        className="text-red-500"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
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
                    {saving ? 'Saving...' : 'Save Package'}
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
        title="Delete Travel Package"
        message={`Are you sure you want to permanently delete the travel package "${deleteTarget?.title}"?`}
        confirmLabel="Yes, Delete Package"
        isLoading={deleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
