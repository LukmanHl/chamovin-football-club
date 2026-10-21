import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';

export const ContactPage: React.FC = () => {
  const { settings } = useSettings();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    subject: '',
    message: '',
    company_fax: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ref: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.phone || !form.message) {
      setError('Please provide your name, email, telephone, and inquiry message.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitInquiry({
        type: 'general_contact',
        clientName: form.name,
        clientEmail: form.email,
        clientPhone: form.phone,
        details: {
          category: form.category,
          subject: form.subject,
          message: form.message
        },
        company_fax: form.company_fax
      });

      setResult({ ref: res.refNumber, message: res.message });
    } catch (err: any) {
      setError(err.message || 'Error submitting message. Please try again.');
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
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Contact Chamonvin Limited
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Our international management and consultation team is available to assist players, clubs, travelers, and corporate partners.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Company Details / Left */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-950 mb-4">
                Global Operations & Contact Points
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connect directly with our authorized staff. Inquiries are handled with confidentiality and answered promptly during operating business hours.
              </p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${settings?.contactEmail || 'contact@chamonvin.com'}`}
                    className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
                  >
                    {settings?.contactEmail || 'contact@chamonvin.com'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Telephone
                  </span>
                  <a
                    href={`tel:${settings?.contactPhone || '+442079460192'}`}
                    className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors"
                  >
                    {settings?.contactPhone || '+44 20 7946 0192'}
                  </a>
                </div>
              </div>

              {settings?.contactWhatsapp && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      WhatsApp Messaging
                    </span>
                    <a
                      href={`https://wa.me/${settings.contactWhatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                    >
                      {settings.contactWhatsapp}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Operating Hours
                  </span>
                  <span className="text-slate-700">
                    {settings?.businessHours || 'Monday – Friday: 08:30 – 18:00 (GMT)'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Office Address
                  </span>
                  <span className="text-slate-700">
                    {settings?.officeAddress || 'London & International Liaison Offices'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links to Dedicated Portals */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                Looking for Specific Applications?
              </span>
              <div className="space-y-2 text-xs">
                <Link
                  to="/player-representation"
                  className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md hover:border-emerald-600 transition-colors"
                >
                  <span className="font-semibold text-slate-900">Player Representation Form</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                </Link>
                <Link
                  to="/visa-consultation"
                  className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md hover:border-emerald-600 transition-colors"
                >
                  <span className="font-semibold text-slate-900">Visa Consultation Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                </Link>
                <Link
                  to="/flight-services"
                  className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-md hover:border-emerald-600 transition-colors"
                >
                  <span className="font-semibold text-slate-900">Flight Reservation Inquiry</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                </Link>
              </div>
            </div>
          </div>

          {/* General Contact Form / Right */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-xs">
              <h2 className="text-2xl font-bold text-slate-950 mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mb-6">
                Fill in the form below for general business inquiries, partnership requests, or consultation bookings.
              </p>

              {result ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-8 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-950">Message Sent Successfully</h3>
                  <p className="text-xs sm:text-sm text-slate-700">{result.message}</p>
                  <p className="text-xs font-mono font-bold text-emerald-800">Inquiry Reference: {result.ref}</p>
                  <button
                    onClick={() => setResult(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
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
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Full name"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        placeholder="+44 7700 900192"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Inquiry Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Sports Management">Sports Management</option>
                        <option value="Club Scouting & Networking">Club Scouting & Networking</option>
                        <option value="Travel & Tours">Travel & Tours</option>
                        <option value="Visa Consultation">Visa Consultation</option>
                        <option value="Flight Services">Flight Services</option>
                        <option value="Partnership & Sponsorship">Partnership & Sponsorship</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="Summary of inquiry"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Message *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="How can Chamonvin Limited assist you?..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? <span>Sending Message...</span> : <><Send className="w-4 h-4" /><span>Send Inquiry</span></>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
