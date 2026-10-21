import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Trophy, ArrowRight, UserCheck, Briefcase, FileSpreadsheet, Network, Award, Sparkles } from 'lucide-react';

export const SportsManagementPage: React.FC = () => {
  const services = [
    {
      title: 'Amateur Player Representation',
      icon: UserCheck,
      desc: 'Guiding dedicated grassroots talents through athletic development, training discipline, and preparation for competitive trials.'
    },
    {
      title: 'Semi-Professional Player Management',
      icon: Trophy,
      desc: 'Bridging the transition between regional leagues and higher-tier competitive football with focused career roadmaps.'
    },
    {
      title: 'Professional Player Representation',
      icon: Award,
      desc: 'Comprehensive career management, contract review coordination, performance profiling, and elite sports guidance.'
    },
    {
      title: 'Football Manager & Coach Representation',
      icon: Briefcase,
      desc: 'Advisory and representation services for football coaches, technical directors, and team staff seeking suitable appointments.'
    },
    {
      title: 'Team & Club Support',
      icon: Network,
      desc: 'Liaison services connecting clubs with talent networks, friendly exhibition organizing, and scouting intelligence.'
    },
    {
      title: 'Scouting & Professional Profile Preparation',
      icon: FileSpreadsheet,
      desc: 'Curating verified video reels, match statistics, athletic metrics, and professional bios tailored for club scouts.'
    },
    {
      title: 'Career Planning & Guidance',
      icon: Sparkles,
      desc: 'Long-term development strategies ensuring players make informed, sound decisions on and off the pitch.'
    },
    {
      title: 'International Opportunity Support',
      icon: ShieldCheck,
      desc: 'Supporting players pursuing international trials and competitions with travel coordination and verified paperwork.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-3">
            Sports Management Division
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Professional Football Management & Player Representation
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            Empowering football players, coaches, and clubs through strategic representation, verified profiling, and sustainable career guidance across all competitive tiers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/player-representation"
              className="px-6 py-3 text-xs sm:text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-md transition-colors"
            >
              Request Sports Management Support
            </Link>
            <Link
              to="/players"
              className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors"
            >
              View Player Directory
            </Link>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
            Scope of Service
          </span>
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            How We Support Footballers & Clubs
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Dedicated on-pitch representation and off-pitch career stewardship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-emerald-600 transition-all hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-950 mb-2">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Representation Standards & Ethical Commitment */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-4">
            <h3 className="text-xl font-bold text-slate-950">
              Ethical Representation & Professional Transparency
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              At Chamonvin Limited, we uphold the highest international ethical standards in sports representation. We operate transparently with players, parents, academies, and clubs.
            </p>
            <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
              <strong className="font-semibold block mb-1">Important Notice on Representation:</strong>
              Chamonvin Limited does not guarantee professional contracts, trials, transfers, or athletic salaries. Sports management is based on merit, performance evaluation, club requirements, and mutual agreement between sporting institutions and athletes.
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Are you a player seeking representation or a club seeking talent?
              </span>
              <Link
                to="/player-representation"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors inline-flex items-center gap-2"
              >
                <span>Request Sports Management Support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
