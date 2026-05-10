'use client';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';

const MOCK_SUPPLIERS: Record<string, any> = {
  'c1': { name: 'TechCorp Global Mfg.', desc: 'Leading manufacturer of advanced electronic components and processors.', country: 'Shenzhen, China', rating: 4.8, reviews: 342, est: '1998' },
  'c2': { name: 'Nexus Robotics Ltd.', desc: 'Pioneer in industrial automation and precision robotics.', country: 'Munich, Germany', rating: 4.9, reviews: 156, est: '2005' },
  'c3': { name: 'CloudNet Infrastructure', desc: 'Enterprise data center solutions and enterprise networking hardware.', country: 'Austin, USA', rating: 4.7, reviews: 89, est: '2010' },
  'c4': { name: 'Pacific Textiles Co.', desc: 'Sustainable and organic textile manufacturing.', country: 'Jakarta, Indonesia', rating: 4.5, reviews: 198, est: '2003' },
  'c5': { name: 'AgriPure Exports', desc: 'Premium organic agricultural products.', country: 'Bali, Indonesia', rating: 4.3, reviews: 145, est: '2012' },
  '1': { name: 'Nexus Manufacturing', desc: 'Premium engineering and manufacturing.', country: 'Munich, Germany', rating: 4.8, reviews: 124, est: '2001' },
  '2': { name: 'AeroTech Solutions', desc: 'Aerospace and defense contractor.', country: 'Taipei, Taiwan', rating: 5.0, reviews: 89, est: '1995' },
  '3': { name: 'BioChem Synthetics', desc: 'Advanced chemical and synthetic materials.', country: 'Mumbai, India', rating: 4.2, reviews: 312, est: '1988' },
  '4': { name: 'Pacific Textiles Co.', desc: 'Premium organic textiles.', country: 'Jakarta, Indonesia', rating: 4.5, reviews: 198, est: '2003' },
  '5': { name: 'SteelForge Industries', desc: 'Heavy industrial metal works.', country: 'Shanghai, China', rating: 4.6, reviews: 267, est: '1992' },
  '6': { name: 'AgriPure Exports', desc: 'Organic agriculture and farming.', country: 'Sao Paulo, Brazil', rating: 4.3, reviews: 145, est: '2012' },
};

