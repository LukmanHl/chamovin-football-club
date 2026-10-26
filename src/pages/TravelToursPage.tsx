import React, { useState, useEffect } from 'react';
import { Compass, CheckCircle2, XCircle, Calendar, MapPin, ArrowRight, Send, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { TravelPackage } from '../types/index';

export const TravelToursPage: React.FC = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<TravelPackage | null>(null);

  // Custom tour inquiry form
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    travelers: '1',
    preferredDates: '',
    message: '',
    company_fax: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ ref: string; message: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getPackages();
        setPackages(data);
      } catch (err) {
        console.error('Failed to load travel packages:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name || !form.email || !form.phone) {
      setFormError('Please provide your name, email, and contact telephone number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitInquiry({
        type: 'travel_tours',
        clientName: form.name,
        clientEmail: form.email,
        clientPhone: form.phone,
        details: {
          packageId: selectedPkg?.id || 'custom',
          packageTitle: selectedPkg?.title || 'Custom Tour Planning',
          destination: form.destination || selectedPkg?.destination || 'Not specified',
          travelers: form.travelers,
          preferredDates: form.preferredDates,
          message: form.message
        },
        company_fax: form.company_fax
      });

      setSubmitResult({ ref: res.refNumber, message: res.message });
      setSelectedPkg(null);
    } catch (err: any) {
      setFormError(err.message || 'Submission error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-3">
            Bespoke Mobility & Tours
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            International Travel & Tour Services
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Professional travel planning, athletic delegation itineraries, vacation tours, and corporate travel arrangements tailored for seamless global journeys.
          </p>
        </div>
      </div>

      {/* Overview Services Strip */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Athletic Delegations</span>
              <p className="text-slate-600">Sports tours, trial matches, academy cohorts, and training camp logistics.</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Corporate & Business</span>
              <p className="text-slate-600">Executive summits, commercial conferences, and cross-border business itineraries.</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Family & Vacation</span>
              <p className="text-slate-600">Custom family holiday packages, guided excursions, and accommodation guidance.</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Documentation Guidance</span>
              <p className="text-slate-600">Complete pre-travel clearance, itinerary structuring, and documentation checks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Travel Packages */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
            Curated Itineraries
          </span>
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Featured Travel & Sports Tour Packages
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Managed directly by Chamonvin Limited travel coordinators. Custom itineraries arranged on request.
          </p>
        </div>

        {loading ? (
          <div className="p-16 text-center text-sm text-slate-500">Loading travel packages...</div>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-600 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/9 bg-slate-900 relative">
                    <img
                      src={pkg.coverImage}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-md flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{pkg.destination}</span>
                    </div>
                    {pkg.price && (
                      <div className="absolute bottom-4 right-4 bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-xs">
                        {pkg.price} {pkg.currency ? `(${pkg.currency})` : ''}
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">{pkg.duration}</span>
                      {pkg.travelDates && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <Calendar className="w-3 h-3 text-emerald-600" />
                            {pkg.travelDates}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-950">
                      {pkg.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pkg.description}
                    </p>

                    {pkg.inclusions && pkg.inclusions.length > 0 && (
                      <div className="pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Key Inclusions
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {pkg.inclusions.map((inc, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0">
                  <button
                    onClick={() => {
                      setSelectedPkg(pkg);
                      setForm({
                        ...form,
                        destination: pkg.destination
                      });
                      // Scroll to form
                      document.getElementById('travel-inquiry-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-950 hover:bg-emerald-700 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Request Details for This Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-xl">
            Custom tour packages are currently being updated. Inquire below for bespoke travel itineraries.
          </div>
        )}
      </section>

      {/* Travel Inquiry Form Section */}
      <section id="travel-inquiry-section" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
              Tailored Consultation
            </span>
            <h2 className="text-2xl font-bold text-slate-950 mb-2">
              {selectedPkg ? `Inquire About: ${selectedPkg.title}` : 'Request a Custom Travel & Tour Consultation'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Our travel specialists will review your itinerary goals, dates, and group size to prepare personalized travel options.
            </p>

            {submitResult ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-950">Travel Inquiry Submitted</h3>
                <p className="text-xs sm:text-sm text-slate-700">{submitResult.message}</p>
                <p className="text-xs font-mono font-bold text-emerald-800">Reference: {submitResult.ref}</p>
                <button
                  onClick={() => setSubmitResult(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <input
                  type="text"
                  name="company_fax"
                  value={form.company_fax}
                  onChange={(e) => setForm({ ...form, company_fax: e.target.value })}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
                    <input
                      type="text"
                      required
                      placeholder="+1(909)-991-3946 or +234..."
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Destination</label>
                    <input
                      type="text"
                      placeholder="e.g. Madrid, London, Dubai..."
                      value={form.destination}
                      onChange={(e) => setForm({ ...form, destination: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Travelers Count</label>
                    <input
                      type="number"
                      min="1"
                      value={form.travelers}
                      onChange={(e) => setForm({ ...form, travelers: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Dates or Season</label>
                  <input
                    type="text"
                    placeholder="e.g. July 2026 or Spring 2027"
                    value={form.preferredDates}
                    onChange={(e) => setForm({ ...form, preferredDates: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Requirements / Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Describe specific sports facilities needed, hotel preferences, or tour goals..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? <span>Submitting...</span> : <><Send className="w-4 h-4" /><span>Submit Travel Consultation Request</span></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
