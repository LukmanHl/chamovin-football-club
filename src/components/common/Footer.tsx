import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img
                src={settings?.logoUrl || 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg'}
                alt="CHAMONVIN LIMITED"
                className="h-14 sm:h-16 w-auto max-w-[240px] object-contain rounded-lg bg-white/5 p-1.5 border border-white/10"
                referrerPolicy="no-referrer"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              International sports management firm specializing in football player representation,
              paired with bespoke travel, tours, flight reservations, and visa consultation.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{settings?.businessHours || 'Monday – Sunday: 24 Hours (24/7 Service)'}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{settings?.officeAddress || 'Address: California, USA'}</span>
              </p>
            </div>
          </div>

          {/* Sports Management Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Sports Management</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/sports-management" className="hover:text-emerald-400 transition-colors">
                  Player Representation
                </Link>
              </li>
              <li>
                <Link to="/players" className="hover:text-emerald-400 transition-colors">
                  Our Players Directory
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-emerald-400 transition-colors">
                  Media & Operations Gallery
                </Link>
              </li>
              <li>
                <Link to="/player-representation" className="hover:text-emerald-400 transition-colors">
                  Representation Inquiries
                </Link>
              </li>
              <li>
                <Link to="/sports-management" className="hover:text-emerald-400 transition-colors">
                  Club & Team Support
                </Link>
              </li>
              <li>
                <Link to="/sports-management" className="hover:text-emerald-400 transition-colors">
                  Career Planning & Scouting
                </Link>
              </li>
            </ul>
          </div>

          {/* Travel & Visa Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Travel & Visa</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/travel-tours" className="hover:text-emerald-400 transition-colors">
                  Travel & Tours
                </Link>
              </li>
              <li>
                <Link to="/visa-consultation" className="hover:text-emerald-400 transition-colors">
                  Visa Consultation
                </Link>
              </li>
              <li>
                <Link to="/flight-services" className="hover:text-emerald-400 transition-colors">
                  Flight Services & Booking
                </Link>
              </li>
              <li>
                <Link to="/travel-tours" className="hover:text-emerald-400 transition-colors">
                  Sports Group Delegations
                </Link>
              </li>
              <li>
                <Link to="/visa-consultation" className="hover:text-emerald-400 transition-colors">
                  Visitor & Work Visa Routes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Inquiries</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <a
                href="mailto:info@Chamonvin.com"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                title="Primary Inquiries Email"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{settings?.contactEmail || 'info@Chamonvin.com'}</span>
              </a>
              <a
                href="mailto:chamonvin@live.com"
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-[11px]"
                title="Alternative Email"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">chamonvin@live.com</span>
              </a>
              <a
                href="tel:+19099913946"
                className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                title="United States Office"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>+1(909)-991-3946</span>
              </a>
              <a
                href="tel:+2348145656705"
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-[11px]"
                title="International & West Africa Line"
              >
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>+2348145656705</span>
              </a>
              <a
                href="https://wa.me/2348145656705"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                <span>WhatsApp: +2348145656705</span>
              </a>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-block px-3 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-800 hover:bg-emerald-950 rounded-sm transition-colors"
                >
                  Book a Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {settings?.companyName || 'CHAMONVIN LIMITED'}. All rights reserved.</p>
          <div className="flex items-center gap-5 sm:gap-6 flex-wrap">
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              About Us
            </Link>
            <Link to="/terms-privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-privacy" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
