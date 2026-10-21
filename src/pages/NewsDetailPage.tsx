import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Share2, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { NewsArticle } from '../types/index';

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const data = await api.getNewsById(id);
        setArticle(data);
      } catch (err: any) {
        setError(err.message || 'Article not found');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <p className="text-sm text-slate-500">Loading article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="max-w-md bg-white p-8 rounded-xl border border-slate-200 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Article Unavailable</h2>
          <p className="text-xs text-slate-600">{error || 'This article could not be loaded.'}</p>
          <button
            onClick={() => navigate('/news')}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumb Header */}
      <div className="border-b border-slate-200 bg-slate-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All News</span>
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Article Meta */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="text-emerald-700 font-bold uppercase tracking-wider">{article.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {article.publicationDate}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {article.author}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight leading-[1.2]">
            {article.title}
          </h1>
        </div>

        {/* Featured Image */}
        <div className="aspect-16/9 bg-slate-900 rounded-2xl overflow-hidden mb-10 border border-slate-200 shadow-sm">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-slate max-w-none text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line space-y-6">
          {article.content}
        </div>

        {/* Bottom CTA Box */}
        <div className="mt-16 p-8 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-950 mb-1">
              Connect With Chamonvin Limited
            </h3>
            <p className="text-xs text-slate-600">
              For media inquiries, player representation, or international consultation.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors shrink-0 inline-flex items-center gap-2"
          >
            <span>Contact Our Team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </div>
  );
};
