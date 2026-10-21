import React, { useState, useEffect } from 'react';
import { Palette, Upload, Trash2, CheckCircle2, AlertCircle, ArrowUp, ArrowDown, Image as ImageIcon } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import { HeroSlide, HeroButton } from '../../types/index';

export const AdminAppearancePage: React.FC = () => {
  const { settings, refreshSettings } = useSettings();

  // Logo state
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Tagline & interval
  const [heroTagline, setHeroTagline] = useState('Your vision and Goal is our Priority');
  const [heroInterval, setHeroInterval] = useState(15000);

  // Slides state
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  // Hero Buttons
  const [buttons, setButtons] = useState<HeroButton[]>([]);

  // Form status
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setLogoUrl(settings.logoUrl || '');
      setLogoPreview(settings.logoUrl || '');
      setHeroTagline(settings.heroTagline || 'Your vision and Goal is our Priority');
      setHeroInterval(settings.heroInterval || 15000);
      setSlides(settings.heroSlides || []);
      setButtons(settings.heroButtons || []);
    }
  }, [settings]);

  // Logo handlers
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setError(null);
    try {
      const res = await api.uploadImage(file);
      setLogoUrl(res.url);
      setLogoPreview(res.url);
    } catch (err: any) {
      setError(err.message || 'Logo upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    setLogoPreview('');
  };

  // Slide image upload handler
  const handleSlideImageUpload = async (index: number, file: File) => {
    try {
      const res = await api.uploadImage(file);
      const updated = [...slides];
      updated[index] = { ...updated[index], image: res.url };
      setSlides(updated);
    } catch (err: any) {
      setError(`Slide ${index + 1} image upload failed: ${err.message}`);
    }
  };

  const handleSlideChange = (index: number, field: keyof HeroSlide, val: string) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: val };
    setSlides(updated);
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= slides.length) return;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setSlides(updated);
  };

  // Save all appearance settings
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.updateSettings({
        logoUrl,
        heroTagline,
        heroInterval,
        heroSlides: slides,
        heroButtons: buttons
      });
      await refreshSettings();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save appearance settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
          Website Customization
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
          Hero Slider & Logo Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure the public company logo, the three-image football pitch hero slider, continuous scrolling tagline, and hero buttons.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Appearance settings saved successfully! Your changes are now live on the public website.</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* 1. COMPANY LOGO MANAGEMENT */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-950">1. Company Logo</h2>
              <p className="text-xs text-slate-500">
                Upload a company logo file or specify an external image URL. Displayed in public header and footer.
              </p>
            </div>
            {logoPreview && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Logo</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Logo File (PNG / JPG / SVG)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="text-xs w-full text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                />
                {uploadingLogo && <span className="text-[11px] text-emerald-700 block mt-1">Uploading logo...</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Or External Logo Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    setLogoPreview(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Live Logo Preview Box */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center min-h-[140px] text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                Live Preview
              </span>
              {logoPreview ? (
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs max-h-24 max-w-full flex items-center justify-center">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-h-16 max-w-[200px] object-contain"
                    onError={() => setError('Unable to load image from specified logo URL')}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-lg font-extrabold uppercase text-slate-900 tracking-tight block">
                    CHAMONVIN LIMITED
                  </span>
                  <span className="text-[11px] text-slate-400">Default clean wordmark rendered when no logo is set</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. SCROLLING TAGLINE CONFIGURATION */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-950">2. Hero Tagline Animation</h2>
            <p className="text-xs text-slate-500">
              The tagline that continuously scrolls from left to right across the hero section.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Exact Tagline Text
            </label>
            <input
              type="text"
              required
              value={heroTagline}
              onChange={(e) => setHeroTagline(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Tagline Preview */}
          <div className="p-3 bg-emerald-950 rounded-lg overflow-hidden border border-emerald-800 text-emerald-300 font-bold text-xs uppercase text-center tracking-widest">
            ★ {heroTagline} ★
          </div>
        </div>

        {/* 3. HERO SLIDER IMAGES (EXACTLY THREE SLIDES) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-950">
                3. Three-Image Football Pitch Hero Slider
              </h2>
              <p className="text-xs text-slate-500">
                The homepage features exactly three high-quality football stadium/pitch slides rotating every 15 seconds.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Rotation Interval:</span>
              <select
                value={heroInterval}
                onChange={(e) => setHeroInterval(Number(e.target.value))}
                className="px-2 py-1 text-xs border border-slate-300 rounded bg-white font-semibold"
              >
                <option value={10000}>10 Seconds</option>
                <option value={15000}>15 Seconds (Default)</option>
                <option value={20000}>20 Seconds</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {slides.map((slide, index) => (
              <div key={slide.id || index} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      Slide {index + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveSlide(index, 'up')}
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                      title="Move slide up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === slides.length - 1}
                      onClick={() => moveSlide(index, 'down')}
                      className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
                      title="Move slide down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-4 aspect-16/9 bg-slate-900 rounded-lg overflow-hidden border border-slate-300 relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="md:col-span-8 space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Slide Image Source (Upload or URL)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleSlideImageUpload(index, e.target.files[0]);
                          }}
                          className="text-xs text-slate-500"
                        />
                        <input
                          type="text"
                          value={slide.image}
                          onChange={(e) => handleSlideChange(index, 'image', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                          placeholder="Image URL"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Slide Headline
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Slide Subtitle
                      </label>
                      <input
                        type="text"
                        value={slide.subtitle}
                        onChange={(e) => handleSlideChange(index, 'subtitle', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. HERO CALL-TO-ACTION BUTTONS */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-950">4. Hero Action Buttons</h2>
            <p className="text-xs text-slate-500">
              Customize the labels and target pages for the 4 hero buttons.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {buttons.map((btn, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Button {idx + 1}</span>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">Label</label>
                  <input
                    type="text"
                    value={btn.label}
                    onChange={(e) => {
                      const updated = [...buttons];
                      updated[idx] = { ...updated[idx], label: e.target.value };
                      setButtons(updated);
                    }}
                    className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-0.5">Destination Link</label>
                  <input
                    type="text"
                    value={btn.link}
                    onChange={(e) => {
                      const updated = [...buttons];
                      updated[idx] = { ...updated[idx], link: e.target.value };
                      setButtons(updated);
                    }}
                    className="w-full px-2.5 py-1 text-xs border border-slate-300 rounded bg-white font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="sticky bottom-4 bg-slate-950 text-white p-4 rounded-xl flex items-center justify-between shadow-2xl">
          <span className="text-xs text-slate-300">
            Save will immediately update the live public website and database.
          </span>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors"
          >
            {saving ? 'Publishing Changes...' : 'Save & Publish Appearance'}
          </button>
        </div>
      </form>
    </div>
  );
};
