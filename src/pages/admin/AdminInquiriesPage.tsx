import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  MessageSquare,
  Calendar,
  Download,
  Trash2,
  Mail,
  Phone,
  Globe,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import { Inquiry, InquiryStatus, InquiryType } from '../../types/index';
import { useAuth } from '../../context/AuthContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminInquiriesPage: React.FC = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail Modal / Drawer
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [followUpInput, setFollowUpInput] = useState('');

  // Delete & Feedback
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; ref: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const data = await api.getInquiries(categoryFilter, statusFilter);
      setInquiries(data);
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, [categoryFilter, statusFilter]);

  const openDetail = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setFollowUpInput(inq.followUpDate || '');
    // Mark as read if not read
    if (!inq.read) {
      api.updateInquiry(inq.id, { read: true });
      setInquiries(prev => prev.map(i => i.id === inq.id ? { ...i, read: true } : i));
    }
  };

  const handleStatusChange = async (newStatus: InquiryStatus) => {
    if (!selectedInquiry) return;
    setStatusUpdating(true);
    try {
      const updated = await api.updateInquiry(selectedInquiry.id, { status: newStatus });
      setSelectedInquiry(updated);
      setInquiries(prev => prev.map(i => i.id === updated.id ? updated : i));
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newNoteText.trim()) return;
    try {
      const updated = await api.updateInquiry(selectedInquiry.id, {
        newNote: { text: newNoteText.trim(), author: user?.name || user?.email || 'Admin' }
      });
      setSelectedInquiry(updated);
      setNewNoteText('');
      setInquiries(prev => prev.map(i => i.id === updated.id ? updated : i));
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleSaveFollowUp = async () => {
    if (!selectedInquiry) return;
    try {
      const updated = await api.updateInquiry(selectedInquiry.id, { followUpDate: followUpInput || null });
      setSelectedInquiry(updated);
      setInquiries(prev => prev.map(i => i.id === updated.id ? updated : i));
    } catch (err) {
      console.error('Failed to update follow-up date:', err);
    }
  };

  const handleDeleteClick = (id: string, ref: string) => {
    setDeleteTarget({ id, ref });
  };

  const executeDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteInquiry(deleteTarget.id);
      setSelectedInquiry(null);
      setDeleteTarget(null);
      setFeedbackMsg({ type: 'success', text: `Inquiry ${deleteTarget.ref} was permanently deleted.` });
      await loadInquiries();
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: `Delete failed: ${err.message}` });
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ['RefNumber', 'Type', 'Status', 'Date', 'ClientName', 'Email', 'Phone', 'Country'];
    const rows = inquiries.map(i => [
      i.refNumber,
      i.type,
      i.status,
      new Date(i.createdAt).toLocaleDateString(),
      `"${i.clientName.replace(/"/g, '""')}"`,
      i.clientEmail,
      i.clientPhone,
      `"${(i.countryOfResidence || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `chamonvin_inquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = inquiries.filter(i => {
    const q = search.toLowerCase();
    return (
      i.refNumber.toLowerCase().includes(q) ||
      i.clientName.toLowerCase().includes(q) ||
      i.clientEmail.toLowerCase().includes(q) ||
      i.clientPhone.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: InquiryStatus) => {
    switch (status) {
      case 'new':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">New</span>;
      case 'in_progress':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">In Progress</span>;
      case 'awaiting_client':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Awaiting Client</span>;
      case 'completed':
        return <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Completed</span>;
      case 'closed':
        return <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Closed</span>;
    }
  };

  const getCategoryLabel = (type: InquiryType) => {
    const map: Record<InquiryType, string> = {
      player_representation: 'Player Representation',
      sports_management: 'Sports Management',
      general_contact: 'General Contact',
      travel_tours: 'Travel & Tours',
      visa_consultation: 'Visa Consultation',
      flight_services: 'Flight Services'
    };
    return map[type] || type;
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
            Centralized Leads
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            Inquiry & Lead Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review player representation profiles, visa consultations, flight requests, and contact inquiries.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={inquiries.length === 0}
          className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-2 shadow-xs shrink-0 disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Export Inquiries CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, email, phone, reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-md bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Service Categories</option>
            <option value="player_representation">Player Representation</option>
            <option value="sports_management">Sports Management</option>
            <option value="travel_tours">Travel & Tours</option>
            <option value="visa_consultation">Visa Consultation</option>
            <option value="flight_services">Flight Services</option>
            <option value="general_contact">General Contact</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-md bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="awaiting_client">Awaiting Client</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-500">Loading inquiries...</div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filtered.map(inq => (
                  <tr
                    key={inq.id}
                    onClick={() => openDetail(inq)}
                    className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                      !inq.read ? 'bg-emerald-50/30 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono text-emerald-800">
                      {inq.refNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{getCategoryLabel(inq.type)}</td>
                    <td className="py-3.5 px-4 text-slate-950 font-bold">{inq.clientName}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-normal">
                      <div>{inq.clientEmail}</div>
                      <div>{inq.clientPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-normal">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(inq.status)}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(inq);
                        }}
                        className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-semibold text-[11px]"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-xs text-slate-500">
            No client inquiries recorded matching current filters.
          </div>
        )}
      </div>

      {/* Inquiry Detail Drawer / Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm font-bold text-emerald-800">{selectedInquiry.refNumber}</span>
                  {getStatusBadge(selectedInquiry.status)}
                </div>
                <h3 className="text-xl font-bold text-slate-950">
                  {getCategoryLabel(selectedInquiry.type)}
                </h3>
                <span className="text-[11px] text-slate-400">
                  Submitted: {new Date(selectedInquiry.createdAt).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            {/* Client Info Grid */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Client Full Name</span>
                <span className="font-bold text-slate-900 text-sm">{selectedInquiry.clientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Email</span>
                <a href={`mailto:${selectedInquiry.clientEmail}`} className="text-emerald-700 font-semibold hover:underline">
                  {selectedInquiry.clientEmail}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Phone / WhatsApp</span>
                <a href={`tel:${selectedInquiry.clientPhone}`} className="text-slate-900 font-semibold">
                  {selectedInquiry.clientPhone}
                </a>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Country of Residence</span>
                <span className="text-slate-900 font-semibold">{selectedInquiry.countryOfResidence || 'Not specified'}</span>
              </div>
            </div>

            {/* Submitted Form Details Payload */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Submitted Application Details
              </h4>
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2.5">
                {Object.entries(selectedInquiry.details || {}).map(([key, val]) => (
                  <div key={key} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <span className="font-semibold text-slate-600 capitalize block mb-0.5">
                      {key.replace(/([A-Z])/g, ' $1')}:
                    </span>
                    <span className="text-slate-900 whitespace-pre-line">
                      {typeof val === 'string' && val.startsWith('http') ? (
                        <a href={val} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-semibold">
                          {val}
                        </a>
                      ) : (
                        String(val || '—')
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Follow-Up Controller */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Status & Follow-Up Workflow</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Update Lead Status:</label>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleStatusChange(e.target.value as InquiryStatus)}
                    disabled={statusUpdating}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white font-medium"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="awaiting_client">Awaiting Client Response</option>
                    <option value="completed">Completed</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Follow-Up Target Date:</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={followUpInput}
                      onChange={(e) => setFollowUpInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleSaveFollowUp}
                      className="px-3 py-1.5 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Internal Staff Notes (PRIVATE) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Internal Notes & Scouting Log (Private)
                </span>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                  Visible only to staff
                </span>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedInquiry.internalNotes && selectedInquiry.internalNotes.length > 0 ? (
                  selectedInquiry.internalNotes.map(n => (
                    <div key={n.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-700">{n.author}</span>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">{n.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No internal notes added yet.</p>
                )}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add private internal note or call summary..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shrink-0"
                >
                  Add Note
                </button>
              </form>
            </div>

            {/* Footer with Delete and Close */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteClick(selectedInquiry.id, selectedInquiry.refNumber)}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Inquiry</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
