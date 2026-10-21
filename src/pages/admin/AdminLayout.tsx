import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Inbox,
  Compass,
  Newspaper,
  Palette,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export const AdminLayout: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="text-xs text-slate-400">Verifying administrator session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Player Management', path: '/admin/players', icon: Users },
    { label: 'Inquiries & Leads', path: '/admin/inquiries', icon: Inbox },
    { label: 'Travel Packages', path: '/admin/travel', icon: Compass },
    { label: 'News & Updates', path: '/admin/news', icon: Newspaper },
    { label: 'Hero & Appearance', path: '/admin/appearance', icon: Palette },
    { label: 'CMS & Settings', path: '/admin/settings', icon: Settings }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          <span className="font-bold text-sm uppercase">Admin Console</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-950 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-900 z-30`}
      >
        <div>
          {/* Brand header: Only the provided logo */}
          <div className="p-5 border-b border-slate-900 flex items-center justify-center">
            <Link to="/" title="View Live Website" className="inline-block">
              <img
                src={settings?.logoUrl || 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg'}
                alt="CHAMONVIN LIMITED"
                className="h-11 w-auto max-w-[180px] object-contain rounded bg-white/5 p-1 border border-white/10"
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-emerald-700 text-white'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile and Actions */}
        <div className="p-4 border-t border-slate-900 space-y-2">
          <div className="px-3 py-2 bg-slate-900/60 rounded-lg text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Signed in as</span>
            <span className="text-slate-200 font-semibold truncate block">{user.email}</span>
            <span className="text-[10px] text-emerald-400 font-mono">Role: {user.role}</span>
          </div>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
              <span>View Public Site</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
