import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, AlertCircle, Send, FileText, Lock } from 'lucide-react';
import { api } from '../services/api';
import { PlayerPosition, PlayingLevel } from '../types/index';

export const PlayerRepresentationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    countryOfResidence: '',
    dateOfBirth: '',
    playingLevel: 'Amateur' as PlayingLevel,
    primaryPosition: 'Forward' as PlayerPosition,
    currentClub: '',
    experienceSummary: '',
    portfolioUrl: '',
    goalsMessage: '',
    consent: false,
    company_fax: '' // honeypot
  });

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<{ refNumber: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in your full name, email address, and phone/WhatsApp number.');
      return;
    }

    if (!formData.consent) {
      setErrorMessage('You must consent to the processing of your representation inquiry.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.submitInquiry({
        type: 'player_representation',
        clientName: formData.fullName,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        countryOfResidence: formData.countryOfResidence,
        details: {
          dateOfBirth: formData.dateOfBirth,
          playingLevel: formData.playingLevel,
          primaryPosition: formData.primaryPosition,
          currentClub: formData.currentClub,
          experienceSummary: formData.experienceSummary,
          portfolioUrl: formData.portfolioUrl,
          goalsMessage: formData.goalsMessage
        },
        company_fax: formData.company_fax
      });

      setSuccessResult({
        refNumber: res.refNumber,
        message: res.message
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-3">
            Talent Onboarding
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Become a Represented Player
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Submit your profile for review by Chamonvin Limited sports management. We assess amateur, semi-professional, professional, and emerging academy talents pursuing structured international careers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Representation Process Explainer / Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-slate-950">
                Representation Intake Procedure
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We review every application thoroughly. To maximize evaluation speed, provide authentic video footage, match links, and accurate details of your playing background.
              </p>
              <div className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <p>
                    <strong className="text-slate-900 block">Profile Evaluation:</strong>
                    Our scouting directors review video reels and performance records.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <p>
                    <strong className="text-slate-900 block">Interview & Assessment:</strong>
                    Direct communication with the player and guardians (for youth talents).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <p>
                    <strong className="text-slate-900 block">Strategic Representation:</strong>
                    Formal agreement and formulation of career development pathways.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy and Non-Publication Guarantee */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-xs text-emerald-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>Strict Confidentiality Guaranteed</span>
              </div>
              <p className="leading-relaxed">
                Submitted player applications are kept private and confidential. Your information is never published publicly without explicit contractual authorization and verified consent.
              </p>
            </div>
          </div>

          {/* Inquiry Form / Right Column */}
          <div className="lg:col-span-7">
            {successResult ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-8 sm:p-12 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-950">
                  Representation Inquiry Received
                </h3>
                <p className="text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
                  {successResult.message}
                </p>
                <div className="p-4 bg-white rounded-lg border border-emerald-200 max-w-xs mx-auto">
                  <span className="text-xs text-slate-500 uppercase tracking-wider block">
                    Your Reference Number
                  </span>
                  <span className="text-lg font-mono font-bold text-emerald-800">
                    {successResult.refNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Please keep this reference for any correspondence with our management staff.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSuccessResult(null);
                      setFormData({
                        fullName: '',
                        email: '',
                        phone: '',
                        countryOfResidence: '',
                        dateOfBirth: '',
                        playingLevel: 'Amateur',
                        primaryPosition: 'Forward',
                        currentClub: '',
                        experienceSummary: '',
                        portfolioUrl: '',
                        goalsMessage: '',
                        consent: false,
                        company_fax: ''
                      });
                    }}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    Submit Another Application
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-xs space-y-6">
                <h2 className="text-2xl font-bold text-slate-950 pb-2 border-b border-slate-200">
                  Player Representation Application
                </h2>

                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Honeypot field (hidden from users) */}
                <input
                  type="text"
                  name="company_fax"
                  value={formData.company_fax}
                  onChange={(e) => setFormData({ ...formData, company_fax: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. David Mensah"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. player@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +44 7700 900192"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Country of Residence
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. United Kingdom, Ghana, France..."
                      value={formData.countryOfResidence}
                      onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Playing Level *
                    </label>
                    <select
                      value={formData.playingLevel}
                      onChange={(e) => setFormData({ ...formData, playingLevel: e.target.value as PlayingLevel })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      {levels.map((lvl) => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Primary Position *
                    </label>
                    <select
                      value={formData.primaryPosition}
                      onChange={(e) => setFormData({ ...formData, primaryPosition: e.target.value as PlayerPosition })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      {positions.map((pos) => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Current Club / Academy (if applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Free Agent or current team name"
                    value={formData.currentClub}
                    onChange={(e) => setFormData({ ...formData, currentClub: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Highlight Video Link / Online Profile URL
                  </label>
                  <input
                    type="url"
                    placeholder="YouTube, Vimeo, Wyscout, or portfolio link"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Strongly recommended: highlight videos accelerate scout review.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Football Experience & Match History
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe competitive leagues played, tournaments, honors, or academy training..."
                    value={formData.experienceSummary}
                    onChange={(e) => setFormData({ ...formData, experienceSummary: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Career Goals & What You Seek from Chamonvin Limited
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your short and long-term athletic goals..."
                    value={formData.goalsMessage}
                    onChange={(e) => setFormData({ ...formData, goalsMessage: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                {/* Privacy Consent */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      I consent to Chamonvin Limited reviewing my submitted sporting information and contacting me regarding sports management. I understand this inquiry does not constitute a guaranteed contract.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-6 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Representation Application</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
