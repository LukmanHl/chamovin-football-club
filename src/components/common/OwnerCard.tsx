import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, Mail, Phone, MessageSquare, Linkedin, ExternalLink, Quote, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { OwnerProfile } from '../../types/index';

interface OwnerCardProps {
  layout?: 'full' | 'compact' | 'featured';
  className?: string;
}

export const OwnerCard: React.FC<OwnerCardProps> = ({ layout = 'full', className = '' }) => {
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchOwner() {
      try {
        const data = await api.getOwnerProfile();
        if (isMounted) setProfile(data);
      } catch (err) {
        console.warn('Failed to load owner profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchOwner();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <div className={`p-8 bg-slate-900/60 rounded-2xl border border-slate-800 animate-pulse text-center ${className}`}>
        <div className="w-24 h-24 bg-slate-800 rounded-full mx-auto mb-4" />
        <div className="h-4 bg-slate-800 rounded w-1/3 mx-auto mb-2" />
        <div className="h-3 bg-slate-800 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (!profile || !profile.isPublished) return null;

  if (layout === 'compact') {
    return (
      <div className={`bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 text-white rounded-2xl border border-slate-800 p-6 sm:p-8 relative overflow-hidden shadow-xl ${className}`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-500/50 shadow-lg bg-slate-950">
              <img
                src={profile.photoUrl}
                alt={profile.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
              Founder
            </div>
          </div>
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Executive Leadership</span>
            </div>
            <h3 className="text-xl font-bold text-white">{profile.fullName}</h3>
            <p className="text-xs text-emerald-300 font-medium">{profile.roleTitle}</p>
            {profile.quote && (
              <p className="text-xs text-slate-300 italic pt-2 line-clamp-2">
                "{profile.quote}"
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12 items-center">
        {/* Left Column: Portrait & Direct Contact */}
        <div className="lg:col-span-5 flex flex-col items-center text-center space-y-5">
          <div className="relative">
            {/* Ambient glow behind portrait */}
            <div
              className="absolute inset-0 rounded-2xl bg-cover bg-center blur-xl opacity-30 scale-105 pointer-events-none"
              style={{ backgroundImage: `url(${profile.photoUrl})` }}
            />
            <div className="relative w-56 h-64 sm:w-64 sm:h-72 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl bg-slate-950 p-1.5">
              <img
                src={profile.photoUrl}
                alt={profile.fullName}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[11px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg border border-emerald-400/30 flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Profile</span>
            </div>
          </div>

          <div className="pt-2 space-y-1">
            <h3 className="text-2xl font-black text-white tracking-tight">{profile.fullName}</h3>
            <p className="text-emerald-400 font-semibold text-xs sm:text-sm">{profile.roleTitle}</p>
            {profile.secondaryTitle && (
              <p className="text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">{profile.secondaryTitle}</p>
            )}
          </div>

          {/* Direct Communication Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 w-full max-w-xs">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="px-3.5 py-2 bg-slate-900 hover:bg-emerald-950 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-all border border-slate-700/80 hover:border-emerald-500/60 flex items-center gap-2 shadow-sm flex-1 justify-center"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Direct Email</span>
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-2 shadow-sm flex-1 justify-center"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>

          {/* Social Links */}
          {(profile.linkedinUrl || profile.twitterUrl || profile.instagramUrl) && (
            <div className="flex items-center gap-3 pt-1 text-slate-400 text-xs">
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Bio, Vision, Quote & Credentials */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Founder Quote */}
          {profile.quote && (
            <div className="bg-slate-900/90 border-l-4 border-emerald-500 p-5 sm:p-6 rounded-r-2xl relative shadow-md">
              <Quote className="w-7 h-7 text-emerald-500/30 absolute top-4 right-4" />
              <p className="text-xs sm:text-sm font-medium italic text-emerald-100/90 leading-relaxed">
                "{profile.quote}"
              </p>
              <div className="mt-3 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                — {profile.fullName}, {profile.roleTitle}
              </div>
            </div>
          )}

          {/* Bio Narrative */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Leadership Vision & Philosophy</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {profile.bio}
            </p>
          </div>

          {/* Credentials / Pillars */}
          {profile.credentials && profile.credentials.length > 0 && (
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-500" />
                <span>Directorate Qualifications & Pillars</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {profile.credentials.map((cred, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-900/70 border border-slate-800 rounded-xl text-xs text-slate-200"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="font-medium">{cred}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
