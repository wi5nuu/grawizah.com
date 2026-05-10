'use client';

import { useState } from 'react';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Precision Titanium Gear Assembly', sku: 'IND-TG-4092', category: 'Machinery Parts', price: '$1,250.00 / unit', inventory: '450 in stock', status: 'Active', image: '/images/product-gear.png' },
  { id: '2', name: 'Enterprise Microcontroller M-Series', sku: 'EL-MC-881', category: 'Electronics', price: '$45.50 / unit', inventory: '12,000 in stock', status: 'Active', image: '/images/product-chip.png' },
  { id: '3', name: 'Industrial Grade Synthetic Lubricant', sku: 'CH-SL-204', category: 'Chemicals', price: '$120.00 / barrel', inventory: '0 in stock', status: 'Draft', image: '' },
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full min-h-screen bg-[#fafafa] dark:bg-dark-background">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Products Management</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-[14px]">Manage your global trade catalog and product listings.</p>
        </div>
        <button className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2.5 rounded-md font-bold text-[14px] flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined text-[20px]">add</span> Add Product
        </button>
      </header>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Products', value: '1,248', icon: 'receipt_long', change: '+12% from last month', iconColor: 'text-[#5300b7] dark:text-[#d0bcff]' },
          { label: 'Active Listings', value: '1,105', icon: 'check_circle', change: '+5% from last month', iconColor: 'text-blue-500 dark:text-blue-400' },
          { label: 'Total Views', value: '45.2K', icon: 'visibility', change: '+18% from last month', iconColor: 'text-orange-500 dark:text-orange-400' },
          { label: 'Avg. Quality Score', value: '94/100', icon: 'star', change: 'Stable this month', iconColor: 'text-[#5300b7] dark:text-[#d0bcff]' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-sm border border-gray-100 dark:border-dark-surface-variant/30 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <p className="text-gray-500 dark:text-dark-on-surface-variant font-bold text-[13px]">{stat.label}</p>
              <div className={`p-1 ${stat.iconColor} bg-opacity-10 dark:bg-opacity-20 rounded-md flex items-center justify-center`}>
                 <span className="material-symbols-outlined text-[20px] opacity-80">{stat.icon}</span>
              </div>
            </div>
            <h3 className={`text-3xl font-extrabold mb-2 ${idx === 0 ? 'text-[#5300b7] dark:text-[#d0bcff]' : idx === 1 ? 'text-gray-600 dark:text-gray-300' : idx === 2 ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>{stat.value}</h3>
            <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 flex items-center">
              <span className="material-symbols-outlined text-[14px] mr-1">show_chart</span>
              {stat.change}
            </p>
          </div>
        ))}
      </section>

      {/* Search and Filter Bar */}
      <section className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-surface-variant/30 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">search</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#18181b] border border-gray-200 dark:border-dark-surface-variant/50 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#5300b7] dark:focus:ring-[#d0bcff]" placeholder="Search products, SKUs..." />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button className="px-5 py-2 bg-gray-900 dark:bg-[#18181b] hover:bg-gray-800 dark:hover:bg-[#27272a] text-white rounded-full text-[13px] font-bold transition-colors">All Categories</button>
          <button className="px-5 py-2 bg-gray-900 dark:bg-[#18181b] hover:bg-gray-800 dark:hover:bg-[#27272a] text-white rounded-full text-[13px] font-bold transition-colors">All Status</button>
          <button className="px-5 py-2 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-surface-container rounded-full text-[13px] font-bold flex items-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-[16px]">filter_list</span> More Filters
          </button>
        </div>
      </section>

      {/* Products Table */}
      <section className="bg-white dark:bg-[#18181b] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#18181b]">
                <th className="py-4 px-5 w-12"><input type="checkbox" className="rounded bg-white dark:bg-[#27272a] border-gray-300 dark:border-gray-600 text-[#2563eb] focus:ring-[#2563eb]" /></th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price (USD)</th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Inventory</th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-5 text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {MOCK_PRODUCTS.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-[#27272a] transition-colors">
                  <td className="py-4 px-5"><input type="checkbox" className="rounded bg-white dark:bg-[#27272a] border-gray-300 dark:border-gray-600 text-[#2563eb] focus:ring-[#2563eb]" /></td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-gray-100 dark:bg-[#27272a] border border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center shrink-0">
                        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">image</span>}
                      </div>
                      <div>
                        <p className="font-bold text-[14px] text-gray-900 dark:text-gray-300">{p.name}</p>
                        <p className="text-[12px] text-gray-500 dark:text-gray-500 mt-0.5">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-[13px] text-gray-600 dark:text-gray-400 font-medium">{p.category}</td>
                  <td className="py-4 px-5 text-[13px] text-gray-600 dark:text-gray-400 font-medium">{p.price}</td>
                  <td className="py-4 px-5 text-[13px] text-gray-600 dark:text-gray-400 font-medium">{p.inventory}</td>
                  <td className="py-4 px-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[12px] font-bold ${p.status === 'Active' ? 'text-blue-600 dark:text-[#60a5fa]' : 'text-gray-500 dark:text-gray-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Active' ? 'bg-blue-600 dark:bg-[#3b82f6]' : 'bg-gray-400 dark:bg-gray-500'}`} />
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors p-1"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                    <button className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors p-1 ml-1"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <p className="text-[13px] text-gray-500 dark:text-gray-400">Showing <span className="font-bold text-gray-900 dark:text-white">1</span> to <span className="font-bold text-gray-900 dark:text-white">3</span> of <span className="font-bold text-gray-900 dark:text-white">1,248</span> results</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#18181b] hover:bg-gray-50 rounded text-gray-600 dark:text-gray-500 text-[13px] font-bold transition-colors">Previous</button>
            <button className="px-3 py-1 bg-gray-100 dark:bg-[#27272a] rounded text-gray-900 dark:text-gray-400 text-[13px] font-bold">1</button>
            <button className="px-3 py-1 bg-transparent hover:bg-gray-50 dark:hover:bg-transparent rounded text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 text-[13px] font-bold transition-colors">2</button>
            <button className="px-3 py-1 bg-transparent hover:bg-gray-50 dark:hover:bg-transparent rounded text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 text-[13px] font-bold transition-colors">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
