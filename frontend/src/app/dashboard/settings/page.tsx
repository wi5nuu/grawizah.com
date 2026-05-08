'use client';

import { useState } from 'react';
import { Settings, Building, User, Bell, Shield, CreditCard, Save } from 'lucide-react';

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
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-400" /> Settings
        </h1>
        <p className="text-gray-500 mt-1">Manage your company profile, account, and preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition text-left ${
                  activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm animate-fade-in">
              Settings saved successfully!
            </div>
          )}

          {activeTab === 'company' && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-6">Company Profile</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input className="input-field" defaultValue="PT Export Indonesia" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input className="input-field" defaultValue="Indonesia" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Export Experience (years)</label>
                    <input type="number" className="input-field" defaultValue="8" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="input-field h-24 resize-none" defaultValue="Leading exporter of premium Indonesian agricultural products." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIB (Business ID)</label>
                    <input className="input-field" placeholder="Enter NIB" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NPWP (Tax ID)</label>
                    <input className="input-field" placeholder="Enter NPWP" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input className="input-field" placeholder="https://your-company.com" />
                </div>
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-6">Account Settings</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input className="input-field" defaultValue="user@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input className="input-field" defaultValue="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input className="input-field" placeholder="+62 812 xxxx xxxx" />
                </div>
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'New Inquiry Alerts', desc: 'Get notified when a buyer sends an inquiry' },
                  { label: 'Market Opportunity Alerts', desc: 'Receive alerts for matching buyer searches' },
                  { label: 'Leaderboard Updates', desc: 'Weekly ranking position updates' },
                  { label: 'Product View Milestones', desc: 'Notify when products reach view milestones' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-primary-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                ))}
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" className="input-field" placeholder="Min 8 characters" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" /> Update Password
                </button>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-6">Billing & Plan</h2>
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary-800">Current Plan: Basic Intelligence</p>
                    <p className="text-xs text-primary-600">Free forever • Core features included</p>
                  </div>
                  <button className="btn-primary btn-sm">Upgrade to Premium</button>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Contact sales at <strong>sales@grawizah.com</strong> for custom enterprise pricing and premium plan details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
