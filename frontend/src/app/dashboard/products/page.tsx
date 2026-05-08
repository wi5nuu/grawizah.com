'use client';

import { useState } from 'react';
import { Package, Plus, Search, Edit2, Trash2, Eye, MoreVertical, Bot } from 'lucide-react';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Premium Virgin Coconut Oil', hs_code: '151311', category: 'Agriculture', country_origin: 'Indonesia', price_range_min: 800, price_range_max: 1200, currency: 'USD', listing_score: 92, view_count: 1247, inquiry_count: 34, status: 'active' },
  { id: '2', name: 'Arabica Coffee Beans - Grade 1', hs_code: '090111', category: 'Food & Beverage', country_origin: 'Indonesia', price_range_min: 3500, price_range_max: 5000, currency: 'USD', listing_score: 88, view_count: 892, inquiry_count: 28, status: 'active' },
  { id: '3', name: 'Teak Wood Planks - KD Certified', hs_code: '440729', category: 'Construction Materials', country_origin: 'Indonesia', price_range_min: 600, price_range_max: 900, currency: 'USD', listing_score: 85, view_count: 678, inquiry_count: 19, status: 'active' },
  { id: '4', name: 'Organic Turmeric Powder', hs_code: '091030', category: 'Agriculture', country_origin: 'Indonesia', price_range_min: 2000, price_range_max: 3500, currency: 'USD', listing_score: 79, view_count: 543, inquiry_count: 15, status: 'draft' },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', category: '', hs_code: '', price_range_min: '', price_range_max: '', currency: 'USD', moq: '', country_origin: 'Indonesia' });

  const filteredProducts = MOCK_PRODUCTS.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-orange-600 bg-orange-50';
  };

  const handleAddProduct = async () => {
    try {
      await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('grawizah_token')}` },
        body: JSON.stringify(newProduct),
      });
      setShowAddModal(false);
      setNewProduct({ name: '', description: '', category: '', hs_code: '', price_range_min: '', price_range_max: '', currency: 'USD', moq: '', country_origin: 'Indonesia' });
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-500 mt-1">Manage your product listings and optimize for visibility</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Products', value: MOCK_PRODUCTS.length, icon: Package },
          { label: 'Active', value: MOCK_PRODUCTS.filter(p => p.status === 'active').length },
          { label: 'Total Views', value: '3,360' },
          { label: 'Total Inquiries', value: '96' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-10" />
      </div>

      {/* Products Table */}
      <div className="table-container">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">HS Code</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Price Range</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Score</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Views</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Inquiries</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category} • {product.country_origin}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="badge-primary text-xs">{product.hs_code}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  ${product.price_range_min.toLocaleString()} - ${product.price_range_max.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`badge text-xs font-semibold ${getScoreColor(product.listing_score)}`}>
                    {product.listing_score}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">{product.view_count.toLocaleString()}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-600">{product.inquiry_count}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`badge text-xs capitalize ${product.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-accent-600 rounded-lg hover:bg-accent-50 transition" title="Optimize with AI">
                      <Bot className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
              <p className="text-sm text-gray-500 mt-1">Fill in the product details below</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="input-field" placeholder="e.g. Premium Virgin Coconut Oil" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="input-field h-24 resize-none" placeholder="Describe your product..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="select-field">
                    <option value="">Select</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Construction Materials">Construction Materials</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Handicrafts">Handicrafts</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HS Code</label>
                  <input value={newProduct.hs_code} onChange={(e) => setNewProduct({...newProduct, hs_code: e.target.value})} className="input-field" placeholder="e.g. 151311" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (USD)</label>
                  <input type="number" value={newProduct.price_range_min} onChange={(e) => setNewProduct({...newProduct, price_range_min: e.target.value})} className="input-field" placeholder="800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (USD)</label>
                  <input type="number" value={newProduct.price_range_max} onChange={(e) => setNewProduct({...newProduct, price_range_max: e.target.value})} className="input-field" placeholder="1200" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MOQ (units)</label>
                <input type="number" value={newProduct.moq} onChange={(e) => setNewProduct({...newProduct, moq: e.target.value})} className="input-field" placeholder="1000" />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleAddProduct} className="btn-primary">Add Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
