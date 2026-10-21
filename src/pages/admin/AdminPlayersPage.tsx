import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Upload,
  Link as LinkIcon,
  Eye,
  Star,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { Player, PlayerPosition, PlayingLevel } from '../../types/index';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminPlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // In-app Delete & Feedback State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const initialForm = {
    fullName: '',
    primaryPosition: 'Forward' as PlayerPosition,
    nationality: '',
    age: '',
    dateOfBirth: '',
    currentClub: '',
    preferredFoot: 'Right' as 'Left' | 'Right' | 'Both',
    playingLevel: 'Professional' as PlayingLevel,
    status: 'published' as 'published' | 'draft',
    isFeatured: false,
    photoUrl: '',
    bio: '',
    careerDetails: [] as string[],
    newCareerItem: '',
    videoUrl: ''
  };

  const [form, setForm] = useState(initialForm);

  const positions: PlayerPosition[] = [
    'Goalkeeper',
    'Center Back',
    'Right Back',
    'Left Back',
    'Defensive Midfielder',
    'Central Midfielder',
    'Attacking Midfielder',
    'Winger',
    'Forward',
    'Striker'
  ];

  const levels: PlayingLevel[] = ['Academy', 'Amateur', 'Semi-Professional', 'Professional'];

  const loadPlayers = async () => {
    try {
      setLoading(true);
      const data = await api.getPlayers();
      setPlayers(data);
    } catch (err) {
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (player: Player) => {
    setEditingId(player.id);
    setForm({
      fullName: player.fullName,
      primaryPosition: player.primaryPosition,
      nationality: player.nationality,
      age: player.age ? String(player.age) : '',
      dateOfBirth: player.dateOfBirth || '',
      currentClub: player.currentClub || '',
      preferredFoot: player.preferredFoot || 'Right',
      playingLevel: player.playingLevel,
      status: player.status,
      isFeatured: player.isFeatured,
      photoUrl: player.photoUrl,
      bio: player.bio,
      careerDetails: player.careerDetails || [],
      newCareerItem: '',
      videoUrl: player.videoUrl || ''
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setModalError(null);
    try {
      const res = await api.uploadImage(file);
      setForm(prev => ({ ...prev, photoUrl: res.url }));
    } catch (err: any) {
      setModalError(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddCareerItem = () => {
    if (!form.newCareerItem.trim()) return;
    setForm({
      ...form,
      careerDetails: [...form.careerDetails, form.newCareerItem.trim()],
      newCareerItem: ''
    });
  };

  const handleRemoveCareerItem = (index: number) => {
    setForm({
      ...form,
      careerDetails: form.careerDetails.filter((_, i) => i !== index)
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!form.fullName || !form.primaryPosition || !form.playingLevel || !form.nationality) {
      setModalError('Please fill in player full name, nationality, position, and playing level.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        primaryPosition: form.primaryPosition,
        nationality: form.nationality.trim(),
        age: form.age ? parseInt(form.age, 10) : undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        currentClub: form.currentClub.trim() || undefined,
        preferredFoot: form.preferredFoot,
        playingLevel: form.playingLevel,
        status: form.status,
        isFeatured: form.isFeatured,
        photoUrl: form.photoUrl.trim(),
        bio: form.bio.trim(),
        careerDetails: form.careerDetails,
        videoUrl: form.videoUrl.trim() || undefined
      };

      if (editingId) {
        await api.updatePlayer(editingId, payload);
        setFeedbackMsg({ type: 'success', text: `Player profile "${payload.fullName}" updated successfully!` });
      } else {
        await api.createPlayer(payload);
        setFeedbackMsg({ type: 'success', text: `Player profile "${payload.fullName}" created successfully!` });
      }

      setIsModalOpen(false);
      await loadPlayers();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setModalError(err.message || 'Failed to save player profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deletePlayer(deleteTarget.id);
      setFeedbackMsg({ type: 'success', text: `Profile for "${deleteTarget.name}" deleted successfully.` });
      setDeleteTarget(null);
      await loadPlayers();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: `Failed to delete player: ${err.message}` });
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (player: Player) => {
    const newStatus = player.status === 'published' ? 'draft' : 'published';
    try {
      await api.updatePlayer(player.id, { status: newStatus });
      await loadPlayers();
    } catch (err) {
      console.error('Status toggle failed:', err);
    }
  };

  const filtered = players.filter(p => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.nationality.toLowerCase().includes(search.toLowerCase()) ||
      (p.currentClub && p.currentClub.toLowerCase().includes(search.toLowerCase()));

    const matchesLevel = filterLevel === 'All' || p.playingLevel === filterLevel;
    const matchesStatus = filterStatus === 'All' || p.status === filterStatus;

    return matchesSearch && matchesLevel && matchesStatus;
  });

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

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
            Player Roster
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            Player Profiles Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, edit, publish, or draft official player profiles and scouting records.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Player Profile</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, nationality, club..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 text-xs">
          <span className="text-slate-500 font-semibold">Level:</span>
          {['All', ...levels].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterLevel === lvl
                  ? 'bg-slate-950 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}

          <span className="text-slate-500 font-semibold ml-2">Status:</span>
          {['All', 'published', 'draft'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                filterStatus === st
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Players Directory List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500">Loading players...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Player</th>
                  <th className="py-3.5 px-4">Position</th>
                  <th className="py-3.5 px-4">Level</th>
                  <th className="py-3.5 px-4">Nationality</th>
                  <th className="py-3.5 px-4">Club</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filtered.map(player => (
                  <tr key={player.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-slate-900 overflow-hidden shrink-0 border border-slate-200">
                          {player.photoUrl ? (
                            <img src={player.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Users className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-950 block">{player.fullName}</span>
                          {player.isFeatured && (
                            <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{player.primaryPosition}</td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {player.playingLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{player.nationality}</td>
                    <td className="py-3 px-4 text-slate-600">{player.currentClub || '—'}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(player)}
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded cursor-pointer ${
                          player.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {player.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(player)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                          title="Edit Profile"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(player.id, player.fullName)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-slate-500">
            No player profiles match your search criteria. Click &quot;Add New Player Profile&quot; above to create one.
          </div>
        )}
      </div>

      {/* Player Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-950">
                  {editingId ? 'Edit Player Profile' : 'Add New Player Profile'}
                </h3>
                <p className="text-xs text-slate-500">
                  Manage official player profiles, verified highlights, and publication status.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Adebayo"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nationality *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nigeria, France, England"
                    value={form.nationality}
                    onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Position *</label>
                  <select
                    value={form.primaryPosition}
                    onChange={(e) => setForm({ ...form, primaryPosition: e.target.value as PlayerPosition })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {positions.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Playing Level *</label>
                  <select
                    value={form.playingLevel}
                    onChange={(e) => setForm({ ...form, playingLevel: e.target.value as PlayingLevel })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    {levels.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Foot</label>
                  <select
                    value={form.preferredFoot}
                    onChange={(e) => setForm({ ...form, preferredFoot: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Both">Both Feet</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Club / Academy</label>
                  <input
                    type="text"
                    placeholder="e.g. Free Agent or club name"
                    value={form.currentClub}
                    onChange={(e) => setForm({ ...form, currentClub: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age / Date of Birth</label>
                  <input
                    type="text"
                    placeholder="e.g. 21 or 2004-06-12"
                    value={form.age}
                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Photo Upload & External URL */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-800 block">Player Photograph</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Upload Image File (JPG/PNG)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="text-xs w-full text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                    />
                    {uploadingImage && <span className="text-[10px] text-emerald-700">Uploading file...</span>}
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Or Enter Image URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={form.photoUrl}
                      onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {form.photoUrl && (
                  <div className="flex items-center gap-3 pt-2">
                    <img
                      src={form.photoUrl}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-md border border-slate-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="text-[11px] text-slate-500">Image preview confirmed</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Highlight Video URL</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={form.videoUrl}
                  onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Player Biography *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of player style, strengths, experience..."
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Verified Career Items */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Verified Career Highlights & Records
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. 2025 Regional Cup MVP, 18 League Goals"
                    value={form.newCareerItem}
                    onChange={(e) => setForm({ ...form, newCareerItem: e.target.value })}
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCareerItem}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-md"
                  >
                    Add Highlight
                  </button>
                </div>
                <ul className="space-y-1">
                  {form.careerDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded text-xs text-slate-700 border border-slate-100">
                      <span>• {detail}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCareerItem(idx)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Status and Featured Toggles */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.status === 'published'}
                      onChange={(e) => setForm({ ...form, status: e.target.checked ? 'published' : 'draft' })}
                      className="text-emerald-600 rounded"
                    />
                    <span>Publish to Website</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                      className="text-emerald-600 rounded"
                    />
                    <span>Mark as Featured</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md"
                  >
                    {saving ? 'Saving...' : editingId ? 'Update Profile' : 'Create Profile'}
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
        title="Delete Player Profile"
        message={`Are you sure you want to permanently delete the profile of "${deleteTarget?.name}"? This action will remove the profile from the player directory and database.`}
        confirmLabel="Yes, Delete Profile"
        isLoading={deleting}
        onConfirm={executeDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
