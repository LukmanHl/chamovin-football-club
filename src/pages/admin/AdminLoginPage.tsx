import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email: email.trim(), password });
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block mb-4">
          <img
            src={settings?.logoUrl || 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg'}
            alt="CHAMONVIN LIMITED"
            className="h-16 w-auto max-w-[240px] object-contain rounded-lg bg-white/10 p-2 mx-auto border border-white/10 shadow-md"
            referrerPolicy="no-referrer"
          />
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Authorized Staff Portal
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Secure administration and content management system.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl py-8 px-6 sm:px-10 shadow-2xl">
          {error && (
            <div className="mb-6 p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@chamonvin.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Secure Portal Security Notice */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Encrypted administrative session. Authorized personnel only.</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
