import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Inbox,
  Compass,
  Newspaper,
  ArrowRight,
  Plane,
  Eye,
  PlusCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Database
} from 'lucide-react';
import { api } from '../../services/api';
import { Inquiry, AuditLog } from '../../types/index';
import { useSettings } from '../../context/SettingsContext';

export const AdminOverviewPage: React.FC = () => {
  const { settings } = useSettings();
  const [stats, setStats] = useState<any>(null);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const [statsData, inqData, logsData] = await Promise.all([
          api.getAdminStats(),
          api.getInquiries(),
          api.getAdminLogs()
        ]);
        setStats(statsData);
        setRecentInquiries(inqData.slice(0, 5));
        setRecentLogs(logsData.slice(0, 5));
      } catch (err) {
        console.error('Error fetching admin overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  const getStatusBadge = (status: Inquiry['status']) => {
    switch (status) {
      case 'new':
        return <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">New</span>;
      case 'in_progress':
        return <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">In Progress</span>;
      case 'awaiting_client':
        return <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Awaiting Client</span>;
      case 'completed':
        return <span className="text-[10px] font-bold uppercase text-slate-700 bg-slate-100 px-2 py-0.5 rounded">Completed</span>;
      case 'closed':
        return <span className="text-[10px] font-bold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Closed</span>;
      default:
        return null;
    }
  };

  const getCategoryLabel = (type: Inquiry['type']) => {
    switch (type) {
      case 'player_representation':
        return 'Player Representation';
      case 'sports_management':
        return 'Sports Management';
      case 'general_contact':
        return 'General Contact';
      case 'travel_tours':
        return 'Travel & Tours';
      case 'visa_consultation':
        return 'Visa Consultation';
      case 'flight_services':
        return 'Flight Services';
      default:
        return type;
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
            Chamonvin Limited Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            Administrative Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time management metrics, incoming client inquiries, and content controls.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/players"
            className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Player Profile</span>
          </Link>
          <Link
            to="/admin/gallery"
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-600" />
            <span>Media Gallery</span>
          </Link>
          <Link
            to="/admin/inquiries"
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1.5"
          >
            <Inbox className="w-3.5 h-3.5 text-emerald-600" />
            <span>Review Inquiries</span>
          </Link>
        </div>
      </div>

      {/* Live Counts Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Player Profiles</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 tabular-nums">
            {stats?.totalPlayers ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-2">
            <span className="text-emerald-700 font-semibold">{stats?.publishedPlayers ?? 0} Published</span>
            <span>·</span>
            <span>{stats?.draftPlayers ?? 0} Draft</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>New Player Leads</span>
            <Inbox className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 tabular-nums">
            {stats?.newPlayerInquiries ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            <span>Pending scout review</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Travel & Visa Inquiries</span>
            <Compass className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 tabular-nums">
            {stats?.travelVisaInquiries ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            <span>Active requests</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Flight Inquiries</span>
            <Plane className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-950 tabular-nums">
            {stats?.flightInquiries ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-2">
            <span>Ticketing desk</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 block">Total Inquiries Received</span>
          <span className="text-xl font-bold text-slate-900 tabular-nums">{stats?.totalInquiries ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 block">Unread Notifications</span>
          <span className="text-xl font-bold text-amber-600 tabular-nums">{stats?.unreadInquiries ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 block">Active Travel Packages</span>
          <span className="text-xl font-bold text-slate-900 tabular-nums">{stats?.activePackages ?? 0}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 block">Published Articles</span>
          <span className="text-xl font-bold text-slate-900 tabular-nums">{stats?.publishedNews ?? 0}</span>
        </div>
      </div>

      {/* Supabase Integration & Quick Sync Card */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Supabase Cloud Database</h3>
              {settings?.supabase?.connected ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  CONNECTED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  CREDENTIALS SETUP NEEDED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              {settings?.supabase?.connected
                ? 'Your website is linked to Supabase. Push the latest players, packages, news, and inquiries to your database tables anytime.'
                : 'Connect your Supabase project URL & API keys to enable cloud data storage and display all website data in your Supabase tables.'}
            </p>
          </div>
        </div>

        <Link
          to="/admin/settings"
          className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>{settings?.supabase?.connected ? 'Manage Supabase & Sync' : 'Connect Supabase Now'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Two Column Layout: Recent Inquiries & Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wide">
              Recent Client Inquiries
            </h2>
            <Link
              to="/admin/inquiries"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inq) => (
                <div key={inq.id} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-semibold text-slate-600">{inq.refNumber}</span>
                      {getStatusBadge(inq.status)}
                    </div>
                    <p className="text-sm font-bold text-slate-950 truncate">
                      {inq.clientName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {getCategoryLabel(inq.type)} · {inq.clientEmail}
                    </p>
                  </div>
                  <Link
                    to="/admin/inquiries"
                    className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-md transition-colors shrink-0"
                    title="View inquiry details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No client inquiries recorded yet. When visitors submit forms on the public site, they will appear here instantly.
              </div>
            )}
          </div>
        </div>

        {/* Audit Log & System Activity */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-950 uppercase tracking-wide">
              Recent Activity & Security Log
            </h2>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="p-4 space-y-3">
            {recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div key={log.id} className="text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="font-mono text-emerald-700 font-bold">{log.action}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-800 font-medium leading-snug">{log.details}</p>
                  <span className="text-[10px] text-slate-400">User: {log.user}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No recent activity logged.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
