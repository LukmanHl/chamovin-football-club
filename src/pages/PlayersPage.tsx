import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { api } from '../services/api';
import { Player, PlayingLevel } from '../types/index';

export const PlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState<string>('All');

  useEffect(() => {
    async function loadPlayers() {
      try {
        const data = await api.getPlayers();
        setPlayers(data);
      } catch (err) {
        console.error('Failed to load players:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlayers();
  }, []);

  const positions = ['All', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
  const levels = ['All', 'Professional', 'Semi-Professional', 'Amateur', 'Academy'];

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.nationality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPosition =
      positionFilter === 'All' ||
      player.primaryPosition.toLowerCase().includes(positionFilter.toLowerCase());

    const matchesLevel = levelFilter === 'All' || player.playingLevel === levelFilter;

    return matchesSearch && matchesPosition && matchesLevel;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-3">
            Roster & Scouting
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Represented Football Players
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-6">
            Explore verified player profiles represented or managed by Chamonvin Limited across academy, amateur, semi-professional, and professional tiers.
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-md border border-slate-800">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>All profiles published with verified authorization and guardian consent where applicable.</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="border-b border-slate-200 bg-slate-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by player name, nationality, club..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-slate-900"
              />
            </div>

            {/* Position filter buttons */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-semibold text-slate-500 mr-2 shrink-0">Position:</span>
              {positions.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPositionFilter(pos)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    positionFilter === pos
                      ? 'bg-slate-950 text-white font-semibold'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>

            {/* Playing level filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-semibold text-slate-500 mr-2 shrink-0">Level:</span>
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    levelFilter === lvl
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Players Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="p-16 text-center text-sm text-slate-500">
            Loading player directory...
          </div>
        ) : filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-emerald-600 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-4/3 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                    {player.photoUrl ? (
                      <>
                        <div
                          className="absolute inset-0 bg-cover bg-center blur-lg opacity-25 scale-110 pointer-events-none"
                          style={{ backgroundImage: `url(${player.photoUrl})` }}
                        />
                        <img
                          src={player.photoUrl}
                          alt={player.fullName}
                          className="relative z-10 w-full h-full object-contain p-2"
                          referrerPolicy="no-referrer"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-950">
                        <UserCheck className="w-12 h-12 opacity-30 mb-2" />
                        <span className="text-xs uppercase tracking-wider text-slate-400">Player Profile</span>
                      </div>
                    )}
                    {player.isFeatured && (
                      <span className="absolute top-3 left-3 z-20 bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-slate-900">{player.primaryPosition}</span>
                      <span>·</span>
                      <span>{player.nationality}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-semibold">{player.playingLevel}</span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-950 mb-2">
                      {player.fullName}
                    </h3>

                    {(player.yearOfBirth || player.dateOfBirth || player.age) && (
                      <p className="text-xs text-slate-500 mb-3">
                        <strong className="text-slate-700">Year of Birth:</strong>{' '}
                        {player.yearOfBirth || (player.dateOfBirth ? player.dateOfBirth.slice(0, 4) : player.age ? (new Date().getFullYear() - player.age) : '—')}
                      </p>
                    )}

                    {player.bio && (
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {player.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/players/${player.id}`}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-center text-white bg-slate-950 hover:bg-emerald-700 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>View Profile & Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Dignified Empty State */
          <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 sm:p-16 text-center max-w-2xl mx-auto my-8">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-950 mb-2">
              Official Player Directory
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Chamonvin Limited manages player portfolios under strict client confidentiality. Public profiles are published exclusively with authorized consent. If you are an athlete seeking representation, or a club scout seeking specific positions, please contact our team directly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/player-representation"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors"
              >
                Apply for Representation
              </Link>
              <Link
                to="/contact"
                className="px-5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Direct Scouting Inquiry
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
