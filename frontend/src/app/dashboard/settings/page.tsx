'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Building2, User, Bell, Shield, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('company');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow p-4">
              <nav className="space-y-1">
                {[
                  { id: 'company', label: 'Company Profile', icon: Building2 },
                  { id: 'account', label: 'Account', icon: User },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'security', label: 'Security', icon: Shield },
                  { id: 'billing', label: 'Billing', icon: CreditCard },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="col-span-9">
            <div className="bg-white rounded-lg shadow p-6">
              {activeTab === 'company' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Company Profile</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Your Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Indonesia"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIB (Business Identification Number)
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="1234567890123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NPWP (Tax ID)
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="12.345.678.9-012.000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Export License
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="Export License Number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Export Experience (Years)
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="5"
                      />
                    </div>
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'account' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="input-field"
                        value={user?.email || ''}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        className="input-field"
                        value={user?.role || ''}
                        disabled
                      />
                    </div>
                    <button type="button" className="btn-primary">
                      Change Password
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Email Notifications', desc: 'Receive email updates' },
                      { label: 'WhatsApp Notifications', desc: 'Receive WhatsApp alerts' },
                      { label: 'New Inquiry Alerts', desc: 'Get notified of new inquiries' },
                      { label: 'Buyer Radar Updates', desc: 'Weekly buyer intelligence reports' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500 mb-3">Add an extra layer of security</p>
                      <button className="btn-primary">Enable 2FA</button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Active Sessions</h3>
                      <p className="text-sm text-gray-500 mb-3">Manage your active sessions</p>
                      <button className="btn-secondary">View Sessions</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Billing & Subscription</h2>
                  <div className="space-y-4">
                    <div className="p-6 border-2 border-primary-600 rounded-lg bg-primary-50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Premium Plan</h3>
                          <p className="text-sm text-gray-600">Full access to all features</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-primary-700">$99</p>
                          <p className="text-sm text-gray-600">/month</p>
                        </div>
                      </div>
                      <button className="btn-primary w-full">Manage Subscription</button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                      <p className="text-sm text-gray-500 mb-3">Visa ending in 4242</p>
                      <button className="btn-secondary">Update Payment</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
