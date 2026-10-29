import React from 'react';
import { Camera, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HomeGallery } from '../components/common/HomeGallery';

export const GalleryPage: React.FC = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-white">
      {/* Page Hero Header */}
      <section className="relative py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Portfolio & Archives</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Media & Operations Gallery
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            A visual record of Chamonvin Limited's European scouting engagements, athletic conditioning camps, international sports delegations, and client representation milestones.
          </p>
        </div>
      </section>

      {/* Main Gallery Component */}
      <HomeGallery />

      {/* Action Footer Callout */}
      <section className="py-16 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl font-bold text-white">
            Partner with Chamonvin for International Football & Travel Excellence
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
            Whether seeking verified player representation or bespoke international travel and visa advisory, our team provides transparent, world-class consultation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 text-xs font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors"
            >
              Book a Consultation
            </Link>
            <Link
              to="/player-representation"
              className="px-6 py-3 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>Player Representation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
