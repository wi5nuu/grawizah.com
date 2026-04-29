import React from 'react';
import { Product } from '@/types/product';
import { MapPin, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  showSupplier?: boolean;
  onInquiry?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showSupplier = true,
  onInquiry 
}) => {
  const hasImages = product.images && product.images.length > 0;
  const imageUrl = hasImages ? product.images[0] : '/placeholder-product.jpg';
  
  const priceRange = product.price_range_min && product.price_range_max
    ? `${product.currency} ${product.price_range_min.toLocaleString()} - ${product.price_range_max.toLocaleString()}`
    : 'Contact for pricing';

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        <img 
          src={imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.listing_score && product.listing_score >= 80 && (
          <div className="absolute top-2 right-2">
            <span className="badge badge-success flex items-center gap-1">
              <Star className="w-3 h-3" />
              Premium
            </span>
          </div>
        )}
        {product.hs_code && (
          <div className="absolute bottom-2 left-2">
            <span className="badge bg-white/90 text-gray-700 text-xs">
              HS: {product.hs_code}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.name}
          </h3>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.description}
        </p>

        {/* Category & Origin */}
        <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
          <span className="badge badge-primary">{product.category}</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {product.country_origin}
          </span>
        </div>

        {/* Price Range */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Indicative Price Range</p>
          <p className="text-lg font-bold text-primary-700">{priceRange}</p>
          {product.moq && (
            <p className="text-xs text-gray-500">MOQ: {product.moq} units</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {product.view_count} views
          </span>
          <span>{product.inquiry_count} inquiries</span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onInquiry?.(product.id)}
          className="btn-primary w-full text-sm"
        >
          Send Inquiry
        </button>
      </div>
    </div>
  );
};
