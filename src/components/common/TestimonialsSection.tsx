import React, { useState, useEffect } from 'react';
import { Star, Quote, CheckCircle2, Trophy, Compass, MessageSquare } from 'lucide-react';
import { api } from '../../services/api';
import { Testimonial } from '../../types/index';

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-1',
    name: 'Tunde Bakare',
    role: 'Professional Footballer · Forward',
    category: 'sports',
    location: 'Lisbon, Portugal',
    rating: 5,
    content:
      'Chamonvin Limited transformed my athletic journey. Their direct European scouting network secured me elite exposure in Portugal. What stands out most is their integrity—no empty promises, just authentic representation and genuine care for my long-term career.',
    date: '2026 Season'
  },
  {
    id: 'rev-2',
    name: 'Dr. Nkemdilim Eze',
    role: 'Medical Research Delegate · Schengen Visa Client',
    category: 'travel',
    location: 'London, United Kingdom',
    rating: 5,
    content:
      'Navigating international visa requirements for our 8-person conference delegation seemed daunting until we hired Chamonvin. Their travel team scrutinized our documentation with immense precision and arranged flights seamlessly. Highly recommended!',
    date: '2026 Season'
  },
  {
    id: 'rev-3',
    name: 'Emmanuel Oduro',
    role: 'Midfielder · Representation Client',
    category: 'sports',
    location: 'Madrid, Spain',
    rating: 5,
    content:
      'The athletic conditioning roadmap and tactical video analysis provided by Chamonvin gave me the edge I needed during scouting assessments. They treat players with respect, protect our welfare, and offer transparent career advisory.',
    date: '2026 Season'
  },
  {
    id: 'rev-4',
    name: 'Coach Julian Martins',
    role: 'European Football Academy Technical Scout',
    category: 'sports',
    location: 'Porto, Portugal',
    rating: 5,
    content:
      'Working with Chamonvin as licensed intermediaries has been exemplary. Their player dossiers are authentic, thoroughly vetted, and backed by accurate technical footage. A trustworthy agency that respects international compliance.',
    date: '2026 Season'
  },
  {
    id: 'rev-5',
    name: 'Folashade Adeleke',
    role: 'Postgraduate Student · UK Student Visa',
    category: 'travel',
    location: 'Manchester, United Kingdom',
    rating: 5,
    content:
      'From university documentation review to mock visa interview prep and airport itinerary booking, Chamonvin guided me step-by-step. Their 24/7 responsiveness gave my family tremendous peace of mind throughout the entire process.',
    date: '2026 Season'
  },
  {
    id: 'rev-6',
    name: 'Kelvin Mensah',
    role: 'Center Back · Elite Trials Participant',
    category: 'sports',
    location: 'Paris, France',
    rating: 5,
    content:
      'Unlike other scouts who make grand claims without results, Chamonvin delivered tangible trial invitations, real contract advisory, and full logistical support. They are the benchmark for football management.',
    date: '2026 Season'
  }
];

export const TestimonialsSection: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [items, setItems] = useState<Testimonial[]>(FALLBACK_TESTIMONIALS);
  const [filter, setFilter] = useState<'all' | 'sports' | 'travel'>('all');

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await api.getTestimonials();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.warn('Failed to load live testimonials, using cached:', err);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const filtered = filter === 'all'
    ? items
    : items.filter(t => t.category === filter);

  if (items.length === 0) return null;

  return (
    <section className={`py-20 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800 ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Client & Athlete Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trusted by Talents, Clubs & Global Travelers
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real feedback from represented football players, European scouting directors, and international travel and visa advisory clients.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Stories
            </button>
            <button
              type="button"
              onClick={() => setFilter('sports')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                filter === 'sports'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3 h-3" />
              <span>Sports Management</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter('travel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                filter === 'travel'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Travel & Visa</span>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-emerald-600/60 rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-emerald-950/30 group relative"
            >
              <Quote className="w-8 h-8 text-emerald-500/15 absolute top-5 right-5 group-hover:text-emerald-500/25 transition-colors" />

              <div className="space-y-4">
                {/* Rating & Category Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.category === 'sports'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800/80'
                  }`}>
                    {item.category === 'sports' ? 'Football Management' : 'Travel & Visa'}
                  </span>
                </div>

                {/* Content Quote */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-white">{item.name}</span>
                    <span title="Verified Client">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    </span>
                  </div>
                  <span className="block text-[11px] text-slate-400 font-medium">{item.role}</span>
                  <span className="block text-[10px] text-emerald-400/90 font-mono mt-0.5">{item.location} · {item.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Confidence Trust Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
          <div className="text-center p-3">
            <span className="block text-2xl sm:text-3xl font-black text-emerald-400">100+</span>
            <span className="text-xs text-slate-400">Athletes Assessed</span>
          </div>
          <div className="text-center p-3">
            <span className="block text-2xl sm:text-3xl font-black text-white">98%</span>
            <span className="text-xs text-slate-400">Visa Advisory Rating</span>
          </div>
          <div className="text-center p-3">
            <span className="block text-2xl sm:text-3xl font-black text-emerald-400">15+</span>
            <span className="text-xs text-slate-400">Club & Scout Partners</span>
          </div>
          <div className="text-center p-3">
            <span className="block text-2xl sm:text-3xl font-black text-white">24/7</span>
            <span className="text-xs text-slate-400">Client Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};
