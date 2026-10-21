import React, { useState } from 'react';
import { Plane, Calendar, ShieldCheck, CheckCircle2, Send, AlertCircle, Clock, Users, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';

export const FlightServicesPage: React.FC = () => {
  const { settings } = useSettings();
  const [form, setForm] = useState({
    passengerName: '',
    email: '',
    phone: '',
    tripType: 'round_trip' as 'round_trip' | 'one_way',
    departureCity: '',
    destinationCity: '',
    departureDate: '',
    returnDate: '',
    travelersCount: '1',
    cabinClass: 'Economy' as 'Economy' | 'Premium Economy' | 'Business' | 'First',
    specialRequests: '',
    company_fax: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ref: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.passengerName || !form.email || !form.phone || !form.departureCity || !form.destinationCity || !form.departureDate) {
      setError('Please fill in passenger name, contact info, departure, destination, and departure date.');
      return;
    }

    if (form.tripType === 'round_trip' && !form.returnDate) {
      setError('Please select a return date for round-trip travel.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitInquiry({
        type: 'flight_services',
        clientName: form.passengerName,
        clientEmail: form.email,
        clientPhone: form.phone,
        details: {
          tripType: form.tripType,
          departureCity: form.departureCity,
          destinationCity: form.destinationCity,
          departureDate: form.departureDate,
          returnDate: form.returnDate,
          travelersCount: form.travelersCount,
          cabinClass: form.cabinClass,
          specialRequests: form.specialRequests
        },
        company_fax: form.company_fax
      });

      setResult({ ref: res.refNumber, message: res.message });
    } catch (err: any) {
      setError(err.message || 'Submission error. Please try again.');
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
            Air Travel Logistics
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Flight Ticket Reservation & Itinerary Assistance
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Personalized route scheduling, group athlete transit bookings, ticket reservation assistance, and corporate airline itinerary consultation.
          </p>
        </div>
      </div>

      {/* Distinction & Notice Strip */}
      <div className="bg-slate-50 border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-950 font-semibold block mb-0.5">Booking Inquiry vs Immediate Ticket Issuance:</strong>
              <p>
                {settings?.content.flightDisclaimer ||
                  'Submitting this flight request initiates an itinerary search and reservation review with our travel ticketing specialists. Chamonvin Limited does not charge credit cards on this form. Fares, baggage allotments, and schedules are confirmed directly with you before final ticket issuance.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Benefits */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2">Sports Group & Squad Travel</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Coordinated group seat blocks for football teams, coaches, equipment managers, and sports delegations.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2">Complex Route Planning</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Multi-leg international flight routing, optimal layover times, and transit visa advisory support.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-slate-200 bg-white">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2">Dedicated Ticketing Support</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Direct assistance with schedule adjustments, baggage allowance requests, and airline coordination.
            </p>
          </div>
        </div>
      </section>

      {/* Flight Inquiry Form */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
              Flight Schedule Consultation
            </span>
            <h2 className="text-2xl font-bold text-slate-950 mb-2">
              Flight Reservation Inquiry Form
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Enter your itinerary preferences below. Our flight desk will check airline availability and send you recommended flight itineraries.
            </p>

            {result ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-slate-950">Flight Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
                  {result.message}
                </p>
                <div className="p-3 bg-white border border-emerald-200 rounded-md max-w-xs mx-auto">
                  <span className="text-[11px] text-slate-500 uppercase block">Inquiry Reference</span>
                  <span className="text-base font-mono font-bold text-emerald-800">{result.ref}</span>
                </div>
                <button
                  onClick={() => setResult(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                >
                  Submit Another Flight Inquiry
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

                {/* Trip Type Selector */}
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      checked={form.tripType === 'round_trip'}
                      onChange={() => setForm({ ...form, tripType: 'round_trip' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Round Trip</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      checked={form.tripType === 'one_way'}
                      onChange={() => setForm({ ...form, tripType: 'one_way' })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>One Way</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Passenger Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="As shown on passport"
                      value={form.passengerName}
                      onChange={(e) => setForm({ ...form, passengerName: e.target.value })}
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Passengers</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={form.travelersCount}
                      onChange={(e) => setForm({ ...form, travelersCount: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Departure City or Airport *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. London Heathrow (LHR)"
                      value={form.departureCity}
                      onChange={(e) => setForm({ ...form, departureCity: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Destination City or Airport *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Madrid Barajas (MAD)"
                      value={form.destinationCity}
                      onChange={(e) => setForm({ ...form, destinationCity: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Departure Date *</label>
                    <input
                      type="date"
                      required
                      value={form.departureDate}
                      onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  {form.tripType === 'round_trip' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Return Date *</label>
                      <input
                        type="date"
                        required
                        value={form.returnDate}
                        onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Cabin Class</label>
                    <select
                      value={form.cabinClass}
                      onChange={(e) => setForm({ ...form, cabinClass: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      <option value="Economy">Economy</option>
                      <option value="Premium Economy">Premium Economy</option>
                      <option value="Business">Business</option>
                      <option value="First">First Class</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Requirements / Airline Preference</label>
                  <textarea
                    rows={2}
                    placeholder="Specific airlines, extra baggage requirements, direct flight preference..."
                    value={form.specialRequests}
                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? <span>Checking Routes...</span> : <><Send className="w-4 h-4" /><span>Submit Flight Reservation Inquiry</span></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
