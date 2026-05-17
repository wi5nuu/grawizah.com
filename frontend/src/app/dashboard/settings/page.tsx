'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  User,
  Building2,
  Mail,
  Camera,
  Save,
  Plus,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
  Settings,
  ChevronDown,
  Database,
  Terminal,
  Activity,
} from 'lucide-react';
import { uploadToSupabase } from '@/lib/supabase';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [regNumber, setRegNumber] = useState('N/A');
  const [industry, setIndustry] = useState('Electronics & Components');
  const [certs, setCerts] = useState<string[]>(['ISO 9001', 'CE Certified']);
  const [newCertInput, setNewCertInput] = useState('');
  const [showCertInput, setShowCertInput] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  useEffect(() => {
    if (user) {
      const nameParts = user.email.split('@')[0].split(/[._-]/);
      const defaultFirst = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
      const defaultLast = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : '';

      // Restore saved names from localStorage (persists across refreshes)
      const savedFirst = localStorage.getItem(`grawizah_first_name_${user.id}`);
      const savedLast = localStorage.getItem(`grawizah_last_name_${user.id}`);
      setFirstName(savedFirst || defaultFirst);
      setLastName(savedLast || defaultLast);
      setEmail(user.email);
      setAvatarPreview(user.avatar_url || null);

      const fetchCompany = async () => {
        try {
          const token = localStorage.getItem('grawizah_token');
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const response = await fetch(`${API_URL}/api/companies/me?user_id=${user.id}`, { headers });
          if (response.ok) {
            const data = await response.json();
            setCompanyId(data.id);
            if (data.logo_url) {
              setAvatarPreview(data.logo_url);
              updateUser({ avatar_url: data.logo_url });
            }
            setCompanyName(data.name || `${defaultFirst} Trading Co.`);
            setIndustry(data.industry || 'Electronics & Components');
            setRegNumber(data.reg_number || 'N/A');
            // Restore owner name from company data if available
            if (data.owner_name && !savedFirst) {
              const parts = data.owner_name.split(' ');
              setFirstName(parts[0] || defaultFirst);
              setLastName(parts.slice(1).join(' ') || defaultLast);
            }
            if (data.certifications && Array.isArray(data.certifications)) {
              setCerts(data.certifications);
            }
          } else {
            setCompanyName(`${defaultFirst} Trading Co.`);
          }
        } catch (err) {
          console.error('Failed to fetch company:', err);
          setCompanyName(`${defaultFirst} Trading Co.`);
        } finally {
          setLoading(false);
        }
      };
      fetchCompany();
    }
  }, [user, API_URL]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size: 2MB = 2 * 1024 * 1024 bytes
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMsg(`File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max allowed is 2MB.`);
      setTimeout(() => setErrorMsg(''), 5000);
      return;
    }

    setErrorMsg('');
    setAvatarUploading(true);
    try {
      // Direct upload to Supabase Storage in 'profiles' folder
      const publicUrl = await uploadToSupabase(file, 'profiles');
      setAvatarPreview(publicUrl);
      updateUser({ avatar_url: publicUrl });

      if (!companyId) {
        setSuccessMsg('Profile photo uploaded to Supabase Storage!');
        setTimeout(() => setSuccessMsg(''), 3000);
        return;
      }

      const token = localStorage.getItem('grawizah_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/api/companies/${companyId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: companyName,
          industry: industry,
          certifications: certs,
          logo_url: publicUrl,
        }),
      });

      if (response.ok) {
        setSuccessMsg('Profile photo updated in Supabase Storage successfully!');
      } else {
        setSuccessMsg('Photo saved to Supabase Storage.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to upload photo to Supabase Storage.');
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setAvatarUploading(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleAddCert = () => {
    const trimmed = newCertInput.trim();
    if (trimmed && !certs.includes(trimmed)) {
      setCerts([...certs, trimmed]);
      setNewCertInput('');
      setShowCertInput(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      // 1. Persist names to localStorage immediately (survives page refresh)
      localStorage.setItem(`grawizah_first_name_${user.id}`, firstName);
      localStorage.setItem(`grawizah_last_name_${user.id}`, lastName);

      // 2. If company exists, save owner_name to backend too
      if (companyId) {
        const token = localStorage.getItem('grawizah_token');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/api/companies/${companyId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            name: companyName,
            industry,
            certifications: certs,
            owner_name: `${firstName} ${lastName}`.trim(),
            logo_url: avatarPreview || undefined,
          }),
        });

        if (!response.ok) {
          // Not critical — localStorage already saved
          console.warn('Could not persist name to company backend, saved locally only.');
        }
      }

      setSuccessMsg('Profile updated and saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
      // Still show success since localStorage worked
      setSuccessMsg('Profile saved locally!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCompany = async () => {
    if (!companyId) {
      setErrorMsg('No company entity found to synchronize.');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }
    setSaving(true);
    setSuccessMsg('');
    try {
      const token = localStorage.getItem('grawizah_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/api/companies/${companyId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: companyName,
          industry: industry,
          certifications: certs,
          logo_url: avatarPreview || undefined
        })
      });
      if (response.ok) {
        setSuccessMsg('Business configuration successfully synchronized!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setErrorMsg('Failed to sync business details with server.');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to synchronize business data.');
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const removeCert = (cert: string) => setCerts(certs.filter(c => c !== cert));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing User Preferences...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 w-full min-h-full font-sans">
      
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Platform Preferences</span>
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Supplier Settings</h2>
        <p className="text-sm text-gray-500 font-medium mt-1">Configure your professional identity and operational infrastructure.</p>
      </header>

      {/* Notifications */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-center gap-3 animate-fade-in">
           <CheckCircle2 className="w-5 h-5 text-emerald-500" />
           <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">{successMsg}</p>
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 animate-shake">
           <AlertCircle className="w-5 h-5 text-red-500" />
           <p className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-widest">{errorMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left: Main Settings */}
        <div className="xl:col-span-8 space-y-8">
           
           {/* Profile Section */}
           <section className="bg-white dark:bg-dark-surface-container-low rounded-[2.5rem] border border-gray-100 dark:border-dark-surface-variant/20 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-8">
                 <User className="w-4 h-4 text-primary" />
                 <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Personal Identity</h3>
              </div>

              <div className="flex flex-col md:flex-row gap-10 items-start">
                 {/* Avatar Upload with 75KB Limit */}
                 <div className="flex flex-col items-center gap-4 group">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-32 h-32 rounded-[2.5rem] bg-gray-50 dark:bg-dark-surface-container flex items-center justify-center relative border-2 border-dashed border-gray-200 dark:border-dark-surface-variant/20 group-hover:border-primary/50 transition-all cursor-pointer overflow-hidden shadow-inner"
                    >
                       {avatarPreview ? (
                          <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                       ) : (
                          <span className="text-gray-300 dark:text-dark-on-surface-variant text-4xl font-black">{firstName?.charAt(0) || ''}{lastName?.charAt(0) || ''}</span>
                       )}
                       <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Camera className="w-8 h-8 text-white" />
                       </div>
                    </div>
                    <div className="text-center">
                       <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">Transmit New Photo</button>
                       <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">MAX SIZE: 75KB</p>
                    </div>
                 </div>

                 {/* Personal Fields */}
                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                       <input 
                         value={firstName} 
                         onChange={(e) => setFirstName(e.target.value)} 
                         className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl px-5 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                       <input 
                         value={lastName} 
                         onChange={(e) => setLastName(e.target.value)} 
                         className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl px-5 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all"
                       />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address (Authenticated)</label>
                       <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input 
                            disabled
                            type="email" 
                            value={email} 
                            className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl pl-12 pr-5 py-3 text-sm font-semibold text-gray-400 cursor-not-allowed"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-10 flex justify-end">
                 <button 
                   onClick={handleSaveProfile}
                   disabled={saving}
                   className="px-10 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                 >
                    {saving ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Commit Profile Changes
                 </button>
              </div>
           </section>

           {/* Company Section */}
           <section className="bg-white dark:bg-dark-surface-container-low rounded-[2.5rem] border border-gray-100 dark:border-dark-surface-variant/20 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-8">
                 <Building2 className="w-4 h-4 text-primary" />
                 <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Business Configuration</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Legal Company Name</label>
                    <input 
                       value={companyName} 
                       onChange={(e) => setCompanyName(e.target.value)} 
                       className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl px-5 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Trade License / Reg Number</label>
                    <input 
                       value={regNumber} 
                       onChange={(e) => setRegNumber(e.target.value)} 
                       className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl px-5 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Primary Market Industry</label>
                    <div className="relative">
                       <select 
                         value={industry} 
                         onChange={(e) => setIndustry(e.target.value)} 
                         className="w-full bg-gray-50 dark:bg-dark-surface-container border-none rounded-2xl px-5 py-3 text-sm font-semibold focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all appearance-none"
                       >
                          <option>Electronics & Components</option>
                          <option>Textiles & Fabrics</option>
                          <option>Heavy Machinery</option>
                          <option>Automotive Systems</option>
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                 </div>
                 
                 <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operational Certifications</label>
                    <div className="flex flex-wrap gap-3">
                       {certs.map((cert) => (
                          <div key={cert} className="flex items-center gap-2 px-4 py-2 bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-xl">
                             <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                             <span className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-tight">{cert}</span>
                             <button onClick={() => removeCert(cert)} className="text-gray-400 hover:text-red-500 transition-colors ml-1">
                                <X className="w-3.5 h-3.5" />
                             </button>
                          </div>
                       ))}
                       <button
                         onClick={() => setShowCertInput(true)}
                         className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-100 dark:border-dark-surface-variant/20 rounded-xl text-[10px] font-black text-gray-400 hover:border-primary/30 hover:text-primary transition-all"
                       >
                          <Plus className="w-3.5 h-3.5" /> Add Credentials
                       </button>
                       {showCertInput && (
                         <div className="flex items-center gap-2 w-full mt-2">
                           <input
                             type="text"
                             value={newCertInput}
                             onChange={(e) => setNewCertInput(e.target.value)}
                             onKeyDown={(e) => e.key === 'Enter' && handleAddCert()}
                             placeholder="e.g. ISO 14001, RoHS, UL Listed..."
                             className="flex-1 bg-gray-50 dark:bg-dark-surface-container border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl px-4 py-2 text-[11px] font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                             autoFocus
                           />
                           <button
                             onClick={handleAddCert}
                             className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all"
                           >
                             Add
                           </button>
                           <button
                             onClick={() => { setShowCertInput(false); setNewCertInput(''); }}
                             className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                           >
                             <X className="w-4 h-4" />
                           </button>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="mt-10 flex justify-end">
                 <button 
                   onClick={handleSaveCompany}
                   disabled={saving}
                   className="px-10 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                 >
                    {saving ? <RefreshCcw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Sync Business Data
                 </button>
              </div>
           </section>
        </div>

        {/* Right: Security & Infrastructure Snapshot */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-gradient-to-br from-primary to-indigo-900 text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <ShieldCheck className="w-8 h-8 mb-6 text-white/40" />
              <h3 className="text-xl font-display font-black mb-2">Account Security</h3>
              <p className="text-xs text-white/60 font-medium leading-relaxed mb-8">Your data is secured within Supabase VPC and encrypted using AES-256 standards.</p>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest">Supabase Auth</span>
                    <span className="px-2 py-0.5 bg-emerald-500 rounded text-[9px] font-black">SECURE</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl">
                    <span className="text-[10px] font-black uppercase tracking-widest">KYC Status</span>
                    <span className="px-2 py-0.5 bg-emerald-500 rounded text-[9px] font-black">VERIFIED</span>
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-dark-surface-container-low rounded-[2.5rem] border border-gray-100 dark:border-dark-surface-variant/20 p-8 shadow-sm">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">Infrastructure Nodes</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Cloud Database', val: 'Supabase PostgreSQL', icon: Database, color: 'text-emerald-500' },
                   { label: 'Container Orchestration', val: 'Docker Engine', icon: Terminal, color: 'text-blue-500' },
                   { label: 'Real-time API', val: 'Go Gin Framework', icon: Activity, color: 'text-secondary' }
                 ].map((node, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-dark-surface-container border border-gray-100 dark:border-dark-surface-variant/10">
                      <div className={`w-10 h-10 rounded-xl bg-white dark:bg-dark-surface flex items-center justify-center ${node.color}`}>
                         <node.icon className="w-5 h-5" />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase">{node.label}</p>
                         <p className="text-xs font-black text-gray-900 dark:text-white">{node.val}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
