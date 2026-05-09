'use client';

import { useState } from 'react';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Precision Titanium Gear Assembly', sku: 'IND-TG-4092', category: 'Machinery Parts', price: '$1,250.00', unit: 'unit', inventory: '450 in stock', status: 'active', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-z4xugnbst_GNW5NQUZF5z3_IFLzR8Uplc5_snvoNk20-xmyNeRLZhUGAM2kI9-1wehaJdHqamtV-nZqMY2uUbfT_jPf73GVE3Wu48xrNPWsnXiA86H9NCBCP_B4U1AK_tqv1cXMQGkjNaY1ayLvphx686aW7ggwLSeK78EWJgRnhxCrZjNmtdpQkT6Q9FhFgCkOBigrb92VxmXntbqdeHxj9p8NmAPbi7X1npXOx1G1Ipg8BYYHLuaf5424OabmRB95h_M0EGsC4' },
  { id: '2', name: 'Enterprise Microcontroller M-Series', sku: 'EL-MC-881', category: 'Electronics', price: '$45.50', unit: 'unit', inventory: '12,000 in stock', status: 'active', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHFjiumDaLjI_qcMttTeahxj6_VZ0S6WqCstPgcX58wPzHLSpKoDeAtbkyGCryqO_vlKk_6PaULr-T0EugC0VgRYQfXwUzO4Mx8PYbY7kE7BDg1Q9ow0WBtR844NCOUkuuKCRGyPPugEa7C6-M7CiWgx2znCkfMc8BZ62oT6H_42-eXVW93RMu6SG8YtXEdKnBueefvdhoVCSUEm2w6es2FgV3iLb3zAiFqmpIRthWc5V9uygfSRiHv4kyPRrtc8NJdvI30IzvrQuK' },
  { id: '3', name: 'Industrial Grade Synthetic Lubricant', sku: 'CH-SL-204', category: 'Chemicals', price: '$120.00', unit: 'barrel', inventory: '0 in stock', status: 'draft', image: '' },
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-on-surface">Products Management</h2>
          <p className="text-on-surface-variant mt-2 font-body">Manage your global trade catalog and product listings.</p>
        </div>
        <button className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg transition-all hover:scale-[1.02]">
          <span className="material-symbols-outlined">add</span> Add Product
        </button>
      </header>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Products', value: '1,248', icon: 'inventory_2', change: '+12% from last month', bg: 'bg-primary-fixed text-primary' },
          { label: 'Active Listings', value: '1,105', icon: 'check_circle', change: '+5% from last month', bg: 'bg-secondary-fixed text-secondary' },
          { label: 'Total Views', value: '45.2K', icon: 'visibility', change: '+18% from last month', bg: 'bg-tertiary-fixed text-tertiary' },
          { label: 'Avg. Quality Score', value: '94/100', icon: 'star', change: 'Stable this month', bg: 'bg-primary-fixed text-primary', stable: true },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[16px] border border-surface-container-high shadow-ambient hover-lift transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-on-surface-variant text-sm font-medium">{stat.label}</p>
              <span className={`material-symbols-outlined ${stat.bg} p-2 rounded-lg`}>{stat.icon}</span>
            </div>
            <h3 className="text-3xl font-bold text-on-surface">{stat.value}</h3>
            <p className={`text-sm flex items-center mt-2 font-medium ${stat.stable ? 'text-on-surface-variant' : 'text-secondary'}`}>
              {!stat.stable && <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>}
              {stat.change}
            </p>
          </div>
        ))}
      </section>

      {/* Search and Filter Bar */}
      <section className="bg-white p-4 rounded-[16px] border border-surface-container-high shadow-ambient mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none transition-all text-sm" placeholder="Search products, SKUs..." />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-secondary focus:outline-none text-sm text-on-surface flex-1 md:flex-none cursor-pointer">
            <option>All Categories</option><option>Electronics</option><option>Machinery</option><option>Textiles</option>
          </select>
          <select className="px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:border-secondary focus:outline-none text-sm text-on-surface flex-1 md:flex-none cursor-pointer">
            <option>All Status</option><option>Active</option><option>Draft</option><option>Archived</option>
          </select>
          <button className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface flex items-center gap-2 hover:bg-surface-container-low transition-colors text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">filter_list</span> More Filters
          </button>
        </div>
      </section>

      {/* Products Table */}
      <section className="bg-white rounded-[16px] border border-surface-container-high shadow-ambient overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-variant/50">
                <th className="py-4 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider w-10"><input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" /></th>
                <th className="py-4 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Product</th>
                <th className="py-4 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Price (USD)</th>
                <th className="py-4 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Inventory</th>
                <th className="py-4 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/50">
              {MOCK_PRODUCTS.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="py-4 px-6"><input type="checkbox" className="rounded border-outline-variant text-primary focus:ring-primary" /></td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-surface-variant flex items-center justify-center">
                        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-outline-variant text-2xl">image</span>}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface text-sm">{p.name}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">SKU: {p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-on-surface">{p.category}</td>
                  <td className="py-4 px-6 text-sm font-medium text-on-surface">{p.price} <span className="text-xs text-on-surface-variant font-normal">/ {p.unit}</span></td>
                  <td className="py-4 px-6 text-sm text-on-surface">{p.inventory}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${p.status === 'active' ? 'bg-secondary/10 text-secondary' : 'bg-outline-variant/30 text-on-surface-variant'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-secondary' : 'bg-outline'}`} />
                      {p.status === 'active' ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-outline hover:text-primary transition-colors p-1"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                    <button className="text-outline hover:text-primary transition-colors p-1 ml-2"><span className="material-symbols-outlined text-[20px]">more_vert</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-surface-variant/50 flex items-center justify-between bg-surface-container-lowest">
          <p className="text-sm text-on-surface-variant">Showing <span className="font-semibold text-on-surface">1</span> to <span className="font-semibold text-on-surface">3</span> of <span className="font-semibold text-on-surface">1,248</span> results</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-outline-variant rounded text-on-surface-variant disabled:opacity-50 text-sm" disabled>Previous</button>
            <button className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded font-medium text-sm">1</button>
            <button className="px-3 py-1 border border-outline-variant rounded text-on-surface hover:bg-surface-container-low transition-colors text-sm">2</button>
            <button className="px-3 py-1 border border-outline-variant rounded text-on-surface-variant hover:bg-surface-container-low text-sm">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}
