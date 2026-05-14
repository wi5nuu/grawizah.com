'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { Package, MapPin, Eye, MessageSquare, ShieldCheck, Store, Building2 } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  // Track view – calls POST /api/products/:id/view
  const handleView = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/products/${product.id}/view`, { method: 'POST' }).catch(() => {});
  };

  const supplierName = (product as any).company_name || 'Verified Supplier';

  if (viewMode === 'list') {
    return (
      <Link href={`/catalog/${product.id}`} className="card flex gap-6 hover:shadow-md transition cursor-pointer block" onClick={handleView}>
        <div className="w-40 h-28 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-10 h-10 text-on-surface-variant/50" />
          )}
          {product.listing_score && product.listing_score >= 80 && (
             <div className="absolute top-2 left-2 bg-[#dbeafe] text-[#1d4ed8] text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
               <ShieldCheck className="w-3 h-3" /> Verified
             </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-primary text-[11px] font-bold mb-1 tracking-wide">HS: {product.hs_code}</span>
          <h3 className="text-[15px] font-bold text-on-surface mb-1">{product.name}</h3>
          <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mb-2 font-medium">
            <Store className="w-4 h-4 text-primary" />
            {supplierName}
          </p>
          <p className="text-primary font-bold text-[15px]">
            ${product.price_range_min?.toLocaleString()} - ${product.price_range_max?.toLocaleString()} <span className="text-[11px] text-on-surface-variant font-normal">/ unit</span>
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/catalog/${product.id}`} className="bg-white dark:bg-dark-surface border border-gray-100 dark:border-dark-surface-variant/30 rounded-2xl overflow-hidden transition-all cursor-pointer group block" onClick={handleView}>
      {/* Image */}
      <div className="relative h-48 bg-gray-50 dark:bg-dark-surface-container flex items-center justify-center overflow-hidden">
        <img 
          src={(product.images && product.images.length > 0 && product.images[0]) ? product.images[0] : 'https://placehold.co/400x300/f3f4f6/a1a1aa?text=No+Image'} 
          alt={product.name} 
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x300/f3f4f6/a1a1aa?text=Image+Not+Found' }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        {product.listing_score && product.listing_score >= 80 && (
           <div className="absolute top-3 left-3 bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-blue-100/50 dark:border-blue-900/30">
             <ShieldCheck className="w-3.5 h-3.5" /> Verified
           </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col h-[180px]">
        <span className="text-primary dark:text-dark-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">HS CODE: {product.hs_code}</span>
        <h3 className="font-display font-bold text-[15px] text-gray-900 dark:text-white leading-snug mb-3 line-clamp-2">{product.name}</h3>
        <p className="text-[12px] text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-auto mb-4 truncate font-semibold">
          <Building2 className="w-4 h-4 text-primary" />
          {supplierName}
        </p>
        <div className="flex items-end justify-between">
           <p className="text-primary dark:text-dark-primary font-black text-lg">
             ${product.price_range_min?.toLocaleString()} <span className="text-[10px] text-gray-400 font-bold uppercase ml-1">/ Unit</span>
           </p>
        </div>
      </div>
    </Link>
  );
}
