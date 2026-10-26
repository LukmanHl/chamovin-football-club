import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Calendar, Maximize2, X, Sparkles, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { GalleryItem } from '../../types/index';

export const HomeGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadGallery() {
      try {
        const data = await api.getGallery();
        if (isMounted) setItems(data);
      } catch (err) {
        console.warn('Failed to load gallery items:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadGallery();
    return () => { isMounted = false; };
  }, []);

  // Keyboard escape to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = [
    'All',
    'Scouting & Matches',
    'Training & Performance',
    'Travel & Tours',
    'Management & Events'
  ];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900 scroll-mt-20">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Chamonvin Media & Visual Portfolio</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Moments & Matchday Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-2 leading-relaxed">
              Capturing international scouting showcases, elite training sessions, matchday atmospheres, and player representation milestones across Europe and West Africa.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-4/3 bg-slate-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500/60 transition-all duration-300 shadow-lg cursor-pointer flex flex-col justify-between"
              >
                {/* Photo Container */}
                <div className="aspect-4/3 overflow-hidden bg-slate-950 relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="bg-emerald-950/90 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-emerald-800/80 uppercase tracking-wider backdrop-blur-sm shadow-sm">
                      {item.category}
                    </span>
                    <button
                      type="button"
                      aria-label="Expand image"
                      className="p-1.5 rounded-full bg-slate-950/70 text-slate-300 group-hover:text-white group-hover:bg-emerald-600 transition-colors shadow"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Bottom: Title only (write-ups removed) */}
                <div className="p-4 bg-slate-900 text-left border-t border-slate-800 space-y-1.5">
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    {item.location ? (
                      <span className="flex items-center gap-1 text-emerald-400 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </span>
                    ) : <span />}
                    {item.date && (
                      <span className="text-slate-500 font-mono text-[10px] shrink-0">
                        {item.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
            No gallery items found under this category.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-950 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded border border-emerald-800">
                  {activeItem.category}
                </span>
                {activeItem.location && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-500" />
                    <span>{activeItem.location}</span>
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image View */}
            <div className="flex-1 bg-black overflow-hidden flex items-center justify-center p-2 sm:p-4 min-h-[300px] max-h-[60vh]">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="max-w-full max-h-[58vh] object-contain rounded-lg shadow-lg"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Modal Footer Caption: Title and metadata only, no write-up */}
            <div className="p-5 sm:p-6 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">{activeItem.title}</h3>
              {activeItem.date && (
                <span className="text-xs text-slate-400 font-mono">
                  {activeItem.date}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
