import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Shield, CheckCircle2, Video, Trophy, Globe, Calendar, ArrowRight, Play } from 'lucide-react';
import { api } from '../services/api';
import { Player } from '../types/index';

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  // If user pasted an iframe tag, extract the src
  if (cleanUrl.startsWith('<iframe') && cleanUrl.includes('src=')) {
    const srcMatch = cleanUrl.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }

  // Support all YouTube URL patterns
  // Examples:
  // - https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // - https://youtu.be/dQw4w9WgXcQ
  // - https://www.youtube.com/embed/dQw4w9WgXcQ
  // - https://www.youtube.com/shorts/dQw4w9WgXcQ
  // - https://m.youtube.com/watch?v=dQw4w9WgXcQ
  // - https://www.youtube.com/live/dQw4w9WgXcQ
  const ytMatch = cleanUrl.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`;
  }

  // Vimeo support
  const vimeoMatch = cleanUrl.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Already an embed URL
  if (cleanUrl.includes('/embed/') || cleanUrl.includes('player.')) {
    return cleanUrl;
  }

  return null;
}

export const PlayerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await api.getPlayerById(id);
        setPlayer(data);
      } catch (err: any) {
        setError(err.message || 'Player profile not found or unpublished.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <p className="text-sm text-slate-500">Loading player profile...</p>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="max-w-md bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4">
          <Shield className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Profile Unavailable</h2>
          <p className="text-xs text-slate-600">
            {error || 'This player profile is either confidential, unpublished, or has been archived.'}
          </p>
          <button
            onClick={() => navigate('/players')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800"
          >
            Return to Player Roster
          </button>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(player.videoUrl);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-slate-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/players"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Players Directory</span>
          </Link>
          <span className="text-xs text-slate-400">Reference: {player.id}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Player Media / Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="min-h-[380px] sm:min-h-[440px] max-h-[560px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 shadow-md relative flex items-center justify-center p-3">
              {player.photoUrl ? (
                <>
                  {/* Subtle ambient blur behind the player so wide/tall photos look natural and premium */}
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-110 pointer-events-none"
                    style={{ backgroundImage: `url(${player.photoUrl})` }}
                  />
                  <img
                    src={player.photoUrl}
                    alt={player.fullName}
                    className="relative z-10 max-h-[500px] w-auto max-w-full h-auto object-contain mx-auto rounded-xl drop-shadow-md"
                    referrerPolicy="no-referrer"
                  />
                </>
              ) : (
                <div className="w-full min-h-[380px] flex items-center justify-center text-slate-500 bg-slate-950">
                  <User className="w-20 h-20 opacity-30" />
                </div>
              )}
              <div className="absolute top-4 left-4 z-20 flex gap-2">
                <span className="bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider">
                  {player.playingLevel}
                </span>
                {player.isFeatured && (
                  <span className="bg-slate-950/90 text-white text-xs font-bold px-2.5 py-1 rounded shadow-md uppercase tracking-wider border border-white/10">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Quick Specs Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3 text-xs sm:text-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-200">
                Player Specifications
              </h3>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Position</span>
                <span className="font-semibold text-slate-900">{player.primaryPosition}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nationality</span>
                <span className="font-semibold text-slate-900">{player.nationality}</span>
              </div>
              {player.currentClub && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Current Club</span>
                  <span className="font-semibold text-slate-900">{player.currentClub}</span>
                </div>
              )}
              {player.preferredFoot && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Preferred Foot</span>
                  <span className="font-semibold text-slate-900">{player.preferredFoot}</span>
                </div>
              )}
              {player.age && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Age</span>
                  <span className="font-semibold text-slate-900">{player.age} Years</span>
                </div>
              )}
              {player.dateOfBirth && (
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="font-semibold text-slate-900">{player.dateOfBirth}</span>
                </div>
              )}
            </div>

            {/* Video Highlight Reel Anchor */}
            {player.videoUrl && (
              <a
                href="#video-reel"
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <span>Jump to Video Reel Below</span>
              </a>
            )}
          </div>

          {/* Player Information / Right Column */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs text-slate-500 mb-2">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>{player.nationality}</span>
                <span>·</span>
                <span>{player.primaryPosition}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight mb-4">
                {player.fullName}
              </h1>
              <p className="text-sm font-semibold text-emerald-800 uppercase tracking-wide">
                Managed by Chamonvin Limited
              </p>
            </div>

            {/* Biography */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-950 pb-2 border-b border-slate-200">
                Player Biography & Profile
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {player.bio}
              </p>
            </div>

            {/* Verified Career Details / Achievements */}
            {player.careerDetails && player.careerDetails.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-950 pb-2 border-b border-slate-200">
                  Verified Career Highlights & Records
                </h2>
                <ul className="space-y-3">
                  {player.careerDetails.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* EMBEDDED YOUTUBE VIDEO REEL (Direct In-Page Playback) */}
            {player.videoUrl && (
              <div id="video-reel" className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                    <Video className="w-5 h-5 text-emerald-600" />
                    <span>Player Highlight Reel & Video Profile</span>
                  </h2>
                  <a
                    href={player.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>External Link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {embedUrl ? (
                  <div className="aspect-16/9 w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-300 shadow-md">
                    <iframe
                      src={embedUrl}
                      title={`${player.fullName} - Player Highlight Reel & Video Profile`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                    <Video className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="text-xs text-slate-600">Video portfolio is available at the provided link:</p>
                    <a
                      href={player.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 rounded-md hover:bg-emerald-800"
                    >
                      <span>Watch Highlight Video</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Scouting Contact Action Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
              <h3 className="text-base font-bold text-slate-950">
                Club Scouting & Representation Inquiries
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                For complete technical scouting reports, verified medical clearance records, or representation discussions regarding {player.fullName}, contact our management team directly.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/contact"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-950 hover:bg-emerald-700 rounded-md transition-colors inline-flex items-center gap-2"
                >
                  <span>Request Complete Player Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/player-representation"
                  className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Submit Representation Inquiry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
