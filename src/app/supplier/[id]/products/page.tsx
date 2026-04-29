'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CompanyService } from '@/services/CompanyService';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types/product';
import { Package, Filter } from 'lucide-react';
import Link from 'next/link';

const companyService = new CompanyService();

export default function SupplierProductsPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchProducts(params.id as string);
    }
  }, [params.id]);

  const fetchProducts = async (id: string) => {
    try {
      setLoading(true);
      const company = await companyService.getCompanyById(id);
      setCompanyName(company.name);
      const productsData = await companyService.getCompanyProducts(id);
      setProducts(productsData);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{companyName}</h1>
          <p className="text-gray-600">Product Catalog</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <nav className="flex gap-8">
            <Link 
              href={`/supplier/${params.id}`}
              className="py-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
            >
              About Us
            </Link>
            <Link 
              href={`/supplier/${params.id}/products`}
              className="py-4 border-b-2 border-primary-700 text-primary-700 font-medium"
            >
              Products
            </Link>
            <Link 
              href={`/supplier/${params.id}/certifications`}
              className="py-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
            >
              Certifications
            </Link>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md h-96 animate-pulse" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showSupplier={false}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600">This supplier hasn't added any products</p>
          </div>
        )}
      </div>
    </div>
  );
}
