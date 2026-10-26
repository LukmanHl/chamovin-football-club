import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Send, AlertCircle, Users, Briefcase, GraduationCap, Plane, Home, Award } from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';

export const VisaConsultationPage: React.FC = () => {
  const { settings } = useSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>('Visitor Visa Consultation');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    countryOfResidence: '',
    destinationCountry: '',
    visaCategory: 'Visitor Visa Consultation',
    travelPurpose: '',
    timeframe: '',
    consultationMethod: 'WhatsApp' as 'WhatsApp' | 'Phone' | 'Email' | 'Video Call',
    message: '',
    consent: false,
    company_fax: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{ ref: string; message: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const categories = [
    {
      title: 'Family Reunion Visa Consultation',
      icon: Home,
      desc: 'Procedural guidance on family joining visas, dependent applications, and marriage/partner sponsorship documentation.'
    },
    {
      title: 'Visitor & Tourist Visa Consultation',
      icon: Plane,
      desc: 'Advisory on short-stay tourist visas, family visit authorizations, and required financial and accommodation evidence.'
    },
    {
      title: 'Business Visa Consultation',
      icon: Briefcase,
      desc: 'Support for corporate travelers, conference attendees, and commercial delegations attending meetings abroad.'
    },
    {
      title: 'Study Visa Guidance',
      icon: GraduationCap,
      desc: 'Guidance on student visa compliance, institutional acceptance letter verifications, and financial sponsorship proofs.'
    },
    {
      title: 'Skilled Worker & Employment Pathways',
      icon: Users,
      desc: 'Consulting on points-based skilled migration requirements, eligible sponsor frameworks, and work authorization pathways.'
    },
    {
      title: 'Permanent Residency Pathway Guidance',
      icon: Award,
      desc: 'Overview of permanent residency criteria, continuous residence calculations, and initial procedural assessments.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.fullName || !form.email || !form.phone || !form.destinationCountry) {
      setFormError('Please fill in your name, email, phone, and intended destination country.');
      return;
    }

    if (!form.consent) {
      setFormError('Please accept the regulatory notice and consent to proceed.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitInquiry({
        type: 'visa_consultation',
        clientName: form.fullName,
        clientEmail: form.email,
        clientPhone: form.phone,
        countryOfResidence: form.countryOfResidence,
        details: {
          destinationCountry: form.destinationCountry,
          visaCategory: form.visaCategory,
          travelPurpose: form.travelPurpose,
          timeframe: form.timeframe,
          consultationMethod: form.consultationMethod,
          message: form.message
        },
        company_fax: form.company_fax
      });

      setSuccessResult({ ref: res.refNumber, message: res.message });
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
            Immigration & Travel Advisory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Visa & Immigration Consultation
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-6">
            Structured procedural assessment, documentation review, and strategic travel guidance for visitors, students, families, skilled workers, and international athletes.
          </p>
        </div>
      </div>

      {/* Prominent Regulatory Disclaimer Banner */}
      <section className="bg-amber-50 border-b border-amber-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed space-y-1">
              <strong className="font-bold uppercase tracking-wider block">Important Legal Notice & Consultation Disclaimer:</strong>
              <p>
                {settings?.content.visaDisclaimer ||
                  'All visa, entry clearance, and immigration decisions are made exclusively by the relevant national government authorities and consulates. Requirements, processing timelines, and eligibility criteria may change without notice. Chamonvin Limited provides procedural assessment, documentation guidance, and application consultation. Consultation does not guarantee visa approval, employment offers, or permanent residency.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
            Advisory Areas
          </span>
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Consultation Categories We Support
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Select a category below to pre-fill your consultation request.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.title;
            return (
              <div
                key={idx}
                className={`p-6 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-950 mb-2">{cat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">{cat.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.title);
                    setForm({ ...form, visaCategory: cat.title });
                    document.getElementById('visa-inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full py-2 px-3 text-xs font-semibold rounded-md transition-colors ${
                    isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {isSelected ? 'Selected for Inquiry' : 'Request Consultation in this Category'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visa Consultation Inquiry Form */}
      <section id="visa-inquiry-form" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
              Initial Assessment
            </span>
            <h2 className="text-2xl font-bold text-slate-950 mb-2">
              Visa Consultation Request Form
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Complete the initial details below to schedule a procedural consultation with our travel and visa advisory unit.
            </p>

            {successResult ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-slate-950">Consultation Request Submitted</h3>
                <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
                  {successResult.message}
                </p>
                <div className="p-3 bg-white border border-emerald-200 rounded-md max-w-xs mx-auto">
                  <span className="text-[11px] text-slate-500 uppercase block">Consultation Reference</span>
                  <span className="text-base font-mono font-bold text-emerald-800">{successResult.ref}</span>
                </div>
                <button
                  onClick={() => setSuccessResult(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                >
                  Submit Another Consultation Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="Your full legal name"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Country of Current Residence</label>
                    <input
                      type="text"
                      placeholder="e.g. Nigeria, Ghana, UK..."
                      value={form.countryOfResidence}
                      onChange={(e) => setForm({ ...form, countryOfResidence: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Intended Destination Country *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. United Kingdom, Canada, Schengen Area..."
                      value={form.destinationCountry}
                      onChange={(e) => setForm({ ...form, destinationCountry: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Type of Visa or Immigration Pathway *</label>
                    <select
                      value={form.visaCategory}
                      onChange={(e) => setForm({ ...form, visaCategory: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.title} value={c.title}>{c.title}</option>
                      ))}
                      <option value="Sports Trial Travel Visa">Sports Trial Travel Visa</option>
                      <option value="Other Eligible Pathway">Other Eligible Pathway</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Purpose of Travel</label>
                    <input
                      type="text"
                      placeholder="e.g. Academic study, sports tournament, family visit..."
                      value={form.travelPurpose}
                      onChange={(e) => setForm({ ...form, travelPurpose: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Consultation Method</label>
                    <select
                      value={form.consultationMethod}
                      onChange={(e) => setForm({ ...form, consultationMethod: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Phone">Phone Call</option>
                      <option value="Email">Email Communication</option>
                      <option value="Video Call">Video Call</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Case Details</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state your current passport nationality, previous visa history (if any), or specific questions..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                    />
                    <span className="text-[11px] text-slate-600 leading-relaxed">
                      I understand that Chamonvin Limited provides procedural documentation consultation and does not guarantee visa approval, entry grants, or government authorizations. I consent to be contacted for initial assessment.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? <span>Submitting...</span> : <><Send className="w-4 h-4" /><span>Submit Visa Consultation Request</span></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
