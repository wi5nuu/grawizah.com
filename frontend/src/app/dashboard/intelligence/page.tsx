'use client';

import { useState } from 'react';
import { Brain, Bot, Target, Crown, Zap, Bell, Languages } from 'lucide-react';
import BuyerRadarTable from '@/components/BuyerRadarTable';
import { MarketOpportunityAlerts } from '@/components/MarketOpportunityAlerts';

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<'radar' | 'hs-code' | 'optimizer' | 'alerts' | 'translator'>('radar');
  const [hsInput, setHsInput] = useState({ description: '', category: '' });
  const [hsResult, setHsResult] = useState<any>(null);
  const [hsLoading, setHsLoading] = useState(false);
  const [optimizerInput, setOptimizerInput] = useState({ product_id: '1', current_description: '', product_name: '' });
  const [optimizerResult, setOptimizerResult] = useState<any>(null);
  const [optimizerLoading, setOptimizerLoading] = useState(false);
  // Translator state
  const [transText, setTransText] = useState('');
  const [transSource, setTransSource] = useState('');
  const [transTarget, setTransTarget] = useState('en');
  const [transResult, setTransResult] = useState<any>(null);
  const [transLoading, setTransLoading] = useState(false);
  const [detectResult, setDetectResult] = useState<any>(null);

  const classifyHSCode = async () => {
    setHsLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/ai/hs-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hsInput),
      });
      const data = await res.json();
      setHsResult(data.data || data);
    } catch (err) {
      console.error(err);
    } finally {
      setHsLoading(false);
    }
  };

  const optimizeListing = async () => {
    setOptimizerLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/ai/optimize-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: optimizerInput.product_id }),
      });
      const data = await res.json();
      setOptimizerResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizerLoading(false);
    }
  };

  const translateText = async () => {
    setTransLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transText, sourceLang: transSource, targetLang: transTarget }),
      });
      const data = await res.json();
      setTransResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTransLoading(false);
    }
  };

  const detectLanguage = async () => {
    if (!transText) return;
    try {
      const res = await fetch('http://localhost:8080/api/ai/detect-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transText }),
      });
      const data = await res.json();
      setDetectResult(data);
      if (data.language) setTransSource(data.language);
    } catch (err) {
      console.error(err);
    }
  };

  const LANGUAGES = [
    { code: 'en', name: 'English' }, { code: 'id', name: 'Indonesian' },
    { code: 'zh', name: 'Chinese' }, { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' }, { code: 'ar', name: 'Arabic' },
    { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' }, { code: 'pt', name: 'Portuguese' },
    { code: 'hi', name: 'Hindi' }, { code: 'th', name: 'Thai' },
    { code: 'vi', name: 'Vietnamese' }, { code: 'ms', name: 'Malay' },
  ];

  const tabs = [
    { id: 'radar' as const, icon: Target, label: 'Buyer Radar' },
    { id: 'hs-code' as const, icon: Bot, label: 'HS Code Classifier' },
    { id: 'optimizer' as const, icon: Zap, label: 'Listing Optimizer' },
    { id: 'alerts' as const, icon: Bell, label: 'Market Alerts' },
    { id: 'translator' as const, icon: Languages, label: 'AI Translator' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Premium Intelligence Hub
            <Crown className="w-5 h-5 text-amber-500" />
          </h1>
          <p className="text-gray-500">AI-powered tools for competitive advantages in global trade</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-3 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {/* === Buyer Radar Tab === */}
      {activeTab === 'radar' && <BuyerRadarTable />}

      {/* === HS Code Classifier Tab === */}
      {activeTab === 'hs-code' && (
        <div className="max-w-2xl">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary-700" /> AI HS Code Classifier
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter a product description to automatically classify the HS Code.
              Calls <code className="bg-gray-100 text-xs px-1 py-0.5 rounded">POST /api/ai/hs-code</code>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Description *</label>
                <textarea
                  value={hsInput.description}
                  onChange={(e) => setHsInput({...hsInput, description: e.target.value})}
                  className="input-field h-24 resize-none"
                  placeholder="e.g. Fresh coconut oil, virgin, organic, cold-pressed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category (optional)</label>
                <input value={hsInput.category} onChange={(e) => setHsInput({...hsInput, category: e.target.value})} className="input-field" placeholder="e.g. Agriculture" />
              </div>
              <button onClick={classifyHSCode} disabled={!hsInput.description || hsLoading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {hsLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Bot className="w-4 h-4" /> Classify HS Code</>}
              </button>
            </div>
            {hsResult && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-up">
                <h3 className="font-semibold text-green-800 mb-3">Classification Result</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-green-600">HS Code</p>
                    <p className="text-2xl font-bold text-green-800">{hsResult.hs_code}</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-600">Confidence</p>
                    <p className="text-2xl font-bold text-green-800">{((hsResult.confidence || 0) * 100).toFixed(0)}%</p>
                  </div>
                </div>
                <p className="text-sm text-green-700 mt-3"><strong>Description:</strong> {hsResult.description}</p>
                {hsResult.regulation_notes && (
                  <p className="text-sm text-green-700 mt-1"><strong>Regulation:</strong> {hsResult.regulation_notes}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* === Listing Optimizer Tab === */}
      {activeTab === 'optimizer' && (
        <div className="max-w-2xl">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-600" /> AI Listing Optimizer
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Analyze your product listing and get suggestions.
              Calls <code className="bg-gray-100 text-xs px-1 py-0.5 rounded">POST /api/ai/optimize-listing</code>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                <input value={optimizerInput.product_id} onChange={(e) => setOptimizerInput({...optimizerInput, product_id: e.target.value})} className="input-field" placeholder="Product ID" />
              </div>
              <button onClick={optimizeListing} disabled={optimizerLoading} className="btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {optimizerLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Zap className="w-4 h-4" /> Analyze Listing</>}
              </button>
            </div>
            {optimizerResult && (
              <div className="mt-6 space-y-4 animate-slide-up">
                <div className="flex items-center gap-4 p-4 bg-accent-50 border border-accent-200 rounded-xl">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-accent-700">{optimizerResult.score}</p>
                    <p className="text-xs text-accent-600">Score</p>
                  </div>
                  <div className="flex-1">
                    <div className="progress-bar h-3"><div className="progress-bar-fill bg-accent-500" style={{ width: `${optimizerResult.score}%` }} /></div>
                  </div>
                </div>
                {optimizerResult.suggestions && (
                  <div className="space-y-2">
                    {Object.entries(optimizerResult.suggestions).map(([key, value]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 capitalize">{key.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-gray-600">{Array.isArray(value) ? (value as string[]).join(', ') : String(value)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* === Market Opportunity Alerts Tab === */}
      {activeTab === 'alerts' && (
        <MarketOpportunityAlerts />
      )}

      {/* === AI Translator Tab === */}
      {activeTab === 'translator' && (
        <div className="max-w-2xl">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Languages className="w-5 h-5 text-primary-700" /> AI Translator
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Translate trade communications across 15+ languages.
              Calls <code className="bg-gray-100 text-xs px-1 py-0.5 rounded">POST /api/ai/translate</code> &amp; <code className="bg-gray-100 text-xs px-1 py-0.5 rounded">POST /api/ai/detect-language</code>
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text to translate *</label>
                <textarea
                  value={transText}
                  onChange={(e) => setTransText(e.target.value)}
                  className="input-field h-28 resize-none"
                  placeholder="Enter text to translate..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source Language</label>
                  <div className="flex gap-2">
                    <select value={transSource} onChange={(e) => setTransSource(e.target.value)} className="select-field flex-1">
                      <option value="">Auto-detect</option>
                      {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                    </select>
                    <button onClick={detectLanguage} disabled={!transText} className="btn-ghost btn-sm text-xs whitespace-nowrap disabled:opacity-50" title="Detect language">
                      Detect
                    </button>
                  </div>
                  {detectResult && (
                    <p className="text-xs text-green-600 mt-1">
                      Detected: <strong>{LANGUAGES.find(l => l.code === detectResult.language)?.name || detectResult.language}</strong> ({((detectResult.confidence || 0) * 100).toFixed(0)}%)
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Language *</label>
                  <select value={transTarget} onChange={(e) => setTransTarget(e.target.value)} className="select-field">
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={translateText} disabled={!transText || transLoading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {transLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Languages className="w-4 h-4" /> Translate</>}
              </button>
            </div>
            {transResult && (
              <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl animate-slide-up">
                <h3 className="font-semibold text-primary-800 mb-2">Translation Result</h3>
                <p className="text-gray-800 bg-white p-3 rounded-lg border border-primary-100 leading-relaxed">{transResult.translatedText}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-primary-600">
                  <span>From: {LANGUAGES.find(l => l.code === transResult.sourceLang)?.name || transResult.sourceLang || 'Auto'}</span>
                  <span>→</span>
                  <span>To: {LANGUAGES.find(l => l.code === transResult.targetLang)?.name || transResult.targetLang}</span>
                  <span>Confidence: {((transResult.confidence || 0) * 100).toFixed(0)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
