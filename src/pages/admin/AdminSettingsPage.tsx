import React, { useState, useEffect } from 'react';
import { Settings, Shield, Lock, CheckCircle2, AlertCircle, Save, Database, ExternalLink, RefreshCw, Key, Link as LinkIcon, Copy, Code, ChevronDown, ChevronUp } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import { AuditLog } from '../../types/index';
import { testSupabaseConnection } from '../../services/supabase';

export const AdminSettingsPage: React.FC = () => {
  const { settings, refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<'company' | 'cms' | 'supabase' | 'security'>('company');

  // Company Settings Form
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [officeAddress, setOfficeAddress] = useState('');
  const [businessHours, setBusinessHours] = useState('');
  const [socials, setSocials] = useState({
    twitter: '',
    instagram: '',
    linkedin: '',
    facebook: ''
  });

  // CMS Content
  const [content, setContent] = useState({
    aboutOverview: '',
    aboutMission: '',
    aboutVision: '',
    aboutValues: '',
    aboutPhilosophy: '',
    sportsManagementOverview: '',
    travelVisaOverview: '',
    visaDisclaimer: '',
    flightDisclaimer: '',
    privacyPolicy: '',
    termsConditions: ''
  });

  // Supabase Configuration State
  const [supabaseProjectUrl, setSupabaseProjectUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [supabaseDbUri, setSupabaseDbUri] = useState('');
  const [supabaseServiceRoleKey, setSupabaseServiceRoleKey] = useState('');
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [supabaseTestResult, setSupabaseTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [syncingSupabase, setSyncingSupabase] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; counts?: any } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [showSqlViewer, setShowSqlViewer] = useState(false);
  const [sqlScriptText, setSqlScriptText] = useState('');

  // Security Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Audit Logs
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // Status
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setCompanyName(settings.companyName || '');
      setContactEmail(settings.contactEmail || '');
      setContactPhone(settings.contactPhone || '');
      setContactWhatsapp(settings.contactWhatsapp || '');
      setOfficeAddress(settings.officeAddress || '');
      setBusinessHours(settings.businessHours || '');
      setSocials(settings.socials || { twitter: '', instagram: '', linkedin: '', facebook: '' });
      setContent({
        aboutOverview: settings.content?.aboutOverview || '',
        aboutMission: settings.content?.aboutMission || '',
        aboutVision: settings.content?.aboutVision || '',
        aboutValues: settings.content?.aboutValues || '',
        aboutPhilosophy: settings.content?.aboutPhilosophy || '',
        sportsManagementOverview: settings.content?.sportsManagementOverview || '',
        travelVisaOverview: settings.content?.travelVisaOverview || '',
        visaDisclaimer: settings.content?.visaDisclaimer || '',
        flightDisclaimer: settings.content?.flightDisclaimer || '',
        privacyPolicy: settings.content?.privacyPolicy || '',
        termsConditions: settings.content?.termsConditions || ''
      });

      if (settings.supabase) {
        setSupabaseProjectUrl(settings.supabase.projectUrl || '');
        setSupabaseAnonKey(settings.supabase.anonKey || '');
        setSupabaseDbUri(settings.supabase.dbUri || '');
        setSupabaseServiceRoleKey(settings.supabase.serviceRoleKey || '');
      }
    }

    async function loadLogs() {
      try {
        const data = await api.getAdminLogs();
        setLogs(data);
      } catch (err) {
        console.error('Failed to load logs:', err);
      }
    }
    loadLogs();
  }, [settings]);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.updateSettings({
        companyName,
        contactEmail,
        contactPhone,
        contactWhatsapp,
        officeAddress,
        businessHours,
        socials
      });
      await refreshSettings();
      setSuccessMsg('Company settings updated successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.updateSettings({ content });
      await refreshSettings();
      setSuccessMsg('Website content and disclaimers updated successfully.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating content');
    } finally {
      setSaving(false);
    }
  };

  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    setSupabaseTestResult(null);
    try {
      const result = await testSupabaseConnection(supabaseProjectUrl, supabaseAnonKey);
      setSupabaseTestResult(result);
    } catch (err: any) {
      setSupabaseTestResult({ success: false, message: err.message || 'Connection test failed' });
    } finally {
      setTestingSupabase(false);
    }
  };

  const handleSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await api.updateSettings({
        supabase: {
          projectUrl: supabaseProjectUrl.trim(),
          anonKey: supabaseAnonKey.trim(),
          serviceRoleKey: supabaseServiceRoleKey.trim() || undefined,
          dbUri: supabaseDbUri.trim() || undefined,
          connected: supabaseTestResult?.success ?? false,
          lastTestedAt: new Date().toISOString()
        }
      });
      await refreshSettings();
      setSuccessMsg('Supabase links & keys saved successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving Supabase settings');
    } finally {
      setSaving(false);
    }
  };

  const loadSqlScript = async (): Promise<string> => {
    if (sqlScriptText) return sqlScriptText;
    try {
      const response = await fetch('/supabase/schema.sql');
      if (response.ok) {
        const text = await response.text();
        setSqlScriptText(text);
        return text;
      }
    } catch (e) {
      console.warn('Failed to fetch schema.sql', e);
    }
    return '';
  };

  const handleCopySqlScript = async () => {
    try {
      let sql = await loadSqlScript();
      if (!sql) {
        sql = `-- Run this in your Supabase SQL Editor\n-- File: /supabase/schema.sql\n`;
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(sql);
      }
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 3500);
    } catch (err) {
      console.warn('Clipboard write error:', err);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 3500);
    }
  };

  const handleToggleSqlViewer = async () => {
    if (!showSqlViewer) {
      await loadSqlScript();
    }
    setShowSqlViewer(!showSqlViewer);
  };

  const handleSyncSupabase = async () => {
    setSyncingSupabase(true);
    setSyncResult(null);
    try {
      // First save current inputs
      if (supabaseProjectUrl && supabaseAnonKey) {
        await api.updateSettings({
          supabase: {
            projectUrl: supabaseProjectUrl.trim(),
            anonKey: supabaseAnonKey.trim(),
            serviceRoleKey: supabaseServiceRoleKey.trim() || undefined,
            dbUri: supabaseDbUri.trim() || undefined,
            connected: true,
            lastTestedAt: new Date().toISOString()
          }
        });
      }

      const res = await api.syncSupabase();
      setSyncResult({
        success: true,
        message: res.message || 'All website data successfully synced to your Supabase tables!',
        counts: res.counts
      });
      await refreshSettings();
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: err.message || 'Failed to sync data to Supabase. Make sure the schema script has been executed in Supabase SQL editor.'
      });
    } finally {
      setSyncingSupabase(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMsg(null);

    if (newPassword !== confirmPassword) {
      setSecurityMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setSecurityMsg({ type: 'error', text: 'New password must be at least 8 characters long.' });
      return;
    }

    try {
      await api.changePassword({ currentPassword, newPassword });
      setSecurityMsg({ type: 'success', text: 'Password successfully updated!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setSecurityMsg({ type: 'error', text: err.message || 'Failed to update password' });
    }
  };

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-5xl">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
          Administration & Configuration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
          CMS & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update company contacts, website descriptions, Supabase database links, legal disclaimers, and staff credentials.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('company')}
          className={`py-2 px-4 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
            activeTab === 'company'
              ? 'bg-white border-t border-x border-slate-200 text-emerald-700'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Company Information & Contacts
        </button>
        <button
          onClick={() => setActiveTab('cms')}
          className={`py-2 px-4 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
            activeTab === 'cms'
              ? 'bg-white border-t border-x border-slate-200 text-emerald-700'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          CMS Page Text & Disclaimers
        </button>
        <button
          onClick={() => setActiveTab('supabase')}
          className={`py-2 px-4 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'supabase'
              ? 'bg-white border-t border-x border-slate-200 text-emerald-700'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span>Supabase Integration</span>
          {settings?.supabase?.connected && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-2 px-4 text-xs font-semibold rounded-t-lg transition-colors whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-white border-t border-x border-slate-200 text-emerald-700'
              : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          Security & Audit Logs
        </button>
      </div>

      {/* Tab 1: Company Info */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompany} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-950 pb-2 border-b border-slate-100">
            Company Contact Channels
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Registered Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Public Inquiries Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Telephone</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Dedicated Line</label>
              <input
                type="text"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Office Address(es)</label>
              <input
                type="text"
                value={officeAddress}
                onChange={(e) => setOfficeAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Operating Hours</label>
              <input
                type="text"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 block">Social Media Links</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <input
                type="url"
                placeholder="Twitter URL"
                value={socials.twitter}
                onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                className="px-3 py-1.5 border border-slate-300 rounded"
              />
              <input
                type="url"
                placeholder="Instagram URL"
                value={socials.instagram}
                onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                className="px-3 py-1.5 border border-slate-300 rounded"
              />
              <input
                type="url"
                placeholder="LinkedIn URL"
                value={socials.linkedin}
                onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                className="px-3 py-1.5 border border-slate-300 rounded"
              />
              <input
                type="url"
                placeholder="Facebook URL"
                value={socials.facebook}
                onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
                className="px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors"
          >
            {saving ? 'Saving...' : 'Save Company Details'}
          </button>
        </form>
      )}

      {/* Tab 2: CMS Text & Disclaimers */}
      {activeTab === 'cms' && (
        <form onSubmit={handleSaveCMS} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-950 pb-2 border-b border-slate-100">
            Website Content & Corporate Statements
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">About Us Overview</label>
            <textarea
              rows={4}
              value={content.aboutOverview}
              onChange={(e) => setContent({ ...content, aboutOverview: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mission Statement</label>
              <textarea
                rows={3}
                value={content.aboutMission}
                onChange={(e) => setContent({ ...content, aboutMission: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vision Statement</label>
              <textarea
                rows={3}
                value={content.aboutVision}
                onChange={(e) => setContent({ ...content, aboutVision: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Core Values</label>
              <textarea
                rows={3}
                value={content.aboutValues}
                onChange={(e) => setContent({ ...content, aboutValues: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Regulatory Disclaimers (Required)
            </h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Visa and Immigration Regulatory Disclaimer
              </label>
              <textarea
                rows={3}
                value={content.visaDisclaimer}
                onChange={(e) => setContent({ ...content, visaDisclaimer: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Flight Ticketing Notice & Disclaimer
              </label>
              <textarea
                rows={2}
                value={content.flightDisclaimer}
                onChange={(e) => setContent({ ...content, flightDisclaimer: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md transition-colors"
          >
            {saving ? 'Saving...' : 'Save CMS Text & Disclaimers'}
          </button>
        </form>
      )}

      {/* Tab 3: Supabase Integration & Connection */}
      {activeTab === 'supabase' && (
        <div className="space-y-6">
          {/* Visual Step-by-Step Guide */}
          <div className="bg-emerald-950 text-white p-6 sm:p-8 rounded-2xl border border-emerald-800 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Where to Insert Your Supabase Links & Sync Your Data
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleToggleSqlViewer}
                  className="px-3 py-2 bg-emerald-900/80 hover:bg-emerald-900 text-emerald-200 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 border border-emerald-700/60"
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>{showSqlViewer ? 'Hide SQL Code' : 'View SQL Script'}</span>
                  {showSqlViewer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleCopySqlScript}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedScript ? 'SQL Script Copied!' : 'Copy Required Supabase SQL Script'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Follow these 3 easy steps to connect Supabase and make all website players, packages, news, and inquiries display in your Supabase tables:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-900/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[11px]">1</span>
                  <span>Run SQL Script</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  In Supabase, open <strong>SQL Editor</strong> → click <strong>New Query</strong>, paste the script (click "Copy Required Supabase SQL Script" above), and click <strong>Run</strong>.
                </p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-900/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[11px]">2</span>
                  <span>Paste URL & Anon Key</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  In Supabase, open <strong>Project Settings</strong> (gear icon) → <strong>API</strong>. Copy <code>Project URL</code> and <code>anon (public)</code> key into the two fields below.
                </p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-900/60 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[11px]">3</span>
                  <span>Push All Website Data</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Click <strong>Save Supabase Connection</strong>, then click <strong>Push / Sync All Website Data to Supabase</strong> to instantly populate all tables.
                </p>
              </div>
            </div>

            {/* Expandable SQL Viewer */}
            {showSqlViewer && (
              <div className="mt-4 pt-4 border-t border-emerald-800/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <span className="font-mono font-bold">supabase/schema.sql</span>
                    <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                      Clean Reset & Universal TEXT IDs
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopySqlScript}
                    className="text-xs text-white bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded flex items-center gap-1.5 font-medium"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Entire SQL Script'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-emerald-200/90 leading-relaxed bg-emerald-900/40 p-2.5 rounded-lg border border-emerald-800/50">
                  ℹ️ <strong>Fix for <code>ERROR: 22P02: invalid input syntax for type uuid: "settings_main"</code></strong>:
                  This updated script cleanly drops any earlier tables that had UUID columns and creates all tables with versatile TEXT IDs so that all records, custom IDs, and company settings insert cleanly.
                </p>
                <div className="relative">
                  <pre className="bg-slate-950 text-emerald-300/90 font-mono text-[11px] p-4 rounded-xl overflow-x-auto max-h-80 border border-emerald-900/70 select-all leading-relaxed whitespace-pre">
                    {sqlScriptText || 'Loading schema.sql...'}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Sync Result Feedback Banner */}
          {syncResult && (
            <div className={`p-5 rounded-2xl text-xs border ${
              syncResult.success
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}>
              <div className="flex items-start gap-3">
                {syncResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-2">
                  <p className="font-bold text-sm">{syncResult.message}</p>
                  {syncResult.counts && (
                    <div className="flex flex-wrap gap-2 text-[11px] font-medium pt-1">
                      <span className="bg-emerald-200/60 text-emerald-900 px-2.5 py-1 rounded-md">
                        ⚽ {syncResult.counts.players} Players
                      </span>
                      <span className="bg-emerald-200/60 text-emerald-900 px-2.5 py-1 rounded-md">
                        ✈️ {syncResult.counts.packages} Travel Packages
                      </span>
                      <span className="bg-emerald-200/60 text-emerald-900 px-2.5 py-1 rounded-md">
                        📰 {syncResult.counts.news} News Articles
                      </span>
                      <span className="bg-emerald-200/60 text-emerald-900 px-2.5 py-1 rounded-md">
                        📩 {syncResult.counts.inquiries} Inquiries
                      </span>
                      <span className="bg-emerald-200/60 text-emerald-900 px-2.5 py-1 rounded-md">
                        ⚙️ Company Settings
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Supabase Connection Form */}
          <form onSubmit={handleSaveSupabase} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-950">Supabase API Credentials</h3>
                <p className="text-xs text-slate-500">
                  Insert the values copied from your Supabase project dashboard into the fields below.
                </p>
              </div>

              {settings?.supabase?.connected && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Connected & Configured</span>
                </span>
              )}
            </div>

            {supabaseTestResult && (
              <div className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
                supabaseTestResult.success
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {supabaseTestResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="leading-relaxed">
                  <strong>{supabaseTestResult.success ? 'Connection Successful:' : 'Connection Failed:'}</strong>{' '}
                  {supabaseTestResult.message}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                1. Supabase Project URL *
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  placeholder="https://xyzabcdefghijklm.supabase.co"
                  value={supabaseProjectUrl}
                  onChange={(e) => setSupabaseProjectUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                👉 <strong>Where to copy:</strong> Go to Supabase Dashboard → Click <strong>Project Settings (gear icon)</strong> → Click <strong>API</strong> → Copy <strong>Project URL</strong>.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                2. Supabase Anon / Public API Key *
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                👉 <strong>Where to copy:</strong> On the exact same API page → Under <strong>Project API keys</strong> → Copy the <strong>anon (public)</strong> key.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Database Connection String / URI (Optional)
                </label>
                <input
                  type="password"
                  placeholder="postgresql://postgres:[password]@db.xyz.supabase.co:5432/postgres"
                  value={supabaseDbUri}
                  onChange={(e) => setSupabaseDbUri(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Found in: Project Settings → Database → Connection string
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Service Role Key (Optional - Bypasses RLS)
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseServiceRoleKey}
                  onChange={(e) => setSupabaseServiceRoleKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Secret key used for elevated administrative operations
                </span>
              </div>
            </div>

            {/* Action Buttons Zone */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestSupabase}
                  disabled={testingSupabase || !supabaseProjectUrl || !supabaseAnonKey}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  {testingSupabase ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing Connection...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Test Connection</span>
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Supabase Connection'}</span>
                </button>
              </div>

              {/* High-visibility Data Push Button */}
              <button
                type="button"
                onClick={handleSyncSupabase}
                disabled={syncingSupabase || (!supabaseProjectUrl && !settings?.supabase?.projectUrl)}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-lg transition-all shadow-md flex items-center gap-2"
              >
                {syncingSupabase ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Pushing Data to Supabase...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 text-emerald-200" />
                    <span>Push / Sync All Website Data to Supabase Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Security & Audit Logs */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          {/* Change Password Form */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-950 pb-2 border-b border-slate-100">
              Administrator Security & Credentials
            </h2>

            {securityMsg && (
              <div className={`p-3 text-xs rounded-md ${
                securityMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {securityMsg.text}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (minimum 8 chars)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-800 rounded-md"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Full Chronological Audit Logs */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-950 pb-2 border-b border-slate-100">
              Administrative Activity Audit Trail
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">Actor</th>
                    <th className="py-2.5 px-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 font-semibold font-mono text-emerald-800 text-[11px]">
                        {log.action}
                      </td>
                      <td className="py-2 px-3 text-slate-600">{log.user}</td>
                      <td className="py-2 px-3 text-slate-900">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
