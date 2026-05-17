'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Save, 
  User, 
  Building2, 
  MapPin, 
  Settings as SettingsIcon, 
  AlertCircle, 
  RefreshCcw, 
  ShieldCheck,
  Camera
} from 'lucide-react';
import { uploadToSupabase } from '@/lib/supabase';

export default function BuyerSettingsPage() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    country: '',
    businessType: 'distributor',
    avatar: null as File | null
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setAvatarPreview(user.avatar_url || null);
      try {
        const token = localStorage.getItem('grawizah_token');
        const res = await fetch(`${API_URL}/api/buyers/${user.id}`, {
          headers: { ...(token && { 'Authorization': `Bearer ${token}` }) }
        });
        if (res.ok) {
          const buyer = await res.json();
          setFormData({
            companyName: buyer.company_name || '',
            country: buyer.country || '',
            businessType: 'distributor',
            avatar: null
          });
        } else {
          // Fallback if buyer is not created yet
          setFormData(prev => ({
            ...prev,
            companyName: user.email?.split('@')[0].toUpperCase() || 'BUYER',
            country: 'Indonesia'
          }));
        }
      } catch (err) {
        console.error('Failed to fetch buyer profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, API_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 2MB
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: `File too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB. Max is 2MB.` });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return;
    }

    setMessage({ type: '', text: '' });
    setSaving(true);
    try {
      // Direct upload to Supabase Storage in 'profiles' folder
      const publicUrl = await uploadToSupabase(file, 'profiles');
      setAvatarPreview(publicUrl);
      updateUser({ avatar_url: publicUrl });
      setMessage({ type: 'success', text: 'Photo uploaded to Supabase Storage successfully!' });
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Failed to upload photo to Supabase Storage.' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('grawizah_token');
      const res = await fetch(`${API_URL}/api/buyers/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          company_name: formData.companyName,
          country: formData.country
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save profile');
      }
      
      updateUser({
        company_name: formData.companyName,
        avatar_url: avatarPreview || undefined
      });
      setMessage({ type: 'success', text: 'Profile updated successfully. Your trust score will be recalculated.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Error saving profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-20" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 w-full min-h-full font-sans relative">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">USER PREFERENCES</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
          Buyer Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Manage your buyer profile, business type, and credentials to boost your Trust Score.
        </p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-bold border flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/30' 
            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30'
        }`}>
          {message.type === 'success' ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      {/* Main Settings Card */}
      <div className="bg-white dark:bg-dark-surface-container rounded-[2rem] border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm overflow-hidden">
        <form onSubmit={handleSave} className="p-6 md:p-10">
          <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-8 flex items-center gap-2 pb-4 border-b border-gray-50 dark:border-dark-surface-variant/10">
            <Building2 className="w-5 h-5 text-gray-400" /> Company Profile
          </h2>

          <div className="flex flex-col md:flex-row gap-10 items-start mb-8 pb-8 border-b border-gray-50 dark:border-dark-surface-variant/10">
            {/* Avatar Upload with 75KB Limit */}
            <div className="flex flex-col items-center gap-4 group shrink-0">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-[2.5rem] bg-gray-50 dark:bg-dark-surface flex items-center justify-center relative border-2 border-dashed border-gray-200 dark:border-dark-surface-variant/20 group-hover:border-primary/50 transition-all cursor-pointer overflow-hidden shadow-inner"
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-300 dark:text-dark-on-surface-variant text-4xl font-black">
                    {user?.email?.[0].toUpperCase() || 'U'}
                  </span>
                )}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-center">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:underline">Transmit New Photo</button>
                <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">MAX SIZE: 2MB</p>
              </div>
            </div>

            {/* Company Name Field */}
            <div className="flex-1 space-y-6 w-full">
              <div>
                <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Company Name</label>
                <input 
                  type="text" 
                  name="companyName" 
                  value={formData.companyName} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-dark-surface-container-high outline-none transition-all dark:text-white"
                  placeholder="e.g. Global Imports Ltd"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Country / Sourcing Hub</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange} 
                    required 
                    className="w-full bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-dark-surface-container-high outline-none transition-all dark:text-white"
                    placeholder="e.g. Germany"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Business Type</label>
                <select 
                  name="businessType" 
                  value={formData.businessType} 
                  onChange={handleChange}
                  className="w-full bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-dark-surface-container-high outline-none transition-all dark:text-white"
                >
                  <option value="distributor">Wholesaler / Distributor</option>
                  <option value="retailer">Retailer</option>
                  <option value="manufacturer">Manufacturer (Raw Materials Buyer)</option>
                  <option value="trading_company">Trading Company</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Primary Contact Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="w-full bg-gray-100 dark:bg-dark-surface-container-low border border-gray-200 dark:border-dark-surface-variant/10 rounded-xl pl-12 pr-4 py-3.5 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Email address is bound to SSO credentials.</p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-50 dark:border-dark-surface-variant/10 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="px-8 py-3.5 bg-primary text-white rounded-xl font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md shadow-primary/10 disabled:opacity-50"
            >
              {saving ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
