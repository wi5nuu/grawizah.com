'use client';

import React, { useState, useEffect } from 'react';
import { ProductService } from '@/services/ProductService';
import { Product } from '@/types/product';
import { Plus, Edit, Trash2, Eye, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function ProductsManagementPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const productService = new ProductService();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleOptimizeListing = async (product: Product) => {
    try {
      const { ListingOptimizerService } = await import('@/services/AIService');
      const aiService = new ListingOptimizerService();
      
      const result = await aiService.analyze({
        product_id: product.id,
        current_description: product.description || '',
        product_name: product.name,
      });

      if (result.success && result.data) {
        alert('Listing Optimized!\n' + JSON.stringify(result.data, null, 2));
      } else {
        alert('Failed to optimize listing.');
      }
    } catch (err) {
      console.error('Failed to optimize:', err);
    }
  };

  const handleGenerateHSCode = async (product: Product) => {
    try {
      const { HSCodeAIService } = await import('@/services/AIService');
      const aiService = new HSCodeAIService();
      
      const result = await aiService.analyze({
        description: product.description || product.name,
        category: product.category,
      });

      if (result.success && result.data) {
        alert('HS Code Found!\n' + JSON.stringify(result.data, null, 2));
      } else {
        alert('Failed to generate HS Code.');
      }
    } catch (err) {
      console.error('Failed to generate HS Code:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Products</p>
            <p className="text-2xl font-bold text-primary-700">{products.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="text-2xl font-bold text-blue-600">
              {products.reduce((sum, p) => sum + (p.view_count || 0), 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Inquiries</p>
            <p className="text-2xl font-bold text-green-600">
              {products.reduce((sum, p) => sum + (p.inquiry_count || 0), 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Avg Listing Score</p>
            <p className="text-2xl font-bold text-purple-600">
              {products.length > 0 
                ? Math.round(products.reduce((sum, p) => sum + (p.listing_score || 0), 0) / products.length)
                : 0}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">HS Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No products found. Add your first product!
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded object-cover" 
                            src={product.images?.[0] || '/placeholder-product.jpg'} 
                            alt={product.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.country_origin}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-primary">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.hs_code || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price_range_min && product.price_range_max
                        ? `${product.currency} ${product.price_range_min}-${product.price_range_max}`
                        : 'Contact'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {product.view_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {product.inquiry_count}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${
                        (product.listing_score || 0) >= 80 ? 'badge-success' :
                        (product.listing_score || 0) >= 60 ? 'badge-warning' :
                        'badge-error'
                      }`}>
                        {product.listing_score || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
