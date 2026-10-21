import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, ArrowRight, Calendar, User, Search } from 'lucide-react';
import { api } from '../services/api';
import { NewsArticle, NewsCategory } from '../types/index';

export const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');

  const categories: (NewsCategory | 'All')[] = [
    'All',
    'Football Management',
    'Player Announcements',
    'Sports Opportunities',
    'Travel & Visa Updates',
    'Company News'
  ];

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getNews();
        setArticles(data);
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = articles.filter((a) => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-3">
            Press & Insights
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            News, Updates & Insights
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Latest announcements from Chamonvin Limited sports management, player developments, travel policies, and international visa guidance.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-50 border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search news and announcements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white font-semibold'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="p-16 text-center text-sm text-slate-500">Loading articles...</div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((article) => (
              <article
                key={article.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-600 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/9 bg-slate-900 relative overflow-hidden">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                      {article.category}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-600" />
                        {article.publicationDate}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-emerald-600" />
                        {article.author}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-950 leading-snug">
                      <Link to={`/news/${article.id}`} className="hover:text-emerald-700 transition-colors">
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 pt-0">
                  <Link
                    to={`/news/${article.id}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center max-w-xl mx-auto">
            <Newspaper className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No Articles Found</h3>
            <p className="text-xs text-slate-600">
              There are currently no published articles in this category. Check back soon for updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
