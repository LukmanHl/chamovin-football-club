import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SportsManagementPage } from './pages/SportsManagementPage';
import { PlayersPage } from './pages/PlayersPage';
import { PlayerDetailPage } from './pages/PlayerDetailPage';
import { PlayerRepresentationPage } from './pages/PlayerRepresentationPage';
import { TravelToursPage } from './pages/TravelToursPage';
import { VisaConsultationPage } from './pages/VisaConsultationPage';
import { FlightServicesPage } from './pages/FlightServicesPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPrivacyPage } from './pages/TermsPrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminPlayersPage } from './pages/admin/AdminPlayersPage';
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage';
import { AdminTravelPage } from './pages/admin/AdminTravelPage';
import { AdminNewsPage } from './pages/admin/AdminNewsPage';
import { AdminAppearancePage } from './pages/admin/AdminAppearancePage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Dedicated Pages */}
            <Route
              path="/"
              element={
                <PublicLayout>
                  <HomePage />
                </PublicLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <AboutPage />
                </PublicLayout>
              }
            />
            <Route
              path="/sports-management"
              element={
                <PublicLayout>
                  <SportsManagementPage />
                </PublicLayout>
              }
            />
            <Route
              path="/players"
              element={
                <PublicLayout>
                  <PlayersPage />
                </PublicLayout>
              }
            />
            <Route
              path="/players/:id"
              element={
                <PublicLayout>
                  <PlayerDetailPage />
                </PublicLayout>
              }
            />
            <Route
              path="/player-representation"
              element={
                <PublicLayout>
                  <PlayerRepresentationPage />
                </PublicLayout>
              }
            />
            <Route
              path="/travel-tours"
              element={
                <PublicLayout>
                  <TravelToursPage />
                </PublicLayout>
              }
            />
            <Route
              path="/visa-consultation"
              element={
                <PublicLayout>
                  <VisaConsultationPage />
                </PublicLayout>
              }
            />
            <Route
              path="/flight-services"
              element={
                <PublicLayout>
                  <FlightServicesPage />
                </PublicLayout>
              }
            />
            <Route
              path="/news"
              element={
                <PublicLayout>
                  <NewsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/news/:id"
              element={
                <PublicLayout>
                  <NewsDetailPage />
                </PublicLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <PublicLayout>
                  <ContactPage />
                </PublicLayout>
              }
            />
            <Route
              path="/terms-privacy"
              element={
                <PublicLayout>
                  <TermsPrivacyPage />
                </PublicLayout>
              }
            />

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Secure Admin Dashboard (Protected Routes) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverviewPage />} />
              <Route path="players" element={<AdminPlayersPage />} />
              <Route path="inquiries" element={<AdminInquiriesPage />} />
              <Route path="travel" element={<AdminTravelPage />} />
              <Route path="news" element={<AdminNewsPage />} />
              <Route path="appearance" element={<AdminAppearancePage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <PublicLayout>
                  <NotFoundPage />
                </PublicLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
