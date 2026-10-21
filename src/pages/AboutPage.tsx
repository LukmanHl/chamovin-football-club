import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Target, Eye, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { OwnerCard } from '../components/common/OwnerCard';

export const AboutPage: React.FC = () => {
  const { settings } = useSettings();
  const content = settings?.content;

  return (
    <div className="bg-white">
      {/* Page Header */}
      <div className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-3">
            Company Profile
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            About Chamonvin Limited
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            An international sports management firm and travel-visa consultancy dedicated to client-first excellence, professional integrity, and global career mobility.
          </p>
        </div>
      </div>

      {/* Main Overview Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6 text-slate-700 leading-relaxed text-base sm:text-lg">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Our Clients' Priorities Come First, Every Time.
            </h2>
            <p className="font-medium text-slate-900">
              {content?.aboutOverview ||
                "At Chamonvin Limited, our clients' priorities come first, every time. Chamonvin Limited is an international/global sports management firm specializing in soccer, football, and player representation, with extended services in travel and visa consultation."}
            </p>
            <p>
              We represent amateur players, semi-professional players, professional players, managers, and teams. We continuously provide dedicated, high-quality service to our clients, whether on or off the pitch.
            </p>
            <p>
              We understand what it takes to pursue success at the highest level. We help our clients navigate their careers, identify suitable opportunities, and make informed decisions at every stage of their journey.
            </p>
            <div className="p-6 bg-slate-50 border-l-4 border-emerald-600 rounded-r-lg space-y-2">
              <p className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                Our Number-One Priority
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                Chamonvin Limited is committed to helping clients access suitable opportunities through professional support, communication, and personalized service.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-lg border border-slate-800 space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
              Core Principles
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white">Absolute Confidentiality</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Protecting private scouting records, player profiles, and client personal documentation.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white">Pragmatic Integrity</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We never make false promises of guaranteed trials, contracts, or visa approvals. Every recommendation is realistic and verified.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white">360° Athlete & Traveler Care</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Synchronizing on-pitch athletic representation with real-world relocation logistics, flights, and travel visas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values Grid */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Our Mission</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {content?.aboutMission ||
                  'Our mission is to empower footballers and international travelers through rigorous professional support, ethical career guidance, personalized attention, and transparent consultation that unlocks eligible global opportunities.'}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Our Vision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {content?.aboutVision ||
                  'To be recognized worldwide as a premier sports management and bespoke travel consultancy firm celebrated for integrity, client success, and sustainable career longevity.'}
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Core Values</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {content?.aboutValues ||
                  'Client Priority, Absolute Integrity, International Excellence, Professional Confidentiality, and Long-Term Career Stewardship.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Leadership & Founder's Profile */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
              Governance & Directorate
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Executive Leadership
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Guided by extensive international football networks, ethical contract negotiations, and dedicated client stewardship across Europe and Africa.
            </p>
          </div>

          <OwnerCard layout="full" />
        </div>
      </section>

      {/* Two Divisions Detailed Overview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="border border-slate-200 rounded-xl p-8 sm:p-10 bg-white space-y-4">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              Division One
            </span>
            <h3 className="text-2xl font-bold text-slate-950">
              Sports Management & Player Representation
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We understand that a football career requires strategic, careful stewardship. From grassroots academy prospects to seasoned professional footballers, we provide contract advice, portfolio compilation, club liaison, and career path structuring.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Player profiling, statistical tracking & scouting compilation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Contract negotiation assistance within authorized frameworks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>International club networking across Europe and Africa</span>
              </li>
            </ul>
            <div className="pt-4">
              <Link
                to="/sports-management"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <span>Read Sports Management Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-8 sm:p-10 bg-white space-y-4">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              Division Two
            </span>
            <h3 className="text-2xl font-bold text-slate-950">
              Travel, Tours & Visa Consultancy
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              International sports and business require smooth, reliable cross-border travel. Our travel consultancy assists with individualized travel planning, flight bookings, tour groups, and comprehensive procedural consultation for visa applications.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Study, visitor, business, and skilled worker visa consultation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Family reunion consultation and permanent residency guidance</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Sports tour itineraries, group travel, and flight reservations</span>
              </li>
            </ul>
            <div className="pt-4">
              <Link
                to="/travel-tours"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <span>Read Travel & Tour Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
