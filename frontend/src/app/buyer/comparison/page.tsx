'use client';

import DashboardSidebar from '@/components/ui/DashboardSidebar';

export default function SupplierComparisonPage() {
  const suppliers = [
    {
      name: 'TechMakers Global',
      badge: 'Verified',
      badgeIcon: 'verified',
      badgeColor: 'text-[#5300b7] dark:text-[#d0bcff]',
      badgeBg: 'bg-[#f3e8ff] dark:bg-[#d0bcff]/20',
      image: '/images/supplier-tech.png',
      imageBg: 'bg-[#e0f2fe] dark:bg-[#0c4a6e]',
      rating: '4.8',
      reviews: '124 reviews',
      certifications: ['ISO 9001', 'CE Mark'],
      markets: 'North America, Europe, Asia',
      leadTime: '15 - 20 days',
      leadTimeType: 'Standard Air Freight',
      moq: '500 units',
      moqPrice: '$12.50 / unit'
    },
    {
      name: 'Nexus Electronics',
      badge: 'Top Rated',
      badgeIcon: 'star',
      badgeColor: 'text-[#5300b7] dark:text-[#d0bcff]',
      badgeBg: 'bg-[#f3e8ff] dark:bg-[#d0bcff]/20',
      image: '/images/supplier-nexus.png',
      imageBg: 'bg-[#1e1b4b] dark:bg-[#1e1b4b]',
      rating: '4.9',
      reviews: '342 reviews',
      certifications: ['ISO 9001', 'RoHS', 'FCC'],
      markets: 'Global (85+ Countries)',
      leadTime: '10 - 14 days',
      leadTimeType: 'Priority Air Freight',
      moq: '1,000 units',
      moqPrice: '$9.80 / unit'
    },
    {
      name: 'Apex Components',
      badge: 'Fast Shipper',
      badgeIcon: 'bolt',
      badgeColor: 'text-[#5300b7] dark:text-[#d0bcff]',
      badgeBg: 'bg-[#f3e8ff] dark:bg-[#d0bcff]/20',
      image: '/images/supplier-apex.png',
      imageBg: 'bg-[#fef3c7] dark:bg-[#78350f]',
      rating: '4.6',
      reviews: '89 reviews',
      certifications: ['ISO 9001'],
      markets: 'North America, South America',
      leadTime: '5 - 7 days',
      leadTimeType: 'Express Courier',
      moq: '100 units',
      moqPrice: '$15.00 / unit'
    }
  ];

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-dark-background">
      <DashboardSidebar />
      <div className="flex-1 overflow-y-auto p-8 max-w-[1200px] w-full">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-dark-on-surface">Supplier Comparison</h2>
            <p className="text-gray-500 dark:text-dark-on-surface-variant mt-1 text-[14px]">Evaluate top tier suppliers side-by-side to make informed procurement decisions. Data is refreshed weekly from verified global indices.</p>
          </div>
          <div className="flex gap-3">
            <button className="border border-gray-300 dark:border-dark-surface-variant/50 text-gray-600 dark:text-dark-on-surface hover:bg-gray-50 dark:hover:bg-dark-surface-container bg-white dark:bg-dark-surface px-4 py-2.5 rounded-md font-bold text-[13px] flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[18px]">ios_share</span> Export PDF
            </button>
            <button className="bg-[#f3e8ff] dark:bg-[#d0bcff]/10 hover:bg-[#e8def8] dark:hover:bg-[#d0bcff]/20 text-[#5300b7] dark:text-[#d0bcff] px-4 py-2.5 rounded-md font-bold text-[13px] flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined text-[18px]">add</span> Add Supplier
            </button>
          </div>
        </header>

        {/* Comparison Table */}
        <section className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-dark-surface-variant/30 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-surface-variant/30">
                  <th className="py-8 px-6 text-left w-48 text-[14px] font-extrabold text-gray-900 dark:text-dark-on-surface bg-white dark:bg-dark-surface align-top">Criteria</th>
                  {suppliers.map((s, i) => (
                    <th key={i} className="py-8 px-6 min-w-[240px] bg-white dark:bg-dark-surface align-top">
                      <div className="flex flex-col items-center">
                        <div className={`w-16 h-16 rounded-full border-4 border-white dark:border-dark-surface shadow-sm ${s.imageBg} mb-4 overflow-hidden flex items-center justify-center`}>
                           <span className="material-symbols-outlined text-gray-400 dark:text-white/50 text-3xl">domain</span>
                        </div>
                        <h3 className="text-[16px] font-extrabold text-gray-900 dark:text-dark-on-surface mb-2">{s.name}</h3>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${s.badgeBg} ${s.badgeColor}`}>
                          <span className="material-symbols-outlined text-[14px]">{s.badgeIcon}</span> {s.badge}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-surface-variant/30">
                <tr className="hover:bg-gray-50/50 dark:hover:bg-dark-surface-container/50 transition-colors">
                  <td className="py-6 px-6 text-left text-[14px] font-medium text-gray-500 dark:text-dark-on-surface-variant bg-white dark:bg-dark-surface">Overall Rating</td>
                  {suppliers.map((s, i) => (
                    <td key={i} className="py-6 px-6 bg-white dark:bg-dark-surface">
                      <div className="flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-[#5300b7] dark:text-[#d0bcff] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-extrabold text-[15px] text-[#5300b7] dark:text-[#d0bcff]">{s.rating}</span>
                        <span className="text-[13px] text-gray-400 dark:text-gray-500">({s.reviews})</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50/50 dark:hover:bg-dark-surface-container/50 transition-colors">
                  <td className="py-6 px-6 text-left text-[14px] font-medium text-gray-500 dark:text-dark-on-surface-variant bg-white dark:bg-dark-surface">Certifications</td>
                  {suppliers.map((s, i) => (
                    <td key={i} className="py-6 px-6 bg-white dark:bg-dark-surface">
                      <div className="flex flex-wrap justify-center gap-2">
                        {s.certifications.map(c => (
                          <span key={c} className="bg-gray-50 dark:bg-dark-surface-container border border-gray-100 dark:border-dark-surface-variant/30 text-gray-500 dark:text-dark-on-surface-variant px-3 py-1 rounded-[4px] text-[11px] font-bold uppercase tracking-wide">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50/50 dark:hover:bg-dark-surface-container/50 transition-colors">
                  <td className="py-6 px-6 text-left text-[14px] font-medium text-gray-500 dark:text-dark-on-surface-variant bg-white dark:bg-dark-surface">Export Markets</td>
                  {suppliers.map((s, i) => (
                    <td key={i} className="py-6 px-6 bg-white dark:bg-dark-surface text-[13px] text-gray-600 dark:text-dark-on-surface font-medium leading-relaxed">
                      {s.markets}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50/50 dark:hover:bg-dark-surface-container/50 transition-colors">
                  <td className="py-6 px-6 text-left text-[14px] font-medium text-gray-500 dark:text-dark-on-surface-variant bg-white dark:bg-dark-surface">Lead Time (Est.)</td>
                  {suppliers.map((s, i) => (
                    <td key={i} className="py-6 px-6 bg-white dark:bg-dark-surface">
                      <p className="font-extrabold text-[16px] text-gray-900 dark:text-dark-on-surface mb-1">{s.leadTime}</p>
                      <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">{s.leadTimeType}</p>
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50/50 dark:hover:bg-dark-surface-container/50 transition-colors border-b border-gray-100 dark:border-dark-surface-variant/30">
                  <td className="py-6 px-6 text-left text-[14px] font-medium text-gray-500 dark:text-dark-on-surface-variant bg-white dark:bg-dark-surface">Minimum Order (MOQ)</td>
                  {suppliers.map((s, i) => (
                    <td key={i} className="py-6 px-6 bg-white dark:bg-dark-surface">
                      <p className="font-extrabold text-[16px] text-[#5300b7] dark:text-[#d0bcff] mb-1">{s.moq}</p>
                      <p className="text-[12px] text-gray-400 dark:text-gray-500 font-medium">{s.moqPrice}</p>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-8 px-6 bg-white dark:bg-dark-surface"></td>
                  {suppliers.map((s, i) => (
                    <td key={i} className="py-8 px-6 bg-white dark:bg-dark-surface">
                      <div className="flex flex-col gap-3 max-w-[200px] mx-auto">
                        <button className="w-full bg-[#3b07bd] dark:bg-[#d0bcff] hover:bg-[#2e0594] dark:hover:bg-[#e8def8] text-white dark:text-[#381e72] font-bold py-2.5 rounded-md text-[13px] transition-colors">
                          Contact Supplier
                        </button>
                        <button className="w-full border border-[#5300b7] dark:border-[#d0bcff] text-[#5300b7] dark:text-[#d0bcff] hover:bg-[#5300b7] hover:text-white dark:hover:bg-[#d0bcff] dark:hover:text-[#381e72] font-bold py-2.5 rounded-md text-[13px] transition-colors">
                          View Profile
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
