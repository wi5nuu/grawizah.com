'use client';

import { useState } from 'react';
import { Search, Filter, ShieldCheck, Star, Activity, ArrowRight, ShieldAlert, BadgeCheck } from 'lucide-react';
import Image from 'next/image';

const mockBuyers = [
  {
    id: 'B-8472',
    name: 'Ashar Grosir Parfum',
    country: 'United Arab Emirates',
    type: 'Wholesaler',
    score: 93,
    status: 'Verified',
    importHistory: '12 Shipments',
    lastActive: '2 hours ago',
    risk: 'Low',
    tags: ['Fragrance', 'Spices']
  },
  {
    id: 'B-3921',
    name: 'EuroTrade Logistics GmbH',
    country: 'Germany',
    type: 'Distributor',
    score: 88,
    status: 'Verified',
    importHistory: '45 Shipments',
    lastActive: '1 day ago',
    risk: 'Low',
    tags: ['Commodities', 'Coffee']
  },
  {
    id: 'B-1093',
    name: 'Chen & Sons Imports',
    country: 'Singapore',
    type: 'Retail Chain',
    score: 65,
    status: 'Pending',
    importHistory: '3 Shipments',
    lastActive: '3 days ago',
    risk: 'Medium',
    tags: ['Spices', 'Candlenut']
  },
  {
    id: 'B-9920',
    name: 'Global Ventures LLC',
    country: 'United States',
    type: 'Trading Company',
    score: 42,
    status: 'Unverified',
    importHistory: '0 Shipments',
    lastActive: '1 week ago',
    risk: 'High',
    tags: ['General']
  }
];

export default function BuyerRadarPage() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);

  const filtered = mockBuyers.filter(b => {
    const matchesFilter = filter === 'All' || b.risk === filter;
    const matchesSearch = 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewProfile = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="p-6 md:p-10 w-full min-h-full font-sans relative">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">AI INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
            Buyer Radar
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium max-w-xl">
            Proactively monitor, filter, and analyze incoming buyers globally. AI Lead Scoring ensures you only engage with high-quality, verified importers.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
        <div className="flex gap-2 w-full overflow-x-auto pb-2 sm:pb-0">
          {['All', 'Low', 'Medium', 'High'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition ${
                filter === f
                  ? 'bg-primary text-white shadow-md shadow-primary/10'
                  : 'bg-white dark:bg-dark-surface-container text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-dark-surface-variant/20 hover:bg-gray-50'
              }`}
            >
              {f === 'All' ? 'All Risks' : `${f} Risk`}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by ID or Name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-surface-variant/30 bg-white dark:bg-dark-surface-container text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>
      </div>

      {/* Buyer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(buyer => (
          <div key={buyer.id} className="bg-white dark:bg-dark-surface-container p-6 rounded-3xl border border-gray-100 dark:border-dark-surface-variant/20 shadow-sm hover:shadow-lg transition-all flex flex-col group cursor-pointer relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 rounded-full ${
              buyer.score >= 80 ? 'bg-emerald-500' : buyer.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
            }`} />

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center font-black text-gray-700 dark:text-gray-200 text-lg">
                {buyer.name.charAt(0)}
              </div>
              <div className="flex flex-col items-end">
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  buyer.score >= 80 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' : 
                  buyer.score >= 60 ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30' : 
                  'bg-red-50 text-red-600 dark:bg-red-900/30'
                }`}>
                  {buyer.score >= 80 ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                  Score: {buyer.score}
                </span>
                <span className="text-[9px] text-gray-400 font-bold mt-2 uppercase tracking-widest">
                  ID: {buyer.id}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="mb-6 flex-1">
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-1 line-clamp-1">{buyer.name}</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                📍 {buyer.country}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50 dark:bg-dark-surface-container-high p-4 rounded-2xl">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-200 flex items-center gap-1">
                  {buyer.status === 'Verified' && <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />}
                  {buyer.status}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">History</p>
                <p className="text-xs font-bold text-gray-900 dark:text-gray-200">{buyer.importHistory}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/10 pt-4 mt-auto">
              <span className="text-[10px] font-bold text-gray-400">{buyer.lastActive}</span>
              <button 
                onClick={handleViewProfile}
                className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-1 hover:gap-2 transition-all"
              >
                View Profile <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in z-50">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-black">Full Profile Locked</p>
            <p className="text-xs opacity-80">Upgrade to Enterprise for deep buyer background checks.</p>
          </div>
        </div>
      )}
    </div>
  );
}
