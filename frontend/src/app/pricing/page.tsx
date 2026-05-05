import React from 'react';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-accent-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-primary-700">Grawizah</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/catalog" className="text-gray-700 hover:text-primary-700 transition">
              Catalog
            </Link>
            <Link href="/features" className="text-gray-700 hover:text-primary-700 transition">
              Features
            </Link>
            <Link href="/pricing" className="text-primary-700 font-semibold transition">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-primary-700 transition">
              Login
            </Link>
            <Link href="/register" className="btn-primary">
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent <span className="text-primary-700">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the intelligence plan that fits your business needs. Upgrade anytime as your global trade operations scale.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="card border-2 border-gray-200 hover:border-primary-300 transition-colors">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Intelligence</h3>
            <p className="text-gray-500 mb-6">Perfect for new exporters</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-gray-900">$0</span>
              <span className="text-gray-500">/forever</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-3 text-xl">✓</span> AI-Ranked Product Catalog
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-3 text-xl">✓</span> In-App Chat & WhatsApp Bridge
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-3 text-xl">✓</span> AI HS Code Classifier (3x/day)
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-3 text-xl">✓</span> Basic Inquiry Analytics
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-3 text-xl">✓</span> AI Listing Optimizer
              </li>
            </ul>
            <Link href="/register" className="btn-outline w-full block text-center">
              Start Free Trial
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="card border-2 border-primary-700 relative shadow-xl">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-primary-700 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                Recommended
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Intelligence</h3>
            <p className="text-gray-500 mb-6">For established global traders</p>
            <div className="mb-8">
              <span className="text-5xl font-bold text-gray-900">Custom</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-700 font-medium">
                <span className="text-green-500 mr-3 text-xl">✓</span> Everything in Basic, plus:
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-3 text-xl">✓</span> Full Buyer Radar + AI Lead Scoring
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-3 text-xl">✓</span> Competitor Benchmarking
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-3 text-xl">✓</span> Unlimited AI HS Code
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-3 text-xl">✓</span> AI Response Suggestion
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-green-500 mr-3 text-xl">✓</span> Market Opportunity Alerts
              </li>
            </ul>
            <Link href="/contact" className="btn-primary w-full block text-center">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
