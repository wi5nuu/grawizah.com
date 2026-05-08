'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { Package, MapPin, Eye, MessageSquare } from 'lucide-react';
import SendInquiryModal from '@/components/SendInquiryModal';

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
    fetch(`http://localhost:8080/api/products/${product.id}/view`, { method: 'POST' }).catch(() => {});
  };

  if (viewMode === 'list') {
    return (
      <>
        <div className="card flex gap-6 hover:shadow-md transition" onClick={handleView}>
          <div className="w-40 h-28 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="w-10 h-10 text-primary-300" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge-primary text-[10px]">HS: {product.hs_code}</span>
                  <span className="badge bg-gray-100 text-gray-600 text-[10px]">{product.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
              </div>
              <span className={`${getScoreColor(product.listing_score || 0)} text-white text-xs font-bold px-2.5 py-1 rounded-lg`}>
                {product.listing_score}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {product.country_origin}</span>
                <span>MOQ: {product.moq}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {product.view_count}</span>
                <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {product.inquiry_count}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-primary-700 font-semibold text-sm">
                  ${product.price_range_min?.toLocaleString()} - ${product.price_range_max?.toLocaleString()} {product.currency}/MT
                </span>
                <button onClick={(e) => { e.stopPropagation(); setInquiryOpen(true); }} className="btn-primary btn-sm text-xs">
                  Send Inquiry
                </button>
              </div>
            </div>
          </div>
        </div>
        <SendInquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} productId={product.id} productName={product.name} />
      </>
    );
  }

  return (
    <>
      <div className="card-hover group" onClick={handleView}>
        {/* Image */}
        <div className="relative h-44 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
          <Package className="w-14 h-14 text-primary-200 group-hover:scale-110 transition-transform" />
          <span className={`absolute top-3 right-3 ${getScoreColor(product.listing_score || 0)} text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow`}>
            {product.listing_score}
          </span>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="badge-primary text-[10px]">HS: {product.hs_code}</span>
          <span className="badge bg-gray-100 text-gray-600 text-[10px]">{product.category}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 transition mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{product.description}</p>

        {/* Origin & MOQ */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <MapPin className="w-3 h-3" /> {product.country_origin}
          <span className="mx-1">•</span>
          MOQ: {product.moq}
        </div>

        {/* Price */}
        <p className="text-primary-700 font-semibold text-sm mb-4">
          ${product.price_range_min?.toLocaleString()} - ${product.price_range_max?.toLocaleString()} {product.currency}/MT
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {product.view_count}</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {product.inquiry_count}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setInquiryOpen(true); }} className="btn-primary btn-sm text-xs">
            Send Inquiry
          </button>
        </div>
      </div>
      <SendInquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} productId={product.id} productName={product.name} />
    </>
  );
}
