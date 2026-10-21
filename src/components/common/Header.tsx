import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ChevronDown } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Sports Management', path: '/sports-management' },
    { label: 'Our Players', path: '/players' },
    { label: 'Player Representation', path: '/player-representation' },
    { label: 'Travel & Tours', path: '/travel-tours' },
    { label: 'Visa Consultation', path: '/visa-consultation' },
    { label: 'Flight Services', path: '/flight-services' },
    { label: 'News & Updates', path: '/news' },
    { label: 'Contact Us', path: '/contact' }
  ];

  // For desktop, primary direct links and secondary in a clean quick menu to maintain 1-row layout integrity
  const primaryNav = navLinks.slice(0, 6);
  const secondaryNav = navLinks.slice(6);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo: Only the provided logo image */}
          <Link to="/" className="flex items-center shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md py-1">
            <img
              src={settings?.logoUrl || 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg'}
              alt="CHAMONVIN LIMITED"
              className="h-12 sm:h-14 w-auto max-w-[220px] object-contain rounded-md"
              referrerPolicy="no-referrer"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-slate-700">
            {primaryNav.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive(link.path)
                    ? 'text-emerald-700 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600'
                    : 'hover:text-slate-950'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* More Services Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 200)}
                className={`flex items-center gap-1 whitespace-nowrap shrink-0 py-1 transition-colors ${
                  secondaryNav.some((l) => isActive(l.path))
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <span>Services & Media</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 shadow-lg rounded-lg py-2 z-50">
                  {secondaryNav.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`block px-4 py-2 text-xs font-medium transition-colors ${
                        isActive(item.path)
                          ? 'bg-emerald-50 text-emerald-800 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Action Zone: Book Consultation Button */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-md shadow-xs transition-all whitespace-nowrap shrink-0"
            >
              Book a Consultation
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:text-slate-950 rounded-md"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center px-4 py-2.5 text-sm font-semibold text-white bg-emerald-700 rounded-md hover:bg-emerald-800"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
