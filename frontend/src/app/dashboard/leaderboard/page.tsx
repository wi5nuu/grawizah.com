'use client';

export default function LeaderboardPage() {
  const topThree = [
    { rank: 2, name: 'NexaTech Global', category: 'Electronics', score: 94.2, image: '/images/supplier-nexa.png', iconBg: 'bg-[#18181b]' },
    { rank: 1, name: 'AeroMotive Industries', category: 'Manufacturing', score: 98.7, image: '/images/supplier-aero.png', iconBg: 'bg-[#0f172a]' },
    { rank: 3, name: 'EcoPlast Global', category: 'Raw Materials', score: 91.5, image: '/images/supplier-eco.png', iconBg: 'bg-[#d1fae5]' },
  ];

  const tableData = [
    { rank: 4, name: 'Vanguard Logistics', category: 'Shipping', score: 89.4, inquiries: '1,245', conversion: '68%', trend: 'up', status: 'Elite', avatar: 'V', avatarBg: 'bg-purple-100 text-purple-700' },
    { rank: 5, name: 'Synapse Components', category: 'Electronics', score: 87.1, inquiries: '980', conversion: '62%', trend: 'flat', status: 'Elite', avatar: 'S', avatarBg: 'bg-indigo-100 text-indigo-700' },
    { rank: 6, name: 'OmniTrade Intl', category: 'General Goods', score: 85.8, inquiries: '2,100', conversion: '54%', trend: 'down', status: 'Standard', avatar: 'O', avatarBg: 'bg-pink-100 text-pink-700' },
  ];

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full bg-[#fafafa] dark:bg-dark-background min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-dark-on-surface">Supplier Leaderboard</h2>
          <p className="text-gray-500 dark:text-dark-on-surface-variant mt-1 text-[15px]">Top performing global trade partners based on transaction volume and reliability.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="appearance-none bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-surface-variant/50 rounded-md py-2 pl-4 pr-10 text-sm font-bold text-gray-700 dark:text-dark-on-surface focus:outline-none focus:ring-1 focus:ring-[#5300b7]">
              <option>This Quarter</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">expand_more</span>
          </div>
          <button className="border-2 border-[#5300b7] dark:border-[#d0bcff] text-[#5300b7] dark:text-[#d0bcff] hover:bg-[#5300b7] hover:text-white dark:hover:bg-[#d0bcff] dark:hover:text-[#381e72] px-4 py-2 rounded-md font-bold text-[13px] flex items-center gap-2 transition-colors bg-white dark:bg-transparent">
            <span className="material-symbols-outlined text-[18px]">download</span> Export
          </button>
        </div>
      </header>

      {/* Top 3 Podium */}
      <section className="flex flex-col md:flex-row items-end justify-center gap-6 mb-12 h-[280px]">
        {/* Rank 2 */}
        <div className="bg-white dark:bg-dark-surface-container-low rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-dark-surface-variant/30 w-64 relative flex flex-col items-center justify-end h-[200px]">
          <div className="absolute -top-10 w-20 h-20 rounded-full border-4 border-white dark:border-dark-surface-container-low bg-[#18181b] overflow-hidden flex items-center justify-center shadow-md">
             <span className="material-symbols-outlined text-white text-[32px]">domain</span>
          </div>
          <h3 className="text-[15px] font-extrabold text-gray-900 dark:text-dark-on-surface mt-6">{topThree[0].name}</h3>
          <p className="text-[12px] text-gray-500 dark:text-dark-on-surface-variant mb-4">{topThree[0].category}</p>
          <div className="text-3xl font-extrabold text-[#5300b7] dark:text-[#d0bcff]">{topThree[0].score}</div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">Score</p>
        </div>

        {/* Rank 1 */}
        <div className="bg-[#f3e8ff] dark:bg-[rgba(208,188,255,0.15)] rounded-2xl p-8 text-center shadow-[0_8px_30px_rgba(168,85,247,0.15)] border border-purple-200 dark:border-purple-900/30 w-72 relative flex flex-col items-center justify-end h-[240px] z-10">
          <div className="absolute -top-12 w-24 h-24 rounded-full border-4 border-[#f3e8ff] dark:border-[#2a2136] bg-[#0f172a] overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)]">
             <span className="material-symbols-outlined text-white text-[40px]">precision_manufacturing</span>
             <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
               <span className="material-symbols-outlined text-white text-[16px] font-bold">star</span>
             </div>
          </div>
          <h3 className="text-[18px] font-extrabold text-gray-900 dark:text-white mt-8">{topThree[1].name}</h3>
          <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">{topThree[1].category}</p>
          <div className="text-4xl font-extrabold text-[#5300b7] dark:text-[#d0bcff]">{topThree[1].score}</div>
          <p className="text-[11px] font-bold text-[#5300b7] dark:text-[#d0bcff] uppercase tracking-wider mt-1">Overall Score</p>
        </div>

        {/* Rank 3 */}
        <div className="bg-white dark:bg-dark-surface-container-low rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-dark-surface-variant/30 w-64 relative flex flex-col items-center justify-end h-[180px]">
          <div className="absolute -top-10 w-20 h-20 rounded-full border-4 border-white dark:border-dark-surface-container-low bg-[#d1fae5] overflow-hidden flex items-center justify-center shadow-md">
             <span className="material-symbols-outlined text-teal-600 text-[32px]">recycling</span>
          </div>
          <h3 className="text-[15px] font-extrabold text-gray-900 dark:text-dark-on-surface mt-6">{topThree[2].name}</h3>
          <p className="text-[12px] text-gray-500 dark:text-dark-on-surface-variant mb-4">{topThree[2].category}</p>
          <div className="text-3xl font-extrabold text-[#5300b7] dark:text-[#d0bcff]">{topThree[2].score}</div>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">Score</p>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-white dark:bg-dark-surface-container-low rounded-xl border border-gray-100 dark:border-dark-surface-variant/30 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-surface-container">
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider">Rank</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider">Supplier</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider text-center">Overall Score</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider text-center">Inquiries Handled</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider text-center">Conversion Rate</th>
                <th className="py-4 px-6 text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-dark-surface-variant/30">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-dark-surface-container transition-colors">
                  <td className="py-4 px-6 text-[14px] font-extrabold text-gray-600 dark:text-gray-400">{row.rank}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded ${row.avatarBg} dark:bg-opacity-20 flex items-center justify-center font-bold text-[16px]`}>
                        {row.avatar}
                      </div>
                      <div>
                        <p className="font-extrabold text-[14px] text-gray-900 dark:text-dark-on-surface">{row.name}</p>
                        <p className="text-[12px] text-gray-500 dark:text-dark-on-surface-variant">{row.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-extrabold text-[14px] text-gray-900 dark:text-dark-on-surface">{row.score}</td>
                  <td className="py-4 px-6 text-center font-medium text-[13px] text-gray-600 dark:text-dark-on-surface-variant">{row.inquiries}</td>
                  <td className="py-4 px-6 text-center font-extrabold text-[14px] text-gray-900 dark:text-dark-on-surface flex items-center justify-center gap-1">
                    {row.conversion}
                    {row.trend === 'up' && <span className="material-symbols-outlined text-[16px] text-emerald-500">trending_up</span>}
                    {row.trend === 'flat' && <span className="material-symbols-outlined text-[16px] text-gray-400">trending_flat</span>}
                    {row.trend === 'down' && <span className="material-symbols-outlined text-[16px] text-red-500">trending_down</span>}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-[4px] text-[11px] font-bold ${row.status === 'Elite' ? 'bg-[#eff6ff] text-[#2563eb] dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-surface-variant/30 flex items-center justify-between">
          <p className="text-[12px] text-gray-500 dark:text-dark-on-surface-variant font-medium">Showing 4-6 of 248 Suppliers</p>
          <div className="flex gap-4 items-center text-[12px] font-bold text-gray-600 dark:text-gray-400">
            <button className="hover:text-gray-900 dark:hover:text-white transition-colors">&lt;</button>
            <span>Page 2 of 42</span>
            <button className="hover:text-gray-900 dark:hover:text-white transition-colors">&gt;</button>
          </div>
        </div>
      </section>
    </div>
  );
}
