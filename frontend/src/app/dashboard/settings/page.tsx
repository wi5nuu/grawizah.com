'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('James');
  const [lastName, setLastName] = useState('Chen');
  const [email, setEmail] = useState(user?.email || 'j.chen@globaltrade.co');
  const [companyName, setCompanyName] = useState('Chen Manufacturing Ltd.');
  const [regNumber, setRegNumber] = useState('CN-9842100-XYZ');
  const [industry, setIndustry] = useState('Electronics & Components');
  const [certs, setCerts] = useState(['ISO 9001', 'CE Marked']);

  const removeCert = (cert: string) => setCerts(certs.filter(c => c !== cert));

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Bar */}
      <header className="h-20 bg-surface/80 backdrop-blur-md flex items-center px-8 border-b border-surface-variant/30 sticky top-0 z-30">
        <h2 className="text-2xl font-display font-bold text-on-surface">Supplier Settings</h2>
      </header>

      <div className="flex-1 p-8 max-w-[1440px] mx-auto w-full space-y-8 pb-20">
        {/* Profile Section */}
        <section className="bg-surface-container-lowest rounded-xl border border-surface-variant/50 p-6 hover:shadow-[0_8px_32px_rgba(109,40,217,0.06)] transition-shadow duration-300" style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.03)' }}>
          <div className="mb-6">
            <h3 className="text-xl font-headline font-semibold text-on-surface">Profile</h3>
            <p className="text-on-surface-variant text-sm mt-1">Manage your personal information and login credentials.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-fixed bg-surface-container flex items-center justify-center relative group cursor-pointer">
                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">{firstName[0]}{lastName[0]}</span>
                </div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white">photo_camera</span>
                </div>
              </div>
              <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Change Photo</button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">First Name</label>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-lg border-outline-variant bg-surface-bright px-4 py-2.5 text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Last Name</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-lg border-outline-variant bg-surface-bright px-4 py-2.5 text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-on-surface mb-2">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border-outline-variant bg-surface-bright px-4 py-2.5 text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none" />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity">Save Profile</button>
          </div>
        </section>

        {/* Company Details */}
        <section className="bg-surface-container-lowest rounded-xl border border-surface-variant/50 p-6 hover:shadow-[0_8px_32px_rgba(109,40,217,0.06)] transition-shadow duration-300" style={{ boxShadow: '0 4px 24px rgba(109,40,217,0.03)' }}>
          <div className="mb-6">
            <h3 className="text-xl font-headline font-semibold text-on-surface">Company Details</h3>
            <p className="text-on-surface-variant text-sm mt-1">Update your business information and operational capabilities.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-on-surface mb-2">Company Name</label>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full rounded-lg border-outline-variant bg-surface-bright px-4 py-2.5 text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Registration Number</label>
              <input value={regNumber} onChange={(e) => setRegNumber(e.target.value)} className="w-full rounded-lg border-outline-variant bg-surface-bright px-4 py-2.5 text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Primary Industry</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-lg border-outline-variant bg-surface-bright px-4 py-2.5 text-on-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all outline-none appearance-none">
                <option>Electronics & Components</option>
                <option>Textiles</option>
                <option>Heavy Machinery</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-on-surface mb-2">Certifications</label>
              <div className="flex flex-wrap gap-2">
                {certs.map((cert) => (
                  <span key={cert} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                    {cert}
                    <button onClick={() => removeCert(cert)} className="hover:text-error transition-colors"><span className="material-symbols-outlined text-[16px]">close</span></button>
                  </span>
                ))}
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-colors text-sm font-medium">
                  <span className="material-symbols-outlined text-[16px]">add</span> Add Certification
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button className="bg-gradient-to-r from-primary to-secondary text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity">Save Company Info</button>
          </div>
        </section>
      </div>
    </div>
  );
}
