'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { Package, MapPin, Eye, MessageSquare } from 'lucide-react';
import SendInquiryModal from '@/components/SendInquiryModal';
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

  if (viewMode === 'list') {
    return (
      <Link href={`/supplier/${product.company_id || 'c1'}`} className="card flex gap-6 hover:shadow-md transition cursor-pointer block" onClick={handleView}>
        <div className="w-40 h-28 bg-surface-container rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-10 h-10 text-on-surface-variant/50" />
          )}
          {product.listing_score && product.listing_score >= 80 && (
             <div className="absolute top-2 left-2 bg-[#dbeafe] text-[#1d4ed8] text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
               <span className="material-symbols-outlined text-[10px]">verified</span> Verified
             </div>
          )}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <span className="text-[#5300b7] text-[11px] font-bold mb-1 tracking-wide">HS: {product.hs_code}</span>
          <h3 className="text-[15px] font-bold text-on-surface mb-1">{product.name}</h3>
          <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mb-2">
            <span className="material-symbols-outlined text-[14px]">storefront</span>
            {product.company_id === 'c1' ? 'TechCorp Global Mfg.' : product.company_id === 'c2' ? 'Nexus Robotics Ltd.' : 'CloudNet Infrastructure'}
          </p>
          <p className="text-[#5300b7] font-bold text-[15px]">
            ${product.price_range_min?.toLocaleString()} - ${product.price_range_max?.toLocaleString()} <span className="text-[11px] text-on-surface-variant font-normal">/ unit</span>
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/supplier/${product.company_id || 'c1'}`} className="bg-surface-container-lowest border border-surface-variant/50 rounded-xl overflow-hidden hover:shadow-ambient transition-all cursor-pointer group block" onClick={handleView}>
      {/* Image */}
      <div className="relative h-44 bg-surface-container flex items-center justify-center overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <Package className="w-14 h-14 text-on-surface-variant/50 group-hover:scale-110 transition-transform duration-500" />
        )}
        {product.listing_score && product.listing_score >= 80 && (
           <div className="absolute top-3 left-3 bg-[#dbeafe]/90 backdrop-blur-sm text-[#1d4ed8] text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1">
             <span className="material-symbols-outlined text-[12px]">verified</span> Verified
           </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col h-[160px]">
        <span className="text-[#5300b7] text-[11px] font-bold mb-1 tracking-wide">HS: {product.hs_code}</span>
        <h3 className="font-bold text-[15px] text-on-surface leading-snug mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-[13px] text-on-surface-variant flex items-center gap-1.5 mt-auto mb-4 truncate">
          <span className="material-symbols-outlined text-[15px]">domain</span>
          {product.company_id === 'c1' ? 'TechCorp Global Mfg.' : product.company_id === 'c2' ? 'Nexus Robotics Ltd.' : 'CloudNet Infrastructure'}
        </p>
        <p className="text-[#5300b7] font-bold text-[15px]">
          ${product.price_range_min?.toLocaleString()} - ${product.price_range_max?.toLocaleString()} <span className="text-xs text-on-surface-variant font-normal">/ unit</span>
        </p>
      </div>
    </Link>
  );
}
