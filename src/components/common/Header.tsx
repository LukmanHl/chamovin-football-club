import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Header: React.FC = () => {
  const { settings } = useSettings();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'sports' | 'travels' | null>(null);
  const [mobileSportsOpen, setMobileSportsOpen] = useState(true);
  const [mobileTravelsOpen, setMobileTravelsOpen] = useState(true);

  const sportsRef = useRef<HTMLDivElement>(null);
  const travelsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname, location.hash]);

  // Click outside to close desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sportsRef.current && !sportsRef.current.contains(e.target as Node) &&
        travelsRef.current && !travelsRef.current.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isSportsActive = () => {
    return (
      location.pathname.startsWith('/sports-management') ||
      location.pathname.startsWith('/players') ||
      location.pathname.startsWith('/player-representation')
    );
  };

  const isTravelsActive = () => {
    return (
      location.pathname.startsWith('/travel-tours') ||
      location.pathname.startsWith('/visa-consultation') ||
      location.pathname.startsWith('/flight-services')
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md py-1"
          >
            <img
              src={settings?.logoUrl || 'https://i.ibb.co/Kp7HY9pp/Whats-App-Image-2026-10-17-at-15-09-07.jpg'}
              alt="CHAMONVIN LIMITED"
              className="h-12 sm:h-14 w-auto max-w-[220px] object-contain rounded-md"
              referrerPolicy="no-referrer"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
            {/* 1. Home */}
            <Link
              to="/"
              className={`whitespace-nowrap transition-colors py-2 relative ${
                location.pathname === '/'
                  ? 'text-emerald-700 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600'
                  : 'hover:text-slate-950'
              }`}
            >
              Home
            </Link>

            {/* 2. About Us */}
            <Link
              to="/about"
              className={`whitespace-nowrap transition-colors py-2 relative ${
                isActive('/about')
                  ? 'text-emerald-700 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600'
                  : 'hover:text-slate-950'
              }`}
            >
              About Us
            </Link>

            {/* 3. Sport Management (with Submenu: Our Players, Player Representation) */}
            <div
              ref={sportsRef}
              className="relative"
              onMouseEnter={() => setOpenDropdown('sports')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'sports' ? null : 'sports')}
                className={`flex items-center gap-1.5 whitespace-nowrap py-2 transition-colors focus:outline-none cursor-pointer ${
                  isSportsActive()
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
                aria-expanded={openDropdown === 'sports'}
              >
                <span>Sport Management</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'sports' ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              {openDropdown === 'sports' && (
                <div className="absolute left-0 mt-1 w-60 bg-white border border-slate-200 shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <Link
                      to="/sports-management"
                      className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 block"
                    >
                      Sport Management Overview
                    </Link>
                  </div>
                  <Link
                    to="/players"
                    className={`block px-4 py-2.5 text-xs transition-colors hover:bg-emerald-50/70 ${
                      location.pathname.startsWith('/players') ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    <span className="block font-semibold text-slate-900 text-xs">Our Players</span>
                    <span className="block text-[11px] text-slate-500">Official Represented Talent Roster</span>
                  </Link>
                  <Link
                    to="/player-representation"
                    className={`block px-4 py-2.5 text-xs transition-colors hover:bg-emerald-50/70 ${
                      isActive('/player-representation') ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    <span className="block font-semibold text-slate-900 text-xs">Player Representation</span>
                    <span className="block text-[11px] text-slate-500">Career Advisory & Intake Application</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Gallery */}
            <Link
              to="/gallery"
              className={`whitespace-nowrap transition-colors py-2 relative ${
                location.pathname === '/gallery' || location.hash === '#gallery'
                  ? 'text-emerald-700 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600'
                  : 'hover:text-slate-950'
              }`}
            >
              Gallery
            </Link>

            {/* 5. Travels & Tours (with Submenu: Visa Consultation, Flight Services) */}
            <div
              ref={travelsRef}
              className="relative"
              onMouseEnter={() => setOpenDropdown('travels')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'travels' ? null : 'travels')}
                className={`flex items-center gap-1.5 whitespace-nowrap py-2 transition-colors focus:outline-none cursor-pointer ${
                  isTravelsActive()
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
                aria-expanded={openDropdown === 'travels'}
              >
                <span>Travels & Tours</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === 'travels' ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>

              {openDropdown === 'travels' && (
                <div className="absolute left-0 mt-1 w-60 bg-white border border-slate-200 shadow-xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <Link
                      to="/travel-tours"
                      className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 block"
                    >
                      Travels & Tours Overview
                    </Link>
                  </div>
                  <Link
                    to="/visa-consultation"
                    className={`block px-4 py-2.5 text-xs transition-colors hover:bg-emerald-50/70 ${
                      isActive('/visa-consultation') ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    <span className="block font-semibold text-slate-900 text-xs">Visa Consultation</span>
                    <span className="block text-[11px] text-slate-500">Study, Work, Tourist & Family Advisory</span>
                  </Link>
                  <Link
                    to="/flight-services"
                    className={`block px-4 py-2.5 text-xs transition-colors hover:bg-emerald-50/70 ${
                      isActive('/flight-services') ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:text-slate-950'
                    }`}
                  >
                    <span className="block font-semibold text-slate-900 text-xs">Flight Services</span>
                    <span className="block text-[11px] text-slate-500">Reservations & Itinerary Planning</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 6. Contact Us */}
            <Link
              to="/contact"
              className={`whitespace-nowrap transition-colors py-2 relative ${
                isActive('/contact')
                  ? 'text-emerald-700 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600'
                  : 'hover:text-slate-950'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Action Zone: Book Consultation Button */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0"
            >
              Book a Consultation
            </Link>

            {/* Mobile menu toggle button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-950 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto">
          {/* 1. Home */}
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
              location.pathname === '/'
                ? 'bg-emerald-50 text-emerald-800 font-semibold'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            Home
          </Link>

          {/* 2. About Us */}
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/about')
                ? 'bg-emerald-50 text-emerald-800 font-semibold'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            About Us
          </Link>

          {/* 3. Sport Management (Submenu) */}
          <div className="rounded-lg border border-slate-200/80 overflow-hidden bg-slate-50/50">
            <div className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-800 bg-slate-100/60">
              <Link
                to="/sports-management"
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-slate-900 hover:text-emerald-700"
              >
                Sport Management
              </Link>
              <button
                type="button"
                onClick={() => setMobileSportsOpen(!mobileSportsOpen)}
                className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                aria-label="Toggle sport management submenu"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileSportsOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {mobileSportsOpen && (
              <div className="py-1 px-2 space-y-1 bg-white">
                <Link
                  to="/players"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-xs font-medium ${
                    location.pathname.startsWith('/players') ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Our Players
                </Link>
                <Link
                  to="/player-representation"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-xs font-medium ${
                    isActive('/player-representation') ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Player Representation
                </Link>
              </div>
            )}
          </div>

          {/* 4. Gallery */}
          <Link
            to="/gallery"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
              location.pathname === '/gallery' || location.hash === '#gallery'
                ? 'bg-emerald-50 text-emerald-800 font-semibold'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            Gallery
          </Link>

          {/* 5. Travels & Tours (Submenu) */}
          <div className="rounded-lg border border-slate-200/80 overflow-hidden bg-slate-50/50">
            <div className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-800 bg-slate-100/60">
              <Link
                to="/travel-tours"
                onClick={() => setMobileMenuOpen(false)}
                className="font-semibold text-slate-900 hover:text-emerald-700"
              >
                Travels & Tours
              </Link>
              <button
                type="button"
                onClick={() => setMobileTravelsOpen(!mobileTravelsOpen)}
                className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                aria-label="Toggle travels and tours submenu"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileTravelsOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {mobileTravelsOpen && (
              <div className="py-1 px-2 space-y-1 bg-white">
                <Link
                  to="/visa-consultation"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-xs font-medium ${
                    isActive('/visa-consultation') ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Visa Consultation
                </Link>
                <Link
                  to="/flight-services"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-xs font-medium ${
                    isActive('/flight-services') ? 'bg-emerald-50 text-emerald-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Flight Services
                </Link>
              </div>
            )}
          </div>

          {/* 6. Contact Us */}
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/contact')
                ? 'bg-emerald-50 text-emerald-800 font-semibold'
                : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
            }`}
          >
            Contact Us
          </Link>

          {/* Book a Consultation Button */}
          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block px-4 py-2.5 text-sm font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 shadow-sm"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
