import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center px-4 py-20">
      <div className="max-w-md text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-widest">
          Error 404
        </span>
        <h1 className="text-3xl font-extrabold text-slate-950">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The requested page could not be located. It may have moved or the address may have been entered incorrectly.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-950 hover:bg-emerald-700 rounded-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
