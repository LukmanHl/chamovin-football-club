import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const HeroSlider: React.FC = () => {
  const { settings } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = settings?.heroSlides && settings.heroSlides.length === 3
    ? settings.heroSlides
    : [
        {
          id: 'slide-1',
          image: '/src/assets/images/hero_football_pitch_stands_1792410704308.jpg',
          title: 'Global Sports Management & Player Representation',
          subtitle: 'Dedicated high-quality representation for ambitious football talents, on and off the pitch.'
        },
        {
          id: 'slide-2',
          image: '/src/assets/images/hero_field_goalposts_1792410719341.jpg',
          title: 'Strategic Career Pathways & International Opportunities',
          subtitle: 'Helping players and clubs navigate contracts, transfers, and high-performance development.'
        },
        {
          id: 'slide-3',
          image: '/src/assets/images/hero_stadium_match_atmosphere_1792410733883.jpg',
          title: 'International Travel, Tours & Visa Consultation',
          subtitle: 'Flight booking consultation, family and group tour planning, and eligible visa guidance.'
        }
      ];

  const intervalTime = settings?.heroInterval && settings.heroInterval <= 60000 ? settings.heroInterval : 5000;

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, intervalTime, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentIndex] || slides[0];

  const heroButtons = settings?.heroButtons && settings.heroButtons.length > 0
    ? settings.heroButtons
    : [
        { label: 'Explore Our Sports Management', link: '/sports-management' },
        { label: 'Explore Travel & Visa Services', link: '/travel-tours' },
        { label: 'Become a Represented Player', link: '/player-representation' },
        { label: 'Book a Consultation', link: '/contact' }
      ];

  const tagline = settings?.heroTagline || 'Your vision and Goal is our Priority';

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950 text-white min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex flex-col justify-between"
      aria-label="Homepage Hero Showcase"
    >
      {/* Background Slides with smooth fade */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            } transition-transform duration-10000`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-radial from-transparent to-black/60" />
          </div>
        ))}
      </div>

      {/* CONTINUOUS LEFT-TO-RIGHT SCROLLING TAGLINE BAR */}
      {/* Prompt requirement: "Animate the tagline so that it moves continuously from left to right across the hero section.
          The scrolling animation must be smooth, readable, and visually appealing.
          Display the following exact tagline prominently within the hero section: 'Your vision and Goal is our Priority'" */}
      <div className="relative z-20 w-full bg-emerald-950/80 backdrop-blur-md border-b border-emerald-500/30 py-3 overflow-hidden select-none">
        <div className="flex w-[200%] animate-marquee-ltr">
          <div className="flex shrink-0 items-center justify-around w-full gap-8">
            <span className="text-emerald-300 font-extrabold text-xs sm:text-sm tracking-widest uppercase">
              ★ {tagline} ★
            </span>
            <span className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase">
              Chamonvin Limited
            </span>
            <span className="text-emerald-300 font-extrabold text-xs sm:text-sm tracking-widest uppercase">
              ★ {tagline} ★
            </span>
            <span className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase">
              Sports Management & Travel
            </span>
          </div>
          <div className="flex shrink-0 items-center justify-around w-full gap-8">
            <span className="text-emerald-300 font-extrabold text-xs sm:text-sm tracking-widest uppercase">
              ★ {tagline} ★
            </span>
            <span className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase">
              Chamonvin Limited
            </span>
            <span className="text-emerald-300 font-extrabold text-xs sm:text-sm tracking-widest uppercase">
              ★ {tagline} ★
            </span>
            <span className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase">
              Sports Management & Travel
            </span>
          </div>
        </div>
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 my-auto w-full">
        <div className="max-w-3xl">
          {/* Active slide badge/kicker */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
              International Representation & Consulting
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-300">Slide {currentIndex + 1} of {slides.length}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6 text-balance">
            {currentSlide.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 mb-10 max-w-2xl leading-relaxed">
            {currentSlide.subtitle}
          </p>

          {/* 4 Hero Call-to-Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            {heroButtons.map((btn, index) => {
              // Highlight the first and third with green/white styling
              const isPrimary = index === 0 || index === 2;
              return (
                <Link
                  key={index}
                  to={btn.link}
                  className={`px-5 py-3 text-xs sm:text-sm font-semibold rounded-md text-center transition-all shadow-sm ${
                    isPrimary
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500'
                      : 'bg-white hover:bg-slate-100 text-slate-950 border border-white'
                  }`}
                >
                  {btn.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slider Controls Bar (Bottom) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full flex items-center justify-between">
        {/* Slide Indicators */}
        <div className="flex items-center gap-2.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 transition-all rounded-full ${
                idx === currentIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
          <span className="ml-3 text-[11px] text-slate-400 font-mono">
            {currentIndex + 1} / {slides.length}
          </span>
        </div>

        {/* Prev / Next & Pause controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 text-slate-300 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-md transition-colors"
            title={isPaused ? 'Resume auto-slides' : 'Pause auto-slides'}
            aria-label="Toggle pause"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={handlePrev}
            className="p-2 text-slate-300 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-md transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2 text-slate-300 hover:text-white bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-md transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
