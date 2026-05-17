'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Badge, Star, QrCode, CheckCircle } from 'lucide-react';

// Premium Company Avatar component with robust fallback rendering
const CompanyAvatar = ({ logoUrl, companyName, className, index }: { logoUrl?: string, companyName: string, className: string, index: number }) => {
  const [imgError, setImgError] = useState(false);
  
  const getAvatarBg = (idx: number) => {
    const bgs = [
      'bg-gradient-to-br from-yellow-400 to-amber-600 text-white', // Gold/Rank 1
      'bg-gradient-to-br from-indigo-400 to-indigo-700 text-white', // Purple/Rank 2
      'bg-gradient-to-br from-emerald-400 to-emerald-700 text-white', // Emerald/Rank 3
      'bg-gradient-to-br from-blue-500 to-indigo-600 text-white',
      'bg-gradient-to-br from-pink-500 to-rose-600 text-white',
      'bg-gradient-to-br from-purple-500 to-violet-600 text-white',
      'bg-gradient-to-br from-teal-500 to-emerald-600 text-white',
    ];
    return bgs[idx % bgs.length];
  };

  const isUiAvatar = logoUrl && (logoUrl.includes('ui-avatars.com') || logoUrl.trim() === '');

  if (logoUrl && !imgError && !isUiAvatar) {
    return (
      <div className={`${className} overflow-hidden flex items-center justify-center`}>
        <img 
          src={logoUrl} 
          alt={companyName} 
          onError={() => setImgError(true)} 
          className="w-full h-full object-cover" 
        />
      </div>
    );
  }

  return (
    <div className={`${className} flex items-center justify-center font-black ${getAvatarBg(index)} shadow-inner`}>
      <span>{companyName ? companyName[0].toUpperCase() : 'G'}</span>
    </div>
  );
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPassport, setShowPassport] = useState(false);

  const [myCompany, setMyCompany] = useState<any>(null);
  const [myScore, setMyScore] = useState<any>(null);

  useEffect(() => {
    // Dynamic API URL resolver that adapts to local network testing (e.g. when hosted on 0.0.0.0)
    const getApiUrl = () => {
      if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
          return `http://${hostname}:8081`;
        }
      }
      return 'http://localhost:8081';
    };

    const API_URL = getApiUrl();

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/leaderboard`);
        const result = await res.json();
        const finalData = Array.isArray(result) ? result : (result.data || []);
        setLeaderboardData(finalData);

        if (user?.id) {
          // Fetch real-time company info with auth headers
          const token = localStorage.getItem('grawizah_token');
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;

          const compRes = await fetch(`${API_URL}/api/companies/me?user_id=${user.id}`, { headers });
          if (compRes.ok) {
            const compData = await compRes.json();
            setMyCompany(compData);
          }

          // Fetch real-time leaderboard score and rank
          const scoreRes = await fetch(`${API_URL}/api/leaderboard/company/${user.id}`);
          if (scoreRes.ok) {
            const scoreData = await scoreRes.json();
            setMyScore(scoreData);
          }
        }
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [user]);

  const topThree = leaderboardData.slice(0, 3);
  const others = leaderboardData.slice(3);

  const getStatus = (score: number) => score >= 90 ? 'Elite' : score >= 75 ? 'Gold' : 'Standard';
  const getAvatarBg = (idx: number) => {
    const bgs = ['bg-purple-100 text-purple-700', 'bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700'];
    return bgs[idx % bgs.length];
  };

  return (
    <div className="p-6 md:p-10 w-full min-h-full relative">
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
            <Badge className="w-4 h-4" /> My Trust Passport
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
          <div className="w-full max-w-[900px] mx-auto">
            <section className="flex flex-row items-end justify-center gap-2 md:gap-6 mb-4 md:mb-12 h-[180px] md:h-[280px] pt-8 md:pt-0">
            {/* Rank 2 */}
            {topThree[1] && (
              <div className="bg-white dark:bg-dark-surface-container-low rounded-xl md:rounded-2xl p-2 md:p-6 text-center shadow-sm border border-gray-100 dark:border-dark-surface-variant/30 w-[30%] md:w-[256px] relative flex flex-col items-center justify-end h-[120px] md:h-[200px] animate-slide-up">
                <CompanyAvatar 
                  logoUrl={topThree[1].logo_url} 
                  companyName={topThree[1].company_name} 
                  className="absolute -top-6 md:-top-10 w-12 h-12 md:w-20 md:h-20 rounded-full border-2 md:border-4 border-white dark:border-dark-surface-container-low shadow-md text-sm md:text-2xl" 
                  index={1} 
                />
                <h3 className="text-[9px] md:text-[15px] leading-tight font-extrabold text-gray-900 dark:text-dark-on-surface mt-4 md:mt-6 line-clamp-2">{topThree[1].company_name}</h3>
                <p className="hidden md:block text-[12px] text-gray-500 dark:text-dark-on-surface-variant mb-4">{topThree[1].country}</p>
                <div className="text-lg md:text-3xl font-extrabold text-primary mt-1 md:mt-0">{topThree[1].total_score.toFixed(1)}</div>
                <p className="text-[7px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider md:mt-1">Score</p>
              </div>
            )}

            {/* Rank 1 */}
            {topThree[0] && (
              <div className="bg-[#f3e8ff] dark:bg-[rgba(208,188,255,0.15)] rounded-xl md:rounded-2xl p-3 md:p-8 text-center shadow-[0_8px_30px_rgba(168,85,247,0.15)] border border-purple-200 dark:border-purple-900/30 w-[36%] md:w-[288px] relative flex flex-col items-center justify-end h-[150px] md:h-[240px] z-10 animate-scale-in">
                <div className="absolute -top-8 md:-top-12 w-16 h-16 md:w-24 md:h-24 rounded-full border-2 md:border-4 border-[#f3e8ff] dark:border-[#2a2136] shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                   <CompanyAvatar 
                     logoUrl={topThree[0].logo_url} 
                     companyName={topThree[0].company_name} 
                     className="w-full h-full rounded-full text-xl md:text-4xl" 
                     index={0} 
                   />
                   <div className="absolute -bottom-1 -right-1 w-5 h-5 md:w-8 md:h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white z-20">
                     <Star className="w-3 h-3 md:w-4 md:h-4 text-white fill-white" />
                   </div>
                </div>
                <h3 className="text-[10px] md:text-[18px] leading-tight font-extrabold text-gray-900 dark:text-white mt-5 md:mt-8 line-clamp-2">{topThree[0].company_name}</h3>
                <p className="hidden md:block text-[13px] text-gray-500 dark:text-gray-400 mb-4">{topThree[0].country}</p>
                <div className="text-xl md:text-4xl font-extrabold text-primary mt-1 md:mt-0">{topThree[0].total_score.toFixed(1)}</div>
                <p className="text-[7px] md:text-[11px] font-bold text-primary uppercase tracking-wider md:mt-1">Top</p>
              </div>
            )}

            {/* Rank 3 */}
            {topThree[2] && (
              <div className="bg-white dark:bg-dark-surface-container-low rounded-xl md:rounded-2xl p-2 md:p-6 text-center shadow-sm border border-gray-100 dark:border-dark-surface-variant/30 w-[30%] md:w-[256px] relative flex flex-col items-center justify-end h-[105px] md:h-[180px] animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <CompanyAvatar 
                  logoUrl={topThree[2].logo_url} 
                  companyName={topThree[2].company_name} 
                  className="absolute -top-6 md:-top-10 w-12 h-12 md:w-20 md:h-20 rounded-full border-2 md:border-4 border-white dark:border-dark-surface-container-low shadow-md text-sm md:text-2xl" 
                  index={2} 
                />
                <h3 className="text-[9px] md:text-[15px] leading-tight font-extrabold text-gray-900 dark:text-dark-on-surface mt-4 md:mt-6 line-clamp-2">{topThree[2].company_name}</h3>
                <p className="hidden md:block text-[12px] text-gray-500 dark:text-dark-on-surface-variant mb-4">{topThree[2].country}</p>
                <div className="text-lg md:text-3xl font-extrabold text-primary mt-1 md:mt-0">{topThree[2].total_score.toFixed(1)}</div>
                <p className="text-[7px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider md:mt-1">Score</p>
              </div>
            )}
            </section>
          </div>

          {/* Table Section */}
          <section className="bg-white dark:bg-dark-surface-container-low rounded-xl border border-gray-100 dark:border-dark-surface-variant/30 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[550px] md:min-w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-surface-container">
                    <th className="py-2 px-2 md:py-4 md:px-6 text-[9px] md:text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider">Rank</th>
                    <th className="py-2 px-2 md:py-4 md:px-6 text-[9px] md:text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider">Supplier</th>
                    <th className="py-2 px-2 md:py-4 md:px-6 text-[9px] md:text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider text-center">Score</th>
                    <th className="py-2 px-2 md:py-4 md:px-6 text-[9px] md:text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider text-center">Fulfill</th>
                    <th className="py-2 px-2 md:py-4 md:px-6 text-[9px] md:text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider text-center">Conv</th>
                    <th className="py-2 px-2 md:py-4 md:px-6 text-[9px] md:text-[11px] font-bold text-gray-500 dark:text-dark-on-surface-variant uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-surface-variant/30">
                  {leaderboardData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-dark-surface-container transition-colors">
                      <td className="py-2 px-2 md:py-4 md:px-6 text-[11px] md:text-[14px] font-extrabold text-gray-600 dark:text-gray-400">{idx + 1}</td>
                      <td className="py-2 px-2 md:py-4 md:px-6">
                        <div className="flex items-center gap-2 md:gap-4">
                          <CompanyAvatar 
                            logoUrl={row.logo_url} 
                            companyName={row.company_name} 
                            className="hidden sm:flex w-8 h-8 md:w-10 md:h-10 rounded text-[13px] md:text-[16px]" 
                            index={idx + 3} 
                          />
                          <div>
                            <p className="font-extrabold text-[11px] md:text-[14px] text-gray-900 dark:text-dark-on-surface leading-tight">{row.company_name}</p>
                            <p className="text-[9px] md:text-[12px] text-gray-500 dark:text-dark-on-surface-variant">{row.country}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-2 md:py-4 md:px-6 text-center font-extrabold text-[11px] md:text-[14px] text-primary">{row.total_score.toFixed(1)}</td>
                      <td className="py-2 px-2 md:py-4 md:px-6 text-center font-medium text-[10px] md:text-[13px] text-gray-600 dark:text-dark-on-surface-variant">{row.fulfillment_success}%</td>
                      <td className="py-2 px-2 md:py-4 md:px-6 text-center font-extrabold text-[11px] md:text-[14px] text-gray-900 dark:text-dark-on-surface">
                        {row.conversion_rate}%
                      </td>
                      <td className="py-2 px-2 md:py-4 md:px-6">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[9px] md:text-[11px] font-bold ${getStatus(row.total_score) === 'Elite' ? 'bg-[#eff6ff] text-[#2563eb]' : 'bg-gray-100 text-gray-600'}`}>
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
                    <CheckCircle className="w-8 h-8 text-primary" />
                 </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
                  <CompanyAvatar 
                    logoUrl={myCompany?.logo_url} 
                    companyName={myCompany?.name || user?.email || 'G'} 
                    className="w-24 h-24 rounded-2xl border border-white/30 text-4xl shrink-0" 
                    index={3} 
                  />
                 <div>
                   <h3 className="text-xl font-bold">{myCompany?.name || 'Grawizah Verified Supplier'}</h3>
                   <p className="text-white/60 text-sm">
                     Member since {myCompany?.created_at ? new Date(myCompany.created_at).getFullYear() : '2024'} • {myCompany?.country || 'Global'}
                   </p>
                   <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                     <span className="px-2 py-0.5 bg-yellow-400 text-indigo-900 rounded text-[10px] font-black uppercase tracking-wider">
                       {myScore?.total_score !== undefined ? (myScore.total_score >= 90 ? 'Top 1%' : myScore.total_score >= 75 ? 'Top 10%' : 'Verified') : 'Top 1%'}
                     </span>
                     <span className="px-2 py-0.5 bg-white/20 text-white rounded text-[10px] font-black uppercase tracking-wider">
                       {myScore?.total_score !== undefined ? (myScore.total_score >= 90 ? 'A+ Rated' : myScore.total_score >= 75 ? 'A Rated' : 'B Rated') : 'A+ Rated'}
                     </span>
                   </div>
                 </div>
               </div>
            </div>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-dark-surface">
               <div className="space-y-4">
                 <div className="p-4 bg-gray-50 dark:bg-dark-surface-container rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Global Reliability</p>
                    <p className="text-2xl font-black text-primary">
                      {myScore?.fulfillment_success !== undefined ? `${myScore.fulfillment_success.toFixed(1)}%` : '98.4%'}
                    </p>
                 </div>
                 <div className="p-4 bg-gray-50 dark:bg-dark-surface-container rounded-2xl">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">AI Verified Trust</p>
                    <p className="text-2xl font-black text-primary">
                      {myScore?.total_score !== undefined ? (myScore.total_score >= 90 ? 'Elite' : myScore.total_score >= 75 ? 'Premium' : 'Standard') : 'High'}
                    </p>
                 </div>
               </div>
               <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white dark:bg-dark-surface shadow-md rounded-xl flex items-center justify-center mb-3">
                     <QrCode className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-[10px] font-bold text-primary uppercase">Scan to Verify</p>
                  <p className="text-[8px] text-gray-400 mt-1">
                    Passport ID: GWA-{myCompany?.id ? myCompany.id.substring(0, 8).toUpperCase() : '9842-XYZ'}
                  </p>
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

