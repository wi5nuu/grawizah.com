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
    <div className="flex-1 flex flex-col min-h-screen bg-[#fafafa] dark:bg-dark-background">
      <div className="flex-1 p-8 max-w-4xl w-full">
        <h2 className="text-[22px] font-extrabold text-gray-900 dark:text-dark-on-surface mb-6">Supplier Settings</h2>

        <div className="space-y-6">
          {/* Profile Section */}
          <section className="bg-white dark:bg-dark-surface-container-low rounded-xl border border-gray-200 dark:border-dark-surface-variant/30 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-on-surface">Profile</h3>
              <p className="text-gray-500 dark:text-dark-on-surface-variant text-sm mt-1">Manage your personal information and login credentials.</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-dark-surface-container flex items-center justify-center relative">
                  <span className="text-gray-400 dark:text-dark-on-surface-variant text-2xl font-bold">{firstName[0]}{lastName[0]}</span>
                  {/* Since image isn't available, keeping it simple */}
                </div>
                <button className="text-[13px] font-bold text-[#5300b7] dark:text-[#d0bcff] hover:text-[#430099] dark:hover:text-[#e8def8] transition-colors">Change Photo</button>
              </div>

              {/* Form Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-dark-on-surface-variant mb-1.5">First Name</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-dark-surface-variant/50 bg-white dark:bg-dark-surface px-3 py-2 text-sm text-gray-900 dark:text-dark-on-surface focus:border-[#5300b7] dark:focus:border-dark-primary focus:ring-1 focus:ring-[#5300b7] dark:focus:ring-dark-primary outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-dark-on-surface-variant mb-1.5">Last Name</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-dark-surface-variant/50 bg-white dark:bg-dark-surface px-3 py-2 text-sm text-gray-900 dark:text-dark-on-surface focus:border-[#5300b7] dark:focus:border-dark-primary focus:ring-1 focus:ring-[#5300b7] dark:focus:ring-dark-primary outline-none transition-colors" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-gray-700 dark:text-dark-on-surface-variant mb-1.5">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-dark-surface-variant/50 bg-white dark:bg-dark-surface px-3 py-2 text-sm text-gray-900 dark:text-dark-on-surface focus:border-[#5300b7] dark:focus:border-dark-primary focus:ring-1 focus:ring-[#5300b7] dark:focus:ring-dark-primary outline-none transition-colors" />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-2 px-6 rounded-md text-sm transition-colors shadow-sm">Save Profile</button>
            </div>
          </section>

          {/* Company Details */}
          <section className="bg-white dark:bg-dark-surface-container-low rounded-xl border border-gray-200 dark:border-dark-surface-variant/30 p-6 shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-on-surface">Company Details</h3>
              <p className="text-gray-500 dark:text-dark-on-surface-variant text-sm mt-1">Update your business information and operational capabilities.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-dark-on-surface-variant mb-1.5">Company Name</label>
                <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-dark-surface-variant/50 bg-white dark:bg-dark-surface px-3 py-2 text-sm text-gray-900 dark:text-dark-on-surface focus:border-[#5300b7] dark:focus:border-dark-primary focus:ring-1 focus:ring-[#5300b7] dark:focus:ring-dark-primary outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 dark:text-dark-on-surface-variant mb-1.5">Registration Number</label>
                <input value={regNumber} onChange={(e) => setRegNumber(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-dark-surface-variant/50 bg-white dark:bg-dark-surface px-3 py-2 text-sm text-gray-900 dark:text-dark-on-surface focus:border-[#5300b7] dark:focus:border-dark-primary focus:ring-1 focus:ring-[#5300b7] dark:focus:ring-dark-primary outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 dark:text-dark-on-surface-variant mb-1.5">Primary Industry</label>
                <div className="relative">
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-md border border-gray-300 dark:border-dark-surface-variant/50 bg-white dark:bg-dark-surface px-3 py-2 text-sm text-gray-900 dark:text-dark-on-surface focus:border-[#5300b7] dark:focus:border-dark-primary focus:ring-1 focus:ring-[#5300b7] dark:focus:ring-dark-primary outline-none transition-colors appearance-none">
                    <option>Electronics & Components</option>
                    <option>Textiles</option>
                    <option>Heavy Machinery</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-dark-on-surface-variant pointer-events-none text-sm">expand_more</span>
                </div>
              </div>
              <div className="md:col-span-2 mt-2">
                <label className="block text-[13px] font-bold text-gray-700 dark:text-dark-on-surface-variant mb-2">Certifications</label>
                <div className="flex flex-wrap gap-2">
                  {certs.map((cert) => (
                    <span key={cert} className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#dbeafe] dark:bg-blue-900/30 text-[#1e40af] dark:text-blue-300 text-[12px] font-bold">
                      {cert}
                      <button onClick={() => removeCert(cert)} className="hover:text-opacity-80 transition-opacity ml-1"><span className="material-symbols-outlined text-[14px] font-bold">close</span></button>
                    </span>
                  ))}
                  <button className="inline-flex items-center gap-1 px-3 py-1 rounded border border-dashed border-gray-300 dark:border-dark-surface-variant/50 text-gray-500 dark:text-dark-on-surface-variant hover:text-gray-700 dark:hover:text-dark-on-surface hover:border-gray-400 dark:hover:border-dark-surface-variant transition-colors text-[12px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">add</span> Add Certification
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-2 px-6 rounded-md text-sm transition-colors shadow-sm">Save Company Info</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
