'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import { Product } from '@/types/product';
import { ShieldCheck, MapPin, Package, Building2, ExternalLink, MessageSquare, ArrowLeft, Loader2, Star, ChevronLeft, ChevronRight, CheckCircle2, ChevronDown, Flag, Heart, Share2 } from 'lucide-react';
import SendInquiryModal from '@/components/SendInquiryModal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // 1. Fetch Product
        const resProd = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/products/${id}`);
        if (!resProd.ok) throw new Error('Product not found');
        const prodData = await resProd.json();
        setProduct(prodData);
        setQuantity(prodData.moq || 1);

        // 2. Fetch Supplier
        if (prodData.company_id) {
          const resSupp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/companies/${prodData.company_id}`);
          if (resSupp.ok) {
            const suppData = await resSupp.json();
            setSupplier(suppData);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-on-surface-variant font-medium">Loading product details...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-on-surface mb-4">Product Not Found</h1>
          <p className="text-on-surface-variant mb-8">The product you are looking for does not exist or has been removed.</p>
          <Link href="/catalog" className="btn-primary">Return to Catalog</Link>
        </div>
      </main>
    );
  }

  const handleNextImage = () => {
    if (product.images && activeImage < product.images.length - 1) setActiveImage(activeImage + 1);
  };

  const handlePrevImage = () => {
    if (product.images && activeImage > 0) setActiveImage(activeImage - 1);
  };

  return (
    <main className="min-h-screen bg-[#f2f2f2] dark:bg-dark-background pb-20 font-body text-gray-900 dark:text-dark-on-surface transition-colors duration-300">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-dark-surface pt-24 pb-3 shadow-sm sticky top-0 z-40 border-b border-gray-100 dark:border-dark-surface-variant/10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-[13px] text-gray-500 dark:text-gray-400">
            <Link href="/catalog" className="hover:text-primary transition">All categories</Link>
            <span>&gt;</span>
            <span className="capitalize hover:text-primary cursor-pointer">{product.category}</span>
            <span>&gt;</span>
            <span className="text-gray-900 dark:text-white truncate max-w-[300px]">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT & CENTER CONTENT (70%) */}
          <div className="flex-1 min-w-0">
            {/* Title & Supplier Snippet */}
            <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm mb-4 border border-gray-100 dark:border-dark-surface-variant/20">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm mb-4 pb-4 border-b border-gray-100 dark:border-dark-surface-variant/20">
                {supplier && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <img src={`https://ui-avatars.com/api/?name=${supplier.name}&background=random`} alt="Supplier" className="w-6 h-6 rounded" />
                    <Link href={`/supplier/${supplier.id}`} className="text-gray-900 dark:text-white font-medium hover:text-primary hover:underline">{supplier.name}</Link>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{supplier.export_experience_years || 1} yr</span>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1">
                      <img src={`https://flagcdn.com/20x15/${supplier.country?.toLowerCase() === 'indonesia' ? 'id' : supplier.country?.toLowerCase() === 'germany' ? 'de' : supplier.country?.toLowerCase() === 'south korea' ? 'kr' : supplier.country?.toLowerCase() === 'usa' ? 'us' : 'us'}.png`} alt="flag" />
                      <span className="text-gray-600 dark:text-gray-300 uppercase">{supplier.country}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  No reviews yet
                </div>
              </div>

              {/* Image Gallery */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Thumbnails */}
                <div className="flex sm:flex-col gap-2 w-full sm:w-16 overflow-x-auto sm:overflow-x-visible">
                  {product.images?.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-16 rounded border flex-shrink-0 ${activeImage === idx ? 'border-primary ring-1 ring-primary' : 'border-gray-200 dark:border-dark-surface-variant/50 hover:border-gray-400'} overflow-hidden bg-gray-50 dark:bg-dark-surface-container`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Main Image */}
                <div className="flex-1 relative bg-gray-50 dark:bg-dark-surface-container rounded border border-gray-100 dark:border-dark-surface-variant/20 flex items-center justify-center min-h-[400px]">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[activeImage]} alt={product.name} className="max-h-[500px] object-contain p-4" />
                  ) : (
                    <Package className="w-32 h-32 text-gray-300 dark:text-gray-700" />
                  )}
                  
                  {/* Arrows */}
                  <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-dark-surface/80 hover:bg-white dark:hover:bg-dark-surface rounded-full flex items-center justify-center shadow-md text-gray-700 dark:text-white border dark:border-dark-surface-variant/20">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-dark-surface/80 hover:bg-white dark:hover:bg-dark-surface rounded-full flex items-center justify-center shadow-md text-gray-700 dark:text-white border dark:border-dark-surface-variant/20">
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button className="w-10 h-10 bg-white dark:bg-dark-surface border dark:border-dark-surface-variant/20 rounded-full shadow flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-red-500"><Heart className="w-5 h-5" /></button>
                    <button className="w-10 h-10 bg-white dark:bg-dark-surface border dark:border-dark-surface-variant/20 rounded-full shadow flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-blue-500"><Share2 className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Spotlights / Details */}
            <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm mb-4 border border-gray-100 dark:border-dark-surface-variant/20">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-primary">✨</span> Product spotlights
              </h2>
              <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6 border border-primary/20">
                <p><strong>Premium Quality:</strong> Manufactured with top-tier industrial standards ensuring durability and high performance in all environments.</p>
                <p className="mt-2"><strong>Global Standards:</strong> Fully compliant with international trade and safety regulations (ISO certified where applicable).</p>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-100 dark:border-dark-surface-variant/20">Key attributes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex border-b border-gray-100 dark:border-dark-surface-variant/10 pb-2">
                  <span className="w-1/3 text-gray-500 dark:text-gray-400">Category</span>
                  <span className="w-2/3 text-gray-900 dark:text-white font-medium">{product.category}</span>
                </div>
                <div className="flex border-b border-gray-100 dark:border-dark-surface-variant/10 pb-2">
                  <span className="w-1/3 text-gray-500 dark:text-gray-400">HS Code</span>
                  <span className="w-2/3 text-gray-900 dark:text-white font-medium">{product.hs_code}</span>
                </div>
                <div className="flex border-b border-gray-100 dark:border-dark-surface-variant/10 pb-2">
                  <span className="w-1/3 text-gray-500 dark:text-gray-400">Origin</span>
                  <span className="w-2/3 text-gray-900 dark:text-white font-medium">{product.country_origin || 'Mainland China'}</span>
                </div>
                <div className="flex border-b border-gray-100 dark:border-dark-surface-variant/10 pb-2">
                  <span className="w-1/3 text-gray-500 dark:text-gray-400">Product Quality</span>
                  <span className="w-2/3 text-gray-900 dark:text-white font-medium">Premium Grade</span>
                </div>
                <div className="flex border-b border-gray-100 dark:border-dark-surface-variant/10 pb-2">
                  <span className="w-1/3 text-gray-500 dark:text-gray-400">Customization</span>
                  <span className="w-2/3 text-gray-900 dark:text-white font-medium">Available (OEM/ODM)</span>
                </div>
                <div className="flex border-b border-gray-100 dark:border-dark-surface-variant/10 pb-2">
                  <span className="w-1/3 text-gray-500 dark:text-gray-400">Material</span>
                  <span className="w-2/3 text-gray-900 dark:text-white font-medium">Standard Industrial</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 pb-2 border-b border-gray-100 dark:border-dark-surface-variant/20">Product descriptions from the supplier</h2>
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-dark-surface-container p-6 rounded border border-gray-100 dark:border-dark-surface-variant/20">
                {product.description}
              </div>
            </div>

            {/* Supplier Profile Section */}
            {supplier && (
              <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm border border-gray-100 dark:border-dark-surface-variant/20">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-100 dark:border-dark-surface-variant/20">Know your supplier</h2>
                <div className="flex items-start gap-6 flex-col sm:flex-row">
                  <div className="w-20 h-20 rounded bg-gray-100 dark:bg-dark-surface-container border border-gray-200 dark:border-dark-surface-variant/30 flex items-center justify-center p-2 flex-shrink-0">
                    <Building2 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{supplier.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span>{supplier.export_experience_years || 1} yr on Grawizah</span>
                      <span className="text-gray-300 dark:text-gray-700">|</span>
                      <span>Located in {supplier.country}</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-dark-surface-container p-3 rounded border dark:border-dark-surface-variant/10">
                        <p className="text-xs text-gray-500 dark:text-gray-450 mb-1">Response Time</p>
                        <p className="font-bold text-gray-900 dark:text-white">≤8h</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-dark-surface-container p-3 rounded border dark:border-dark-surface-variant/10">
                        <p className="text-xs text-gray-500 dark:text-gray-450 mb-1">Store Rating</p>
                        <p className="font-bold text-orange-500 flex items-center gap-1"><Star className="w-4 h-4 fill-orange-500" /> 4.9</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-dark-surface-container p-3 rounded border dark:border-dark-surface-variant/10">
                        <p className="text-xs text-gray-500 dark:text-gray-450 mb-1">Transactions</p>
                        <p className="font-bold text-gray-900 dark:text-white">100+</p>
                      </div>
                    </div>

                    <Link href={`/supplier/${supplier.id}`} className="text-primary dark:text-[#d0bcff] font-medium text-sm hover:underline flex items-center gap-1">
                      Visit Company Profile <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR (30% - STICKY) */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="bg-white dark:bg-dark-surface p-6 rounded-lg shadow-sm sticky top-[100px] border border-gray-200 dark:border-dark-surface-variant/30">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Minimum order quantity: {product.moq} {product.moq === 1 ? 'unit' : 'units'}</p>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                {product.currency === 'USD' ? '$' : ''}{product.price_range_min?.toLocaleString()} 
                <span className="text-xl text-gray-400 dark:text-gray-600 mx-1 font-medium">-</span> 
                {product.currency === 'USD' ? '$' : ''}{product.price_range_max?.toLocaleString()}
              </h2>

              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Quantity</p>
                <div className="flex items-center">
                  <div className="flex items-center border border-gray-300 dark:border-dark-surface-variant/40 rounded-md overflow-hidden bg-transparent">
                    <button 
                      onClick={() => setQuantity(Math.max((product.moq || 1), quantity - 1))}
                      className="w-10 h-10 bg-gray-50 dark:bg-dark-surface-container hover:bg-gray-100 dark:hover:bg-dark-surface-variant/20 flex items-center justify-center text-gray-600 dark:text-gray-355 font-bold text-lg"
                    >-</button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Math.max((product.moq || 1), parseInt(e.target.value) || 0))}
                      className="w-16 h-10 text-center border-x border-gray-300 dark:border-dark-surface-variant/40 bg-transparent text-sm font-medium focus:outline-none text-gray-900 dark:text-white"
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-gray-50 dark:bg-dark-surface-container hover:bg-gray-100 dark:hover:bg-dark-surface-variant/20 flex items-center justify-center text-gray-600 dark:text-gray-355 font-bold text-lg"
                    >+</button>
                  </div>
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">units</span>
                </div>
              </div>

              {/* Shipping */}
              <div className="mb-6 border-b border-gray-100 dark:border-dark-surface-variant/20 pb-6">
                <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Shipping</p>
                <p className="text-sm text-gray-600 dark:text-gray-350 leading-relaxed mb-4">
                  Shipping fee and delivery date to be negotiated. Chat with supplier now for more details.
                </p>
                
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Item subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">To be negotiated</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Shipping total</span>
                  <span className="font-bold text-gray-900 dark:text-white">To be negotiated</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-gray-900 dark:text-white text-base">Subtotal</span>
                <span className="font-black text-gray-900 dark:text-white text-xl">To be negotiated</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={() => setInquiryOpen(true)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-full text-sm transition text-center shadow-md"
                >
                  Send inquiry
                </button>
                <button 
                  onClick={() => setInquiryOpen(true)}
                  className="flex-1 bg-white dark:bg-transparent border border-primary text-primary hover:bg-primary/5 font-bold py-3 px-4 rounded-full text-sm transition text-center"
                >
                  Chat now
                </button>
              </div>

              {/* Grawizah Order Protection */}
              <div className="bg-gray-50 dark:bg-dark-surface-container p-4 rounded-lg border border-gray-200 dark:border-dark-surface-variant/30">
                <div className="flex items-center justify-between mb-3 cursor-pointer">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">Grawizah Order Protection</h4>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="font-bold text-sm text-gray-900 dark:text-white">Secure payments</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-6 leading-relaxed">
                    Every payment you make on Grawizah is secured with strict SSL encryption and data protection protocols.
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="font-bold text-sm text-gray-900 dark:text-white">Money-back protection</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-6 leading-relaxed">
                    Claim a refund if your order doesn't ship, is missing, or arrives with product issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SendInquiryModal 
        isOpen={inquiryOpen} 
        onClose={() => setInquiryOpen(false)}
        productId={product.id}
        productName={product.name}
        supplierId={product.company_id}
        supplierName={supplier?.name || "the supplier"}
      />
    </main>
  );
}
