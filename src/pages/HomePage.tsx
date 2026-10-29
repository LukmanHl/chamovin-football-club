import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Compass, CheckCircle2, Globe, Users, Plane, FileCheck } from 'lucide-react';
import { HeroSlider } from '../components/common/HeroSlider';
import { HomeGallery } from '../components/common/HomeGallery';
import { OwnerCard } from '../components/common/OwnerCard';
import { TestimonialsSection } from '../components/common/TestimonialsSection';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';
import { Player, NewsArticle } from '../types/index';

export const HomePage: React.FC = () => {
  const { settings } = useSettings();
  const [featuredPlayers, setFeaturedPlayers] = useState<Player[]>([]);
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [playersData, newsData] = await Promise.all([
          api.getPlayers(),
          api.getNews()
        ]);
        setFeaturedPlayers(playersData.filter(p => p.isFeatured || playersData.length <= 3).slice(0, 3));
        setLatestNews(newsData.slice(0, 3));
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoadingPlayers(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-white">
      {/* 1. HERO SECTION WITH IMAGE SLIDER & TAGLINE */}
      <HeroSlider />

      {/* 2. OFFICIAL APPROVED COMPANY INTRODUCTION */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-3">
            About Chamonvin Limited
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight mb-8">
            Our Clients' Priorities Come First, Every Time.
          </h2>
          <div className="space-y-5 text-base sm:text-lg text-slate-700 leading-relaxed text-left sm:text-justify bg-white p-6 sm:p-10 rounded-xl border border-slate-200 shadow-xs">
            <p className="font-semibold text-slate-900">
              At Chamonvin Limited, our clients' priorities come first, every time.
            </p>
            <p>
              Chamonvin Limited is an international/global sports management firm specializing in soccer, football, and player representation, with extended services in travel and visa consultation.
            </p>
            <p>
              We represent amateur players, semi-professional players, professional players, managers, and teams. We continuously provide dedicated, high-quality service to our clients, whether on or off the pitch.
            </p>
            <p>
              We understand what it takes to pursue success at the highest level. We help our clients navigate their careers, identify suitable opportunities, and make informed decisions at every stage of their journey.
            </p>
            <p className="border-t border-slate-100 pt-4 text-emerald-900 font-medium">
              Our number-one priority is our clients and their success. Chamonvin Limited is committed to helping clients access suitable opportunities through professional support, communication, and personalized service.
            </p>
          </div>
        </div>
      </section>

      {/* 3. TWO CLEARLY SEPARATED SERVICE HIGHLIGHTS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
            Core Service Divisions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Integrated Global Excellence
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Providing synchronized sports representation and international mobility consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sports Management Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 flex flex-col justify-between hover:border-emerald-600 transition-all hover:shadow-md group">
            <div>
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-950 mb-3">
                Sports Management
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Professional football representation, player development, career support, and football opportunities.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-slate-700">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Amateur, semi-professional, and professional player representation</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Scouting portfolio preparation & verified athletic profiles</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Career roadmapping, trials coordination & contract support</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Football managers, coaches & club network liaison</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/sports-management"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <span>Explore Sports Management</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/player-representation"
                className="text-xs font-semibold px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-md transition-colors"
              >
                Apply for Representation
              </Link>
            </div>
          </div>

          {/* Travel and Visa Consultancy Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 flex flex-col justify-between hover:border-emerald-600 transition-all hover:shadow-md group">
            <div>
              <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-950 mb-3">
                Travel & Visa Consultancy
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                Travel planning, tour services, flight reservations, and consultation and assistance with eligible visa application processes.
              </p>
              <ul className="space-y-3 mb-8 text-sm text-slate-700">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Study, visitor, business & skilled worker visa consultation</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Family reunion visa consultation & permanent residency pathways</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Flight booking consultation & itinerary planning</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sports group tours, delegation travel & tournament logistics</span>
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/travel-tours"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <span>Explore Travel Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/visa-consultation"
                className="text-xs font-semibold px-3 py-1.5 bg-emerald-700 text-white hover:bg-emerald-800 rounded-md transition-colors"
              >
                Visa Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXECUTIVE LEADERSHIP / OWNER CARD (Name, photo & direct link to full profile on About Us) */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <OwnerCard layout="home" />
      </section>

      {/* 5. FEATURED PLAYERS DIRECTORY (Empty state compliant - NO FAKE PLAYERS) */}
      <section className="py-16 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
                Talent Roster
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Represented Football Players
              </h2>
            </div>
            <Link
              to="/players"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <span>View Full Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingPlayers ? (
            <div className="p-12 text-center text-sm text-slate-500 font-medium">
              Loading player records...
            </div>
          ) : featuredPlayers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="aspect-4/3 bg-slate-900 relative">
                    {player.photoUrl ? (
                      <img
                        src={player.photoUrl}
                        alt={player.fullName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <Users className="w-12 h-12 opacity-30" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span>{player.primaryPosition}</span>
                        <span>·</span>
                        <span>{player.nationality}</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-medium">{player.playingLevel}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-950 mb-2">
                        {player.fullName}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-4">
                        {player.bio}
                      </p>
                    </div>
                    <Link
                      to={`/players/${player.id}`}
                      className="w-full py-2 text-xs font-semibold text-center text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center max-w-2xl mx-auto">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Official Player Roster
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Chamonvin Limited actively manages player profiles and scouting portfolios with full professional confidentiality. Individual public player profiles are updated and published upon authorized disclosure.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/player-representation"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors"
                >
                  Request Representation
                </Link>
                <Link
                  to="/contact"
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Club Scouting Inquiries
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. MOMENTS & MATCHDAY MEDIA GALLERY */}
      <HomeGallery />

      {/* 6. WHY CHOOSE CHAMONVIN LIMITED */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
            The Chamonvin Advantage
          </span>
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Why Choose Chamonvin Limited
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Professional representation built on integrity, clear communication, and global reach.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-emerald-600 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2">Client Priority</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every athlete, team, and traveler receives undivided attention and tailored strategies focused on long-term value.
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-emerald-600 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2">International Reach</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Cross-border connections spanning European football circuits, African academies, and global travel corridors.
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-emerald-600 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2">Transparent Advisory</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Honest assessments without unrealistic guarantees. Clear guidance through contracts, trials, and visa paperwork.
            </p>
          </div>

          <div className="p-6 border border-slate-200 rounded-xl bg-white hover:border-emerald-600 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-950 mb-2">Dual Competency</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Seamless synchronization between athletic opportunities and travel logistics, visas, and flight arrangements.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CLIENT INQUIRY PROCESS */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-2">
              Structured Engagement
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Our Structured Client Process
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              A transparent, step-by-step pathway from initial assessment to ongoing execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-slate-800 bg-slate-900/60 p-8 rounded-xl relative">
              <span className="text-3xl font-black text-emerald-500/40 mb-4 block">01</span>
              <h3 className="text-lg font-bold text-white mb-2">Initial Inquiry & Intake</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Submit your player representation profile, travel requirements, or visa consultation request via our secure portal.
              </p>
            </div>

            <div className="border border-slate-800 bg-slate-900/60 p-8 rounded-xl relative">
              <span className="text-3xl font-black text-emerald-500/40 mb-4 block">02</span>
              <h3 className="text-lg font-bold text-white mb-2">Strategic Review & Assessment</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our management and consultation specialists review your goals, evaluate eligible pathways, and verify prerequisites.
              </p>
            </div>

            <div className="border border-slate-800 bg-slate-900/60 p-8 rounded-xl relative">
              <span className="text-3xl font-black text-emerald-500/40 mb-4 block">03</span>
              <h3 className="text-lg font-bold text-white mb-2">Execution & Active Support</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                We coordinate personalized representation, club communication, travel itineraries, or visa submission assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLIENT & ATHLETE TESTIMONIALS */}
      <TestimonialsSection />

      {/* 8. LATEST NEWS & UPDATES */}
      {latestNews.length > 0 && (
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-2">
                Company News
              </span>
              <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
                Latest News & Announcements
              </h2>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <span>View All News</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((article) => (
              <article
                key={article.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-emerald-600 transition-all hover:shadow-md flex flex-col"
              >
                <div className="aspect-16/9 bg-slate-100 overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span className="text-emerald-700 font-semibold">{article.category}</span>
                      <span>·</span>
                      <span>{article.publicationDate}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-950 mb-3 leading-snug">
                      <Link to={`/news/${article.id}`} className="hover:text-emerald-700 transition-colors">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      {article.content}
                    </p>
                  </div>
                  <Link
                    to={`/news/${article.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* 8. CONSULTATION CTA BANNER */}
      <section className="py-16 bg-emerald-800 text-white border-t border-emerald-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-4 text-balance">
            Ready to Navigate Your Football or International Travel Goals?
          </h2>
          <p className="text-emerald-100 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Speak directly with our international management team for personalized player representation assessment or dedicated visa and travel consultation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-md transition-all shadow-sm"
            >
              Book a Consultation
            </Link>
            <Link
              to="/player-representation"
              className="px-6 py-3 text-sm font-semibold text-white bg-emerald-950 hover:bg-black rounded-md transition-all border border-emerald-700"
            >
              Player Representation Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