export default function SupplierProfilePage({ params }: { params: { id: string } }) {
  const supplierId = params?.id || 'default';
  const supplier = MOCK_SUPPLIERS[supplierId] || {
    name: 'Apex Global Manufacturing',
    desc: 'Leading provider of precision engineered components for aerospace and automotive industries.',
    country: 'Shenzhen, China',
    rating: 4.9,
    reviews: 124,
    est: '2005'
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-dark-background">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="flex-1 bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-dark-surface-variant/30 overflow-hidden">
          
          {/* Hero Header */}
          <div className="h-32 bg-[#f3e8ff] dark:bg-[#d0bcff]/10" />
          <div className="px-8 pb-8 pt-16 relative">
            <div className="w-24 h-24 bg-[#0f172a] dark:bg-[#18181b] border-4 border-white dark:border-dark-surface rounded-xl absolute -top-12 left-8 flex items-center justify-center shadow-md overflow-hidden">
               <img src="/images/android-chrome-192x192.png" alt="Supplier Logo" className="w-16 h-16 object-contain" />
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-dark-on-surface">{supplier.name}</h1>
              <span className="material-symbols-outlined text-[#2563eb] dark:text-blue-400 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
            <p className="text-[14px] text-gray-600 dark:text-dark-on-surface-variant mb-4 max-w-2xl">
              {supplier.desc}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-1 text-gray-900 dark:text-dark-on-surface">
                <span className="material-symbols-outlined text-[#5300b7] dark:text-[#d0bcff] text-[18px]">star</span>
                <span className="font-extrabold">{supplier.rating.toFixed(1)}</span> <span className="text-gray-500 dark:text-gray-500 font-normal">({supplier.reviews} Reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                {supplier.country}
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Est. {supplier.est}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-8 border-b border-gray-100 dark:border-dark-surface-variant/30 flex gap-6">
            <button className="py-4 text-[#5300b7] dark:text-[#d0bcff] font-extrabold text-[14px] border-b-2 border-[#5300b7] dark:border-[#d0bcff]">Overview</button>
            <button className="py-4 text-gray-500 dark:text-dark-on-surface-variant hover:text-gray-900 dark:hover:text-white font-bold text-[14px] transition-colors">Products</button>
            <button className="py-4 text-gray-500 dark:text-dark-on-surface-variant hover:text-gray-900 dark:hover:text-white font-bold text-[14px] transition-colors">Certifications</button>
          </div>

          <div className="p-8 space-y-10">
            {/* About Us */}
            <section>
              <h2 className="text-[18px] font-extrabold text-gray-900 dark:text-dark-on-surface mb-3">About Us</h2>
              <p className="text-[14px] text-gray-600 dark:text-dark-on-surface-variant leading-relaxed mb-6">
                Apex Global Manufacturing specializes in high-precision CNC machining, die casting, and plastic injection molding. With over 15 years of experience, we deliver top-tier components to Fortune 500 companies across the globe. Our state-of-the-art facilities ensure rigorous quality control and efficient production cycles, making us a trusted partner for complex engineering challenges.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#f9f5ff] dark:bg-[#d0bcff]/10 rounded-xl p-4">
                  <p className="text-[11px] text-gray-500 dark:text-dark-on-surface-variant mb-1 font-bold">Response Time</p>
                  <p className="text-[16px] font-extrabold text-[#5300b7] dark:text-[#d0bcff]">&lt; 24h</p>
                </div>
                <div className="bg-[#f9f5ff] dark:bg-[#d0bcff]/10 rounded-xl p-4">
                  <p className="text-[11px] text-gray-500 dark:text-dark-on-surface-variant mb-1 font-bold">Delivery Rate</p>
                  <p className="text-[16px] font-extrabold text-[#5300b7] dark:text-[#d0bcff]">98.5%</p>
                </div>
                <div className="bg-[#f9f5ff] dark:bg-[#d0bcff]/10 rounded-xl p-4">
                  <p className="text-[11px] text-gray-500 dark:text-dark-on-surface-variant mb-1 font-bold">Total Employees</p>
                  <p className="text-[16px] font-extrabold text-[#5300b7] dark:text-[#d0bcff]">500+</p>
                </div>
                <div className="bg-[#f9f5ff] dark:bg-[#d0bcff]/10 rounded-xl p-4">
                  <p className="text-[11px] text-gray-500 dark:text-dark-on-surface-variant mb-1 font-bold">Annual Revenue</p>
                  <p className="text-[16px] font-extrabold text-[#5300b7] dark:text-[#d0bcff]">$50M+</p>
                </div>
              </div>
            </section>

            {/* Featured Products */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[18px] font-extrabold text-gray-900 dark:text-dark-on-surface">Featured Products</h2>
                <button className="text-[#5300b7] dark:text-[#d0bcff] font-bold text-[13px] flex items-center gap-1 hover:underline">
                  View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/catalog" className="relative rounded-xl overflow-hidden bg-gray-900 h-48 group cursor-pointer block">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img src="/images/product-chip.png" alt="Custom CNC" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-white font-extrabold text-[14px]">Custom CNC Aluminum Housings</p>
                    <p className="text-gray-300 text-[11px] font-medium">MOQ: 100 units</p>
                  </div>
                </Link>
                <Link href="/catalog" className="relative rounded-xl overflow-hidden bg-gray-900 h-48 group cursor-pointer block">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img src="/images/product-gear.png" alt="Zinc Die" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-white font-extrabold text-[14px]">Zinc Die Casting</p>
                  </div>
                </Link>
                <Link href="/catalog" className="rounded-xl bg-[#f9f5ff] dark:bg-[#d0bcff]/10 h-48 flex flex-col items-center justify-center text-[#5300b7] dark:text-[#d0bcff] cursor-pointer hover:bg-[#f3e8ff] dark:hover:bg-[#d0bcff]/20 transition-colors border border-purple-100 dark:border-purple-900/30">
                  <span className="material-symbols-outlined text-[32px] mb-2">grid_view</span>
                  <p className="font-bold text-[14px]">Explore Catalog</p>
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Right Column (Contact Sidebar) */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-100 dark:border-dark-surface-variant/30 p-6">
            <h3 className="font-extrabold text-gray-900 dark:text-dark-on-surface text-[15px] mb-4">Contact Supplier</h3>
            
            <button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold py-2.5 rounded-md text-[13px] flex items-center justify-center gap-2 mb-3 transition-colors">
              <span className="material-symbols-outlined text-[18px]">mail</span> Contact Supplier
            </button>
            <button className="w-full border border-[#5300b7] dark:border-[#d0bcff] text-[#5300b7] dark:text-[#d0bcff] hover:bg-[#5300b7] hover:text-white dark:hover:bg-[#d0bcff] dark:hover:text-[#381e72] font-bold py-2.5 rounded-md text-[13px] flex items-center justify-center gap-2 transition-colors mb-6">
              <span className="material-symbols-outlined text-[18px]">forum</span> WhatsApp Chat
            </button>

            <div className="pt-6 border-t border-gray-100 dark:border-dark-surface-variant/30">
              <h4 className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Send Inquiry</h4>
              <select className="w-full border border-gray-200 dark:border-dark-surface-variant/50 bg-white dark:bg-dark-surface-container rounded-md px-3 py-2 text-[13px] text-gray-600 dark:text-dark-on-surface mb-3 focus:outline-none focus:border-[#5300b7] dark:focus:border-[#d0bcff]">
                <option>Select Product Category..</option>
              </select>
              <textarea 
                className="w-full border border-gray-200 dark:border-dark-surface-variant/50 bg-white dark:bg-dark-surface-container rounded-md px-3 py-2 text-[13px] text-gray-600 dark:text-dark-on-surface mb-3 h-24 resize-none focus:outline-none focus:border-[#5300b7] dark:focus:border-[#d0bcff]"
                placeholder="Describe your requirements, MOQ, and timeline.."
              />
              <button className="w-full bg-[#e8def8] dark:bg-[#d0bcff]/20 hover:bg-[#d0bcff] dark:hover:bg-[#d0bcff]/40 text-[#381e72] dark:text-[#d0bcff] font-bold py-2.5 rounded-md text-[13px] transition-colors">
                Send Inquiry
              </button>
            </div>

            <div className="pt-6 mt-6 border-t border-gray-100 dark:border-dark-surface-variant/30 space-y-3">
              <div className="flex items-center gap-2 text-[12px] font-bold text-gray-700 dark:text-gray-300">
                <span className="material-symbols-outlined text-[#2563eb] dark:text-blue-400 text-[16px]">verified</span>
                ISO 9001:2015
              </div>
              <div className="flex items-center gap-2 text-[12px] font-bold text-gray-700 dark:text-gray-300">
                <span className="material-symbols-outlined text-[#2563eb] dark:text-blue-400 text-[16px]">verified</span>
                ISO 14001:2015
              </div>
              <div className="flex items-center gap-2 text-[12px] font-bold text-gray-700 dark:text-gray-300">
                <span className="material-symbols-outlined text-[#2563eb] dark:text-blue-400 text-[16px]">verified</span>
                IATF 16949
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
