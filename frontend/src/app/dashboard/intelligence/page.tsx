'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import BuyerRadarTable from '@/components/BuyerRadarTable';
import TradeNetworkMap from '@/components/TradeNetworkMap';

const LANGUAGES = [
  { code: 'en', name: 'English' }, { code: 'id', name: 'Indonesian' },
  { code: 'zh', name: 'Chinese' }, { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' }, { code: 'ar', name: 'Arabic' },
  { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }, { code: 'pt', name: 'Portuguese' },
  { code: 'hi', name: 'Hindi' }, { code: 'th', name: 'Thai' },
  { code: 'vi', name: 'Vietnamese' }, { code: 'ms', name: 'Malay' },
];

export default function IntelligencePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'radar' | 'hs-code' | 'optimizer' | 'alerts' | 'translator' | 'benchmark' | 'matchmaking'>('overview');
  const [hsInput, setHsInput] = useState({ description: '', category: '' });
  const [hsResult, setHsResult] = useState<any>(null);
  const [hsLoading, setHsLoading] = useState(false);
  const [optimizerInput, setOptimizerInput] = useState({ product_id: '1' });
  const [optimizerResult, setOptimizerResult] = useState<any>(null);
  const [optimizerLoading, setOptimizerLoading] = useState(false);
  const [transText, setTransText] = useState('');
  const [transSource, setTransSource] = useState('');
  const [transTarget, setTransTarget] = useState('en');
  const [transResult, setTransResult] = useState<any>(null);
  const [transLoading, setTransLoading] = useState(false);
  const [detectResult, setDetectResult] = useState<any>(null);
  
  const [benchmarkQuery, setBenchmarkQuery] = useState('');
  const [benchmarkResult, setBenchmarkResult] = useState<any>(null);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);

  // Define tabs based on role
  const supplierTabs = [
    { id: 'overview' as const, icon: 'explore', label: 'Network Intelligence' },
    { id: 'matchmaking' as const, icon: 'auto_awesome', label: 'Smart Match' },
    { id: 'radar' as const, icon: 'target', label: 'Buyer Radar' },
    { id: 'optimizer' as const, icon: 'bolt', label: 'Optimizer' },
    { id: 'benchmark' as const, icon: 'monitoring', label: 'Benchmark' },
    { id: 'hs-code' as const, icon: 'smart_toy', label: 'HS Code' },
    { id: 'translator' as const, icon: 'translate', label: 'Translator' },
  ];

  const buyerTabs = [
    { id: 'overview' as const, icon: 'explore', label: 'Supply Chain Map' },
    { id: 'matchmaking' as const, icon: 'auto_awesome', label: 'Supplier Match' },
    { id: 'radar' as const, icon: 'radar', label: 'Supplier Discovery' },
    { id: 'benchmark' as const, icon: 'monitoring', label: 'Price Benchmark' },
    { id: 'hs-code' as const, icon: 'smart_toy', label: 'HS Classification' },
    { id: 'translator' as const, icon: 'translate', label: 'Translator' },
  ];

  const tabs = user?.role === 'buyer' ? buyerTabs : supplierTabs;

  const classifyHSCode = async () => {
    setHsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/ai/hs-code`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(hsInput) });
      const data = await res.json();
      setHsResult(data.data || data);
    } catch { } finally { setHsLoading(false); }
  };

  const optimizeListing = async () => {
    setOptimizerLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/ai/optimize-listing`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: optimizerInput.product_id }) });
      const data = await res.json();
      setOptimizerResult(data);
    } catch { } finally { setOptimizerLoading(false); }
  };

  const translateText = async () => {
    setTransLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/ai/translate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: transText, targetLang: transTarget }) });
      const data = await res.json();
      setTransResult(data);
    } catch { } finally { setTransLoading(false); }
  };

  const detectLanguage = async () => {
    if (!transText) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/ai/detect-language`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: transText }) });
      const data = await res.json();
      setDetectResult(data);
      if (data.language) setTransSource(data.language);
    } catch { }
  };

  const fetchBenchmark = async () => {
    if (!benchmarkQuery) return;
    setBenchmarkLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081'}/api/competitor/benchmark?product=${encodeURIComponent(benchmarkQuery)}`);
      const data = await res.json();
      setBenchmarkResult(data);
    } catch { } finally { setBenchmarkLoading(false); }
  };

  return (
    <div className="max-w-[1440px] mx-auto p-8 relative z-10 font-sans">
      {/* Page Header */}
      <header className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">
            {user?.role === 'buyer' ? 'Strategic Sourcing Intelligence' : 'Trade Growth Intelligence'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">AI-driven insights for {user?.role === 'buyer' ? 'secure sourcing' : 'global market expansion'}.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input className="pl-10 pr-4 py-2 rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 text-sm font-medium w-64" placeholder="Deep search markets..." />
          </div>
          <button className="w-10 h-10 rounded-sm bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-white/5 rounded-sm p-1 mb-8 overflow-x-auto relative z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-sm text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-white dark:bg-white text-black dark:text-black shadow-lg scale-105' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* === Overview Tab (Innovative Intelligence) === */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
          <div className="col-span-1 md:col-span-8">
            <TradeNetworkMap />
          </div>

          <div className="col-span-1 md:col-span-4 bg-white dark:bg-black/40 backdrop-blur-md rounded-sm p-8 border border-gray-100 dark:border-white/10 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-sm bg-[#d1fae5] text-[#047857] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl font-bold">verified</span>
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight tracking-tighter">Trust Score</h3>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">AI-Verified Portfolio</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100 dark:text-white/5" />
                  <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={402} strokeDashoffset={402 * (1 - 0.94)} className="text-primary transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-gray-900 dark:text-white">94</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AA CLASS</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-auto">
              {[
                { label: 'Documentation Compliance', score: '98%' },
                { label: 'Trade History Accuracy', score: '100%' },
                { label: 'Network Reliability', score: '91%' }
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
                  <span className="text-gray-500 dark:text-gray-400">{item.label}</span>
                  <span className="text-gray-900 dark:text-white">{item.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-8 bg-white dark:bg-black/40 rounded-sm p-8 border border-gray-100 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
              <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">Strategic Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Market Diversification', desc: 'Slight shift to Vietnam market could improve margins by 8.4% based on current HS-Code trends.', color: 'border-blue-500' },
                { title: 'Logistics Optimization', desc: 'Freight consolidation at Singapore hub identified as highest efficiency path for Q4.', color: 'border-purple-500' },
              ].map((rec) => (
                <div key={rec.title} className={`p-6 rounded-sm bg-gray-50/50 dark:bg-white/5 border-l-4 ${rec.color} hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer group`}>
                  <h3 className="font-black text-[13px] text-gray-900 dark:text-white mb-2 uppercase tracking-wide group-hover:text-primary transition-colors">{rec.title}</h3>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{rec.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-4 bg-white dark:bg-black/40 rounded-sm p-8 border border-gray-100 dark:border-white/10 shadow-sm">
            <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wider">
              <span className="material-symbols-outlined text-primary">list_alt</span> Smart Insights
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Supply Chain Sync', desc: 'Switch to regional suppliers to cut costs by 12%.', icon: 'sync_alt' },
                { title: 'Inventory Pulse', desc: 'Electronics category stock is below 15% threshold.', icon: 'analytics' },
              ].map((rec) => (
                <div key={rec.title} className="p-4 rounded-sm bg-gray-50/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer group flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary text-[24px] mt-0.5">{rec.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-tight">{rec.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mt-1">{rec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === AI Smart Matchmaker Tab (Innovation) === */}
      {activeTab === 'matchmaking' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-black dark:bg-white p-12 text-white dark:text-black rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1 bg-primary text-white rounded-sm text-[10px] font-black uppercase tracking-[0.3em]">AI ENGINE v2.4</span>
                </div>
                <h2 className="text-5xl font-black mb-6 leading-[0.9] tracking-tighter">
                  {user?.role === 'buyer' ? 'Find Vetted Suppliers Instantly' : 'Connect with Global Buyers Instantly'}
                </h2>
                <p className="text-gray-400 dark:text-gray-600 text-xl font-medium max-w-lg">Our neural matching engine analyzes {user?.role === 'buyer' ? '300k+ verified factories' : '500k+ global trade leads'} to find your perfect partner.</p>
              </div>
              <button className="px-12 py-5 bg-primary text-white rounded-sm font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl">
                RUN MATCHMAKING
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: user?.role === 'buyer' ? 'Global Precision Mfg' : 'InduCorp Global', region: user?.role === 'buyer' ? 'Vietnam' : 'Germany', score: 98, reason: user?.role === 'buyer' ? 'Matches your Q4 sustainability requirements and production volume.' : 'High demand for your specific steel grade in their Q4 manufacturing forecast.', category: user?.role === 'buyer' ? 'Metal Fabrication' : 'Automotive' },
              { name: user?.role === 'buyer' ? 'Eco-Safe Materials' : 'SkyLine Imports', region: user?.role === 'buyer' ? 'Malaysia' : 'UAE', score: 92, reason: user?.role === 'buyer' ? 'Verified zero-waste facility with active ISO 14001 compliance.' : 'Historical preference for Southeast Asian suppliers with your ISO certifications.', category: user?.role === 'buyer' ? 'Chemicals' : 'Construction' },
              { name: user?.role === 'buyer' ? 'Apex Components' : 'Nordic Trade Co', region: user?.role === 'buyer' ? 'Thailand' : 'Sweden', score: 87, reason: user?.role === 'buyer' ? 'Top-rated for shipping reliability on the Grawizah Trade Network.' : 'Seeking sustainable raw materials matching your ecological verification.', category: user?.role === 'buyer' ? 'Electronics' : 'Retail' }
            ].map((match, i) => (
              <div key={i} className="bg-white dark:bg-black/40 rounded-sm p-10 border border-gray-100 dark:border-white/10 shadow-sm hover:border-primary/50 transition-all group">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-sm flex items-center justify-center text-primary font-black text-3xl group-hover:bg-primary group-hover:text-white transition-all">
                    {match.name[0]}
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-primary">{match.score}%</div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Match Score</div>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight uppercase">{match.name}</h3>
                <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">{match.region} • {match.category}</p>
                <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-sm border-l-4 border-primary mb-8">
                  <p className="text-[13px] text-gray-600 dark:text-gray-400 font-bold leading-relaxed italic">"{match.reason}"</p>
                </div>
                <button className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-sm font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all flex items-center justify-center gap-3">
                   {user?.role === 'buyer' ? 'Request Quote' : 'Send Proposal'} <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === Radar Tab === */}
      {activeTab === 'radar' && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-3xl">radar</span>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">
              {user?.role === 'buyer' ? 'Supplier Discovery Radar' : 'Active Buyer Radar'}
            </h2>
            <div className="ml-4 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-sm text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE STREAM
            </div>
          </div>
          <BuyerRadarTable />
        </div>
      )}

      {/* === HS Code Tab === */}
      {activeTab === 'hs-code' && (
        <div className="max-w-2xl animate-fade-in">
          <div className="bg-white dark:bg-black/40 p-10 rounded-sm border border-gray-100 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-sm flex items-center justify-center"><span className="material-symbols-outlined text-3xl">smart_toy</span></div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">AI HS Code Classification</h2>
                <p className="text-xs text-gray-500 font-bold uppercase mt-1 tracking-wider">Precision mapping for global trade compliance</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">Product Description *</label>
                <textarea value={hsInput.description} onChange={(e) => setHsInput({ ...hsInput, description: e.target.value })} className="w-full px-4 py-3 rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 focus:border-primary outline-none text-sm h-32 font-medium" placeholder="e.g. Fresh coconut oil, virgin, organic" />
              </div>
              <button onClick={classifyHSCode} disabled={!hsInput.description || hsLoading} className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50">
                {hsLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span className="material-symbols-outlined text-[20px]">psychology</span> Analyze Classification</>}
              </button>
            </div>
            {hsResult && (
              <div className="mt-10 p-8 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-sm animate-slide-up">
                <div className="flex items-center gap-3 mb-6"><span className="material-symbols-outlined text-emerald-500">auto_awesome</span><h3 className="font-black text-xs uppercase tracking-[0.2em]">Classification Output</h3></div>
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">HS Code</p><p className="text-4xl font-black text-primary tracking-tighter">{hsResult.hs_code}</p></div>
                  <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Confidence</p><p className="text-4xl font-black text-emerald-500 tracking-tighter">{((hsResult.confidence || 0) * 100).toFixed(0)}%</p></div>
                </div>
                <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Category Description</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-bold leading-relaxed">{hsResult.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* === Benchmark Tab === */}
      {activeTab === 'benchmark' && (
        <div className="space-y-8 animate-fade-in">
          <div className="bg-white dark:bg-black/40 p-10 rounded-sm border border-gray-100 dark:border-white/10 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-sm flex items-center justify-center"><span className="material-symbols-outlined text-3xl">monitoring</span></div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Global Price Benchmarking</h2>
                <p className="text-xs text-gray-500 font-bold uppercase mt-1 tracking-wider">Real-time market analytics across regions</p>
              </div>
            </div>
            <div className="flex gap-4">
              <input 
                value={benchmarkQuery}
                onChange={(e) => setBenchmarkQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 focus:border-primary outline-none text-sm font-medium" 
                placeholder="Enter product name (e.g. Zinc Die Casting)" 
              />
              <button 
                onClick={fetchBenchmark}
                disabled={benchmarkLoading || !benchmarkQuery}
                className="px-10 py-3 bg-black dark:bg-white text-white dark:text-black rounded-sm font-black text-xs uppercase tracking-[0.2em] disabled:opacity-50 flex items-center gap-3 transition-all"
              >
                {benchmarkLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span className="material-symbols-outlined text-[20px]">analytics</span> Run Analysis</>}
              </button>
            </div>
          </div>

          {benchmarkResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <div className="md:col-span-1 space-y-6">
                <div className="bg-primary p-8 rounded-sm text-white shadow-2xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">Market Average</p>
                  <p className="text-5xl font-black tracking-tighter">${benchmarkResult.avgPrice.toFixed(2)}</p>
                </div>
                <div className="bg-white dark:bg-black/40 p-8 rounded-sm border border-gray-100 dark:border-white/10 flex justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Lowest</p>
                    <p className="text-2xl font-black text-emerald-500 tracking-tighter">${benchmarkResult.minPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Highest</p>
                    <p className="text-2xl font-black text-red-500 tracking-tighter">${benchmarkResult.maxPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 bg-white dark:bg-black/40 p-10 rounded-sm border border-gray-100 dark:border-white/10 shadow-sm">
                <h3 className="text-[14px] font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-12 flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">bar_chart</span> Price Distribution Index
                </h3>
                <div className="h-64 flex items-end gap-3 px-4">
                  {benchmarkResult.prices.map((p: any, i: number) => (
                    <div key={i} className="flex-1 flex flex-col items-center group">
                      <div className="w-full bg-gray-100 dark:bg-white/10 rounded-sm transition-all group-hover:bg-primary relative" style={{ height: `${(p.price / benchmarkResult.maxPrice) * 100}%` }}>
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black py-1.5 px-3 rounded-sm opacity-0 group-hover:opacity-100 transition shadow-2xl whitespace-nowrap">${p.price.toFixed(0)}</div>
                      </div>
                      <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 mt-4 uppercase tracking-tighter truncate w-full text-center">{p.source}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === Translator Tab === */}
      {activeTab === 'translator' && (
        <div className="max-w-4xl animate-fade-in">
          <div className="bg-white dark:bg-black/40 p-10 rounded-sm border border-gray-100 dark:border-white/10 shadow-sm">
             <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 bg-primary/10 text-primary rounded-sm flex items-center justify-center"><span className="material-symbols-outlined text-3xl">translate</span></div>
               <div>
                 <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Global Trade Translator</h2>
                 <p className="text-xs text-gray-500 font-bold uppercase mt-1 tracking-wider">Break down communication barriers in seconds</p>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-6">
                 <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source Text</label>
                   <button onClick={detectLanguage} className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Detect Language</button>
                 </div>
                 <textarea value={transText} onChange={(e) => setTransText(e.target.value)} className="w-full h-48 px-4 py-4 rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 focus:border-primary outline-none text-sm font-medium resize-none" placeholder="Enter message to translate..." />
               </div>
               
               <div className="space-y-6">
                 <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Translation Output</label>
                   <select value={transTarget} onChange={(e) => setTransTarget(e.target.value)} className="bg-transparent border-none text-[10px] font-black text-primary uppercase tracking-widest outline-none cursor-pointer">
                     {LANGUAGES.map(l => <option key={l.code} value={l.code} className="bg-white dark:bg-black text-black dark:text-white">{l.name}</option>)}
                   </select>
                 </div>
                 <div className="w-full h-48 px-4 py-4 rounded-sm border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5 text-sm font-bold text-gray-800 dark:text-gray-200 overflow-y-auto leading-relaxed">
                   {transLoading ? 'Translating neural engine...' : transResult?.translation || 'Output will appear here...'}
                 </div>
               </div>
             </div>
             
             <div className="mt-10 flex justify-end">
               <button onClick={translateText} disabled={!transText || transLoading} className="px-12 py-4 bg-black dark:bg-white text-white dark:text-black rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:opacity-90 transition-all disabled:opacity-50">
                 {transLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'EXECUTE TRANSLATION'}
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
