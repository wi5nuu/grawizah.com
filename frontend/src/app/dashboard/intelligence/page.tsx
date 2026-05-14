'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  Search,
  Activity,
  Zap,
  Bot,
  ArrowUpRight,
  Filter
} from 'lucide-react';

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState('market');

  return (
    <div className="p-6 md:p-10 w-full bg-[#fafafa] dark:bg-dark-background min-h-screen font-sans">
      
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">AI-Driven Analytics</span>
        </div>
        <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tight mb-2">Market <span className="text-primary">Intelligence.</span></h1>
        <p className="text-sm text-gray-500 font-medium max-w-xl">Deep-dive into global trade flows, competitor benchmarking, and predictive demand modeling.</p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
         <div className="flex-1 bg-white dark:bg-dark-surface-container-low rounded-2xl border border-gray-100 dark:border-dark-surface-variant/20 p-2 flex items-center shadow-sm">
            <Search className="w-4 h-4 text-gray-400 mx-4" />
            <input type="text" placeholder="Query HS-Code or Market Jurisdictions..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-semibold outline-none py-2" />
         </div>
         <div className="flex gap-2">
            <button className="px-6 py-2 bg-white dark:bg-dark-surface-container-low border border-gray-100 dark:border-dark-surface-variant/20 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm">
               <Filter className="w-4 h-4" /> Filters
            </button>
            <button className="px-6 py-2 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
               Run AI Audit
            </button>
         </div>
      </div>

      {/* Intelligence Tabs */}
      <div className="flex gap-8 border-b border-gray-100 dark:border-dark-surface-variant/20 mb-10 overflow-x-auto whitespace-nowrap scrollbar-hide">
         {[
           { id: 'market', label: 'Market Demand', icon: TrendingUp },
           { id: 'competitor', label: 'Competitor Analysis', icon: Activity },
           { id: 'logistics', label: 'Logistics Optimization', icon: Globe },
           { id: 'risk', label: 'Risk Assessment', icon: ShieldCheck }
         ].map((tab) => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`pb-4 text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all relative ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <tab.icon className="w-4 h-4" />
             {tab.label}
             {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-scale-x" />}
           </button>
         ))}
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         
         {/* Main Chart Section */}
         <div className="xl:col-span-2 bg-white dark:bg-dark-surface-container-low rounded-[2.5rem] border border-gray-100 dark:border-dark-surface-variant/20 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">Price Volatility Index</h3>
                  <p className="text-xs text-gray-400 mt-1">HS Code: 8517.62 (IoT Gateways)</p>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black">
                  <TrendingUp className="w-3 h-3" /> +12.4% Global Demand
               </div>
            </div>
            
            {/* Mock Chart Area */}
            <div className="h-[300px] w-full bg-gray-50/50 dark:bg-dark-surface-container/20 rounded-3xl border border-dashed border-gray-200 dark:border-dark-surface-variant/10 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
               </div>
               <Activity className="w-16 h-16 text-primary opacity-20" />
               <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between gap-4 h-1/2">
                  {[40, 70, 45, 90, 65, 80, 55, 95, 75, 85].map((h, i) => (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-lg relative group transition-all hover:bg-primary/40 cursor-pointer" style={{ height: `${h}%` }}>
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Val: {h}%</div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar Insights */}
         <div className="space-y-8">
            <div className="bg-primary text-white rounded-[2.5rem] p-8 shadow-xl shadow-primary/20">
               <Zap className="w-8 h-8 mb-6" />
               <h3 className="text-xl font-display font-bold mb-2 tracking-tight text-white">Instant AI Takeaway</h3>
               <p className="text-sm text-white/80 leading-relaxed mb-6 font-medium">Global supply for semiconductors is stabilizing. Recommend increasing stock by 15% before Q4 price surge.</p>
               <button className="w-full py-3 bg-white text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-opacity-90 transition-all">Download Report</button>
            </div>

            <div className="bg-white dark:bg-dark-surface-container-low rounded-[2.5rem] border border-gray-100 dark:border-dark-surface-variant/20 p-8 shadow-sm">
               <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">Competitor Snapshot</h3>
               <div className="space-y-4">
                  {[
                    { name: 'Nexus Precision', score: '99.2', trend: 'up' },
                    { name: 'SteelCraft Ind.', score: '98.5', trend: 'stable' },
                    { name: 'TechFlow AG', score: '94.0', trend: 'down' }
                  ].map((comp, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-dark-surface-container border border-gray-100 dark:border-dark-surface-variant/10">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-dark-surface flex items-center justify-center text-xs font-black text-primary border border-gray-100 dark:border-dark-surface-variant/10">{comp.name[0]}</div>
                          <span className="text-[11px] font-black text-gray-900 dark:text-white">{comp.name}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-primary">{comp.score}</span>
                          <ArrowUpRight className={`w-3 h-3 ${comp.trend === 'up' ? 'text-emerald-500' : comp.trend === 'down' ? 'text-red-500' : 'text-gray-400'}`} />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

      </div>

    </div>
  );
}
