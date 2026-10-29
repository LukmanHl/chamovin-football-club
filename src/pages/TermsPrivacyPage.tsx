import React from 'react';
import { useSettings } from '../context/SettingsContext';

export const TermsPrivacyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="bg-white min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Privacy Policy & Terms of Service
          </h1>
          <p className="text-xs text-slate-500 mt-2">Last updated: October 2026</p>
        </div>

        {/* Privacy Policy */}
        <section className="space-y-4 border-b border-slate-200 pb-10">
          <h2 className="text-xl font-bold text-slate-950">1. Privacy Policy & Client Data Protection</h2>
          <div className="text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              {settings?.content.privacyPolicy ||
                'Chamonvin Limited treats all client inquiries, player profiles, and documentation with strict confidentiality. Personal data collected via this website is utilized strictly for consulting services and client communication in compliance with international data privacy standards.'}
            </p>
            <p>
              <strong>Data Collection:</strong> We collect only necessary contact information, athletic playing backgrounds, or travel preferences submitted willingly through our inquiry portals.
            </p>
            <p>
              <strong>Confidentiality:</strong> Scouting documents, personal player background, and travel information are shared exclusively with authorized club scouts, sporting directors, or travel ticketing partners upon formal instruction.
            </p>
            <p>
              <strong>No Sale of Data:</strong> Chamonvin Limited never sells, leases, or trades user information to third-party marketing networks.
            </p>
          </div>
        </section>

        {/* Terms of Service */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-950">2. Terms of Service & Representation Guidelines</h2>
          <div className="text-sm text-slate-700 leading-relaxed space-y-3">
            <p>
              {settings?.content.termsConditions ||
                'By using this website or engaging Chamonvin Limited services, you agree to our terms of service and consulting guidelines.'}
            </p>
            <p>
              <strong>Representation Nature:</strong> Submitting an application or inquiry via this website does not constitute a binding representation agreement or guarantee of club trials, professional transfers, or athletic contracts.
            </p>
            <p>
              <strong>Accuracy of Client Data:</strong> Prospective players and travelers confirm that all submitted details, athletic statistics, and documents are truthful and accurate.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
