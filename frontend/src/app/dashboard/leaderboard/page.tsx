'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPassport, setShowPassport] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/leaderboard`);
        const result = await res.json();
        const finalData = Array.isArray(result) ? result : (result.data || []);
        setLeaderboardData(finalData);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const topThree = leaderboardData.slice(0, 3);
  const others = leaderboardData.slice(3);

  const getStatus = (score: number) => score >= 90 ? 'Elite' : score >= 75 ? 'Gold' : 'Standard';
  const getAvatarBg = (idx: number) => {
    const bgs = ['bg-purple-100 text-purple-700', 'bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700'];
    return bgs[idx % bgs.length];
  };

  return (
    <div className="p-6 md:p-10 w-full bg-[#fafafa] dark:bg-dark-background min-h-screen relative">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-dark-on-surface">Global Leaderboard</h2>
          <p className="text-gray-500 dark:text-dark-on-surface-variant mt-1 text-[15px]">AI-ranked top performing global trade partners based on reliability and fulfillment.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowPassport(true)}
            className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">badge</span> My Trust Passport
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <section className="flex flex-col md:flex-row items-end justify-center gap-6 mb-12 h-[280px]">
            {/* Rank 2 */}
            {topThree[1] && (
              <div className="bg-white dark:bg-dark-surface-container-low rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-dark-surface-variant/30 w-64 relative flex flex-col items-center justify-end h-[200px] animate-slide-up">
                <div className="absolute -top-10 w-20 h-20 rounded-full border-4 border-white dark:border-dark-surface-container-low bg-indigo-900 overflow-hidden flex items-center justify-center shadow-md">
                   <span className="text-white font-black text-2xl">{topThree[1].company_name[0]}</span>
                </div>
                <h3 className="text-[15px] font-extrabold text-gray-900 dark:text-dark-on-surface mt-6">{topThree[1].company_name}</h3>
                <p className="text-[12px] text-gray-500 dark:text-dark-on-surface-variant mb-4">{topThree[1].country}</p>
                <div className="text-3xl font-extrabold text-primary">{topThree[1].total_score.toFixed(1)}</div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Score</p>
              </div>
            )}

            {/* Rank 1 */}
            {topThree[0] && (
              <div className="bg-[#f3e8ff] dark:bg-[rgba(208,188,255,0.15)] rounded-2xl p-8 text-center shadow-[0_8px_30px_rgba(168,85,247,0.15)] border border-purple-200 dark:border-purple-900/30 w-72 relative flex flex-col items-center justify-end h-[240px] z-10 animate-scale-in">
                <div className="absolute -top-12 w-24 h-24 rounded-full border-4 border-[#f3e8ff] dark:border-[#2a2136] bg-[#0f172a] overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                   <span className="text-white font-black text-4xl">{topThree[0].company_name[0]}</span>
                   <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                     <span className="material-symbols-outlined text-white text-[16px] font-bold">star</span>
                   </div>
                </div>
                <h3 className="text-[18px] font-extrabold text-gray-900 dark:text-white mt-8">{topThree[0].company_name}</h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">{topThree[0].country}</p>
                <div className="text-4xl font-extrabold text-primary">{topThree[0].total_score.toFixed(1)}</div>
                <p className="text-[11px] font-bold text-primary uppercase tracking-wider mt-1">Top Performer</p>
              </div>
            )}

            {/* Rank 3 */}
            {topThree[2] && (
              <div className="bg-white dark:bg-dark-surface-container-low rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-dark-surface-variant/30 w-64 relative flex flex-col items-center justify-end h-[180px] animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="absolute -top-10 w-20 h-20 rounded-full border-4 border-white dark:border-dark-surface-container-low bg-emerald-700 overflow-hidden flex items-center justify-center shadow-md">
                   <span className="text-white font-black text-2xl">{topThree[2].company_name[0]}</span>
                </div>
                <h3 className="text-[15px] font-extrabold text-gray-900 dark:text-dark-on-surface mt-6">{topThree[2].company_name}</h3>
                <p className="text-[12px] text-gray-500 dark:text-dark-on-surface-variant mb-4">{topThree[2].country}</p>
                <div className="text-3xl font-extrabold text-primary">{topThree[2].total_score.toFixed(1)}</div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Score</p>
              </div>
            )}
          </section>

          {/* Table Section */}
          <section className="bg-white dark:bg-dark-surface-container-low rounded-xl border border-gray-100 dark:border-dark-surface-variant/30 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-surface-container">
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider">Rank</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider">Supplier</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider text-center">Score</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider text-center">Fulfillment</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider text-center">Conversion</th>
                    <th className="py-4 px-6 text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-surface-variant/30">
                  {leaderboardData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-dark-surface-container transition-colors">
                      <td className="py-4 px-6 text-[14px] font-extrabold text-gray-600 dark:text-gray-400">{idx + 1}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded ${getAvatarBg(idx)} dark:bg-opacity-20 flex items-center justify-center font-bold text-[16px]`}>
                            {row.company_name[0]}
                          </div>
                          <div>
                            <p className="font-extrabold text-[14px] text-gray-900 dark:text-dark-on-surface">{row.company_name}</p>
                            <p className="text-[12px] text-gray-500 dark:text-dark-on-surface-variant">{row.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-extrabold text-[14px] text-primary">{row.total_score.toFixed(1)}</td>
                      <td className="py-4 px-6 text-center font-medium text-[13px] text-gray-600 dark:text-dark-on-surface-variant">{row.fulfillment_success}%</td>
                      <td className="py-4 px-6 text-center font-extrabold text-[14px] text-gray-900 dark:text-dark-on-surface">
                        {row.conversion_rate}%
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-[4px] text-[11px] font-bold ${getStatus(row.total_score) === 'Elite' ? 'bg-[#eff6ff] text-[#2563eb]' : 'bg-gray-100 text-gray-600'}`}>
                          {getStatus(row.total_score)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Trade Trust Passport Modal (Innovation) */}
      {showPassport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-dark-surface rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl relative border-4 border-primary/20 animate-scale-in">
            <div className="p-8 bg-gradient-to-br from-primary to-indigo-900 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
               <div className="flex justify-between items-start mb-12">
                 <div>
                   <h2 className="text-2xl font-black uppercase tracking-tighter">Trade Trust Passport</h2>
                   <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Verifiable Digital Identity</p>
                 </div>
                 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl font-bold">verified</span>
                 </div>
               </div>

               <div className="flex gap-6 items-center">
                 <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center text-4xl font-black">
                   {user?.email?.[0].toUpperCase() || 'G'}
                 </div>
                 <div>
                   <h3 className="text-xl font-bold">Grawizah Verified Supplier</h3>
                   <p className="text-white/60 text-sm">Member since 2024</p>
                   <div className="mt-2 flex items-center gap-2">
                     <span className="px-2 py-0.5 bg-yellow-400 text-indigo-900 rounded text-[10px] font-black uppercase tracking-wider">Top 1%</span>
                     <span className="px-2 py-0.5 bg-white/20 text-white rounded text-[10px] font-black uppercase tracking-wider">A+ Rated</span>
                   </div>
                 </div>
               </div>
            </div>

            <div className="p-8 grid grid-cols-2 gap-6 bg-white dark:bg-dark-surface">
               <div className="space-y-4">
                 <div className="p-4 bg-gray-50 dark:bg-dark-surface-container rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Global Reliability</p>
                    <p className="text-2xl font-black text-primary">98.4%</p>
                 </div>
                 <div className="p-4 bg-gray-50 dark:bg-dark-surface-container rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">AI Verified Trust</p>
                    <p className="text-2xl font-black text-primary">High</p>
                 </div>
               </div>
               <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white dark:bg-dark-surface shadow-md rounded-xl flex items-center justify-center mb-3">
                     <span className="material-symbols-outlined text-3xl text-primary">qr_code_2</span>
                  </div>
                  <p className="text-[10px] font-bold text-primary uppercase">Scan to Verify</p>
                  <p className="text-[8px] text-gray-400 mt-1">Passport ID: GWA-9842-XYZ</p>
               </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-dark-surface-variant/30 flex justify-between items-center bg-gray-50 dark:bg-dark-surface-container">
               <p className="text-[10px] text-gray-400 font-medium">© 2024 Grawizah Global Intelligence. Securely encrypted.</p>
               <button 
                 onClick={() => setShowPassport(false)}
                 className="px-6 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors"
               >
                 Close Passport
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

