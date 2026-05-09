'use client';

import { useState } from 'react';
import { Settings, Building, User, Bell, Shield, CreditCard, Save, CheckCircle2, Camera } from 'lucide-react';

const tabs = [
  { id: 'company', icon: Building, label: 'Company' },
  { id: 'account', icon: User, label: 'Account' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'security', icon: Shield, label: 'Security' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your company profile, account, and preferences</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg text-sm font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4" /> Changes saved successfully
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition ${activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'company' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Company Profile</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                  <input className="input-field" defaultValue="PT Export Indonesia" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                    <input className="input-field" defaultValue="Indonesia" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Export Experience (years)</label>
                    <input type="number" className="input-field" defaultValue="8" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea className="input-field h-24 resize-none" defaultValue="Leading exporter of premium Indonesian agricultural products." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">NIB (Business ID)</label>
                    <input className="input-field" placeholder="Enter NIB" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">NPWP (Tax ID)</label>
                    <input className="input-field" placeholder="Enter NPWP" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                  <input className="input-field" placeholder="https://your-company.com" />
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>
              <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-500 rounded-2xl flex items-center justify-center">
                    <span className="text-xl font-bold text-white">J</span>
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-700 transition">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-500">user@company.com</p>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input className="input-field" defaultValue="user@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Name</label>
                  <input className="input-field" defaultValue="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone</label>
                  <input className="input-field" placeholder="+62 812 xxxx xxxx" />
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-5">
                {[
                  { key: 'inquiries', label: 'New Inquiry Alerts', desc: 'Get notified when a buyer sends an inquiry', checked: true },
                  { key: 'market', label: 'Market Opportunity Alerts', desc: 'Receive alerts for matching buyer searches', checked: true },
                  { key: 'leaderboard', label: 'Leaderboard Updates', desc: 'Weekly ranking position updates', checked: false },
                  { key: 'milestones', label: 'Product View Milestones', desc: 'Notify when products reach view milestones', checked: false },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-primary-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" /> Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                    <input type="password" className="input-field" placeholder="Min 8 characters" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <button className="btn-primary flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Update Password
                  </button>
                </div>
              </div>
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h2>
                <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
                <button className="btn-outline flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Enable 2FA
                </button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing & Plan</h2>
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 mb-6 border border-primary-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Current Plan</p>
                    <p className="text-2xl font-bold text-primary-700">Basic Intelligence</p>
                    <p className="text-xs text-gray-500 mt-1">Free forever • Core features included</p>
                  </div>
                  <span className="badge bg-green-100 text-green-700">Active</span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2 text-sm">
                  <span className="text-gray-600">Product Listings</span>
                  <span className="font-medium text-gray-900">5 / 10</span>
                </div>
                <div className="flex items-center justify-between py-2 text-sm">
                  <span className="text-gray-600">Inquiry Responses</span>
                  <span className="font-medium text-gray-900">Unlimited</span>
                </div>
                <div className="flex items-center justify-between py-2 text-sm">
                  <span className="text-gray-600">Trade Intelligence</span>
                  <span className="font-medium text-gray-900">Basic</span>
                </div>
              </div>
              <button className="btn-primary flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Upgrade Plan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
