'use client';

import { useState } from 'react';
import BuyerRadarTable from '@/components/BuyerRadarTable';
import { MarketOpportunityAlerts } from '@/components/MarketOpportunityAlerts';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'radar' | 'hs-code' | 'optimizer' | 'alerts' | 'translator' | 'benchmark'>('overview');
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

  const classifyHSCode = async () => {
    setHsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/ai/hs-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(hsInput) });
      const data = await res.json();
      setHsResult(data.data || data);
    } catch { } finally { setHsLoading(false); }
  };

  const optimizeListing = async () => {
    setOptimizerLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/ai/optimize-listing', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: optimizerInput.product_id }) });
      const data = await res.json();
      setOptimizerResult(data);
    } catch { } finally { setOptimizerLoading(false); }
  };

  const translateText = async () => {
    setTransLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/ai/translate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: transText, sourceLang: transSource, targetLang: transTarget }) });
      const data = await res.json();
      setTransResult(data);
    } catch { } finally { setTransLoading(false); }
  };

  const detectLanguage = async () => {
    if (!transText) return;
    try {
      const res = await fetch('http://localhost:8080/api/ai/detect-language', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: transText }) });
      const data = await res.json();
      setDetectResult(data);
      if (data.language) setTransSource(data.language);
    } catch { }
  };

  const fetchBenchmark = async () => {
    if (!benchmarkQuery) return;
    setBenchmarkLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/competitor/benchmark?product=${encodeURIComponent(benchmarkQuery)}`);
      const data = await res.json();
      setBenchmarkResult(data);
    } catch { } finally { setBenchmarkLoading(false); }
  };

  const tabs = [
    { id: 'overview' as const, icon: 'explore', label: 'Overview' },
    { id: 'radar' as const, icon: 'target', label: 'Buyer Radar' },
    { id: 'hs-code' as const, icon: 'smart_toy', label: 'HS Code' },
    { id: 'optimizer' as const, icon: 'bolt', label: 'Optimizer' },
    { id: 'benchmark' as const, icon: 'monitoring', label: 'Benchmark' },
    { id: 'alerts' as const, icon: 'notifications', label: 'Alerts' },
    { id: 'translator' as const, icon: 'translate', label: 'Translator' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto p-8 relative z-10">
      {/* Abstract Background */}
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-surface-container-low to-transparent opacity-50 pointer-events-none" />

      {/* Page Header */}
      <header className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-on-surface mb-2">Trade Intelligence</h1>
          <p className="text-on-surface-variant font-body">AI-driven insights and market analytics for global commerce.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="pl-10 pr-4 py-2 rounded-lg border-surface-variant bg-surface focus:border-secondary focus:ring-2 focus:ring-secondary/20 w-64 text-sm font-body" placeholder="Search markets..." />
          </div>
          <button className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-primary-fixed transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container-low rounded-xl p-1 mb-8 overflow-x-auto relative z-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeTab === tab.id ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* === Overview Tab (Bento Grid) === */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Market Opportunities (Span 8) */}
          <div className="col-span-1 md:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-ambient hover-lift transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                </div>
                <div>
                  <h2 className="text-xl font-headline font-bold text-on-surface">Market Opportunities</h2>
                  <p className="text-sm text-on-surface-variant font-body">AI predicted growth vectors for Q3</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full">High Confidence</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {[
                { label: 'Emerging Sector', value: 'Sustainable Textiles', trend: '+24% YoY' },
                { label: 'Target Region', value: 'Southeast Asia', trend: '+18% Demand' },
                { label: 'Price Volatility', value: 'Low Risk', trend: 'Stable Supply', icon: 'check_circle' },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-lg bg-surface-container-low border border-surface-variant/50">
                  <div className="text-sm text-on-surface-variant mb-1 font-body">{item.label}</div>
                  <div className="text-lg font-bold text-primary mb-2">{item.value}</div>
                  <div className="flex items-center gap-1 text-secondary font-medium text-sm">
                    <span className="material-symbols-outlined text-sm">{item.icon || 'trending_up'}</span> {item.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buyer Trends (Span 4) */}
          <div className="col-span-1 md:col-span-4 bg-gradient-to-br from-primary to-secondary rounded-xl p-6 shadow-ambient hover-lift transition-all duration-300 text-on-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-20 transform translate-x-4 -translate-y-4">
              <span className="material-symbols-outlined text-9xl">psychology</span>
            </div>
            <div className="relative z-10 h-full flex flex-col">
              <h2 className="text-xl font-headline font-bold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span> Buyer Trends
              </h2>
              <p className="text-primary-fixed-dim text-sm font-body mb-6">Real-time sentiment analysis</p>
              <div className="mt-auto space-y-4">
                {[
                  { label: 'Bulk Orders', status: 'Rising', width: '75%' },
                  { label: 'Lead Times', status: 'Decreasing', width: '40%' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.label}</span><span>{item.status}</span>
                    </div>
                    <div className="w-full bg-on-primary/20 rounded-full h-2">
                      <div className="bg-primary-fixed h-2 rounded-full" style={{ width: item.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Market Trends Chart (Span 8) */}
          <div className="col-span-1 md:col-span-8 bg-surface-container-lowest rounded-xl p-6 shadow-ambient hover-lift transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-headline font-bold text-on-surface">Market Trends Overview</h2>
              <div className="flex gap-2">
                {['1W', '1M', '1Y'].map((period, i) => (
                  <button key={period} className={`px-3 py-1 text-xs font-medium rounded-full ${i === 0 ? 'bg-primary-fixed text-on-primary-fixed' : 'text-on-surface-variant hover:bg-surface-container'}`}>{period}</button>
                ))}
              </div>
            </div>
            <div className="h-64 relative w-full border-l border-b border-outline-variant/30 flex items-end justify-between px-2 pb-2">
              <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-xs text-on-surface-variant py-2"><span>10k</span><span>5k</span><span>0</span></div>
              <svg className="absolute bottom-2 left-0 w-full h-[95%]" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs><linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#6d28d9" stopOpacity="0.2" /><stop offset="100%" stopColor="#6d28d9" stopOpacity="0" /></linearGradient></defs>
                <path d="M0,80 L10,75 L20,60 L30,65 L40,40 L50,45 L60,20 L70,30 L80,15 L90,25 L100,5" fill="none" stroke="#5300b7" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <path d="M0,80 L10,75 L20,60 L30,65 L40,40 L50,45 L60,20 L70,30 L80,15 L90,25 L100,5 L100,100 L0,100 Z" fill="url(#chartGradient)" />
              </svg>
              <div className="absolute -bottom-6 left-0 w-full flex justify-between text-xs text-on-surface-variant px-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>
          </div>

          {/* AI Recommendations (Span 4) */}
          <div className="col-span-1 md:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-ambient hover-lift transition-all duration-300">
            <h2 className="text-lg font-headline font-bold text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>list_alt</span> AI Recommendations
            </h2>
            <div className="space-y-4">
              {[
                { title: 'Optimize Supply Chain', desc: 'Switch to regional suppliers to cut costs by 12%.', color: 'primary' },
                { title: 'Inventory Alert', desc: 'Electronics category stock is below 15% threshold.', color: 'secondary' },
                { title: 'Pricing Strategy', desc: 'Increase margins on raw materials by 2%.', color: 'surface-tint' },
              ].map((rec) => (
                <div key={rec.title} className={`p-3 rounded-lg bg-surface-container-low border-l-4 border-${rec.color} hover:bg-surface-container transition-colors cursor-pointer group`}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm text-on-surface">{rec.title}</h3>
                    <span className="material-symbols-outlined text-outline-variant text-sm">chevron_right</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-body">{rec.desc}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border border-outline rounded-lg text-primary font-medium text-sm hover:bg-surface-container-high transition-colors">View All Actions</button>
          </div>
        </div>
      )}

      {/* === Buyer Radar Tab === */}
      {activeTab === 'radar' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">target</span>
            <h2 className="text-lg font-semibold text-on-surface">Active Buyer Radar</h2>
            <span className="badge badge-primary text-xs ml-2">Live</span>
          </div>
          <BuyerRadarTable />
        </div>
      )}

      {/* === HS Code Tab === */}
      {activeTab === 'hs-code' && (
        <div className="max-w-2xl">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"><span className="material-symbols-outlined text-primary">smart_toy</span></div>
              <div>
                <h2 className="text-lg font-semibold text-on-surface">AI HS Code Classifier</h2>
                <p className="text-sm text-on-surface-variant">Enter a product description to classify</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Product Description *</label>
                <textarea value={hsInput.description} onChange={(e) => setHsInput({ ...hsInput, description: e.target.value })} className="input-field h-24 resize-none" placeholder="e.g. Fresh coconut oil, virgin, organic" />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Category (optional)</label>
                <input value={hsInput.category} onChange={(e) => setHsInput({ ...hsInput, category: e.target.value })} className="input-field" placeholder="e.g. Agriculture" />
              </div>
              <button onClick={classifyHSCode} disabled={!hsInput.description || hsLoading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {hsLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span className="material-symbols-outlined text-[18px]">smart_toy</span> Classify HS Code</>}
              </button>
            </div>
            {hsResult && (
              <div className="mt-6 p-5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl animate-slide-up">
                <div className="flex items-center gap-2 mb-3"><span className="material-symbols-outlined text-emerald-600">auto_awesome</span><h3 className="font-semibold text-emerald-800">Classification Result</h3></div>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="bg-white/70 rounded-lg p-3"><p className="text-xs text-emerald-600 mb-0.5">HS Code</p><p className="text-2xl font-bold text-emerald-800">{hsResult.hs_code}</p></div>
                  <div className="bg-white/70 rounded-lg p-3"><p className="text-xs text-emerald-600 mb-0.5">Confidence</p><p className="text-2xl font-bold text-emerald-800">{((hsResult.confidence || 0) * 100).toFixed(0)}%</p></div>
                </div>
                <p className="text-sm text-emerald-700"><strong>Description:</strong> {hsResult.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* === Optimizer Tab === */}
      {activeTab === 'optimizer' && (
        <div className="max-w-2xl">
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center"><span className="material-symbols-outlined text-secondary">bolt</span></div>
              <div>
                <h2 className="text-lg font-semibold text-on-surface">AI Listing Optimizer</h2>
                <p className="text-sm text-on-surface-variant">Analyze and improve product listings</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Product ID</label>
                <input value={optimizerInput.product_id} onChange={(e) => setOptimizerInput({ product_id: e.target.value })} className="input-field" placeholder="Product ID" />
              </div>
              <button onClick={optimizeListing} disabled={optimizerLoading} className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {optimizerLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span className="material-symbols-outlined text-[18px]">bolt</span> Analyze Listing</>}
              </button>
            </div>
            {optimizerResult && (
              <div className="mt-6 space-y-4 animate-slide-up">
                <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-primary-50 border border-blue-200 rounded-xl">
                  <div className="text-center"><p className="text-4xl font-bold text-secondary">{optimizerResult.score}</p><p className="text-xs text-secondary">Score</p></div>
                  <div className="flex-1">
                    <div className="progress-bar h-3"><div className="progress-bar-fill bg-secondary" style={{ width: `${optimizerResult.score}%` }} /></div>
                    <p className="text-xs text-on-surface-variant mt-1">{optimizerResult.score >= 80 ? 'Excellent!' : optimizerResult.score >= 60 ? 'Good, can improve' : 'Needs optimization'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* === Market Alerts Tab === */}
      {activeTab === 'alerts' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-emerald-500">trending_up</span>
            <h2 className="text-lg font-semibold text-on-surface">Market Opportunity Alerts</h2>
            <span className="badge badge-success text-xs ml-2">Real-time</span>
          </div>
          <MarketOpportunityAlerts />
        </div>
      )}

      {/* === Competitor Benchmark Tab === */}
      {activeTab === 'benchmark' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">monitoring</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-headline font-extrabold text-on-surface">Competitor Benchmarking</h2>
                    <p className="text-sm text-on-surface-variant font-body">Real-time global price comparison</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <input 
                    value={benchmarkQuery}
                    onChange={(e) => setBenchmarkQuery(e.target.value)}
                    className="input-field flex-1" 
                    placeholder="Enter product name (e.g. Zinc Die Casting)" 
                  />
                  <button 
                    onClick={fetchBenchmark}
                    disabled={benchmarkLoading || !benchmarkQuery}
                    className="btn-primary flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                  >
                    {benchmarkLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span className="material-symbols-outlined">analytics</span> Run Benchmark</>}
                  </button>
                </div>
              </div>
            </div>

            {benchmarkResult && (
              <div className="md:w-80 flex flex-col gap-4">
                <div className="bg-primary text-on-primary p-6 rounded-xl shadow-ambient">
                  <p className="text-xs opacity-80 uppercase tracking-widest font-bold mb-1">Market Average</p>
                  <p className="text-3xl font-extrabold">${benchmarkResult.avgPrice.toFixed(2)}</p>
                </div>
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant/50 flex justify-between">
                  <div>
                    <p className="text-xs text-on-surface-variant font-medium">Lowest</p>
                    <p className="text-xl font-bold text-emerald-600">${benchmarkResult.minPrice.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-on-surface-variant font-medium">Highest</p>
                    <p className="text-xl font-bold text-red-600">${benchmarkResult.maxPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {benchmarkResult && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="card">
                <h3 className="font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">bar_chart</span> Price Distribution
                </h3>
                <div className="h-64 flex items-end gap-2 px-4">
                  {benchmarkResult.prices.map((p: any, i: number) => (
                    <div key={i} className="flex-1 flex flex-col items-center group">
                      <div className="w-full bg-primary/20 rounded-t-lg transition-all group-hover:bg-primary/40 relative" style={{ height: `${(p.price / benchmarkResult.maxPrice) * 100}%` }}>
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-high text-on-surface text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition shadow-sm font-bold">${p.price.toFixed(0)}</div>
                      </div>
                      <p className="text-[10px] text-on-surface-variant mt-2 font-medium">{p.source}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card">
                <h3 className="font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">public</span> Regional Pricing
                </h3>
                <div className="space-y-4">
                  {benchmarkResult.prices.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-surface-variant/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface flex items-center justify-center text-xs font-bold text-on-surface-variant">{p.region[0]}</div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">{p.region}</p>
                          <p className="text-xs text-on-surface-variant">{p.source}</p>
                        </div>
                      </div>
                      <p className="font-bold text-primary">${p.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
