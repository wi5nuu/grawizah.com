'use client';

import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ArrowRight, Search, Target, TrendingUp, Shield, Zap, BarChart3, MessageSquare, Globe, Bot, Award } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 badge-primary mb-6 text-sm">
              <Zap className="w-4 h-4" />
              AI-Powered B2B Trade Intelligence
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
              Pre-Transaction
              <span className="block gradient-text mt-1">Intelligence</span>
              <span className="block text-4xl md:text-5xl font-bold text-gray-600 mt-2">for Global Trade</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with verified buyers worldwide. AI-powered insights help you discover opportunities, qualify leads, and close deals — before negotiations even start.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-primary flex items-center text-lg px-8 py-4">
                Start Free <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/catalog" className="btn-outline text-lg px-8 py-4">
                Browse Catalog
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Verified Buyers' },
              { value: '50+', label: 'Countries' },
              { value: '95%', label: 'AI Accuracy' },
              { value: '2x', label: 'Faster Deal Closure' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-extrabold gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">Three simple steps to unlock global trade intelligence</p>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: Search, color: 'primary', title: '1. Buyer Discovery', desc: 'Buyers discover your products through our AI-ranked catalog based on relevance and quality score.' },
            { icon: Target, color: 'accent', title: '2. AI-Qualified Match', desc: 'Our AI scores buyer quality and conversion probability in real-time using import data analytics.' },
            { icon: TrendingUp, color: 'green', title: '3. Close Deals', desc: 'Track inquiries, get AI-powered response suggestions, and convert leads into deals faster.' },
          ].map((item, i) => (
            <div key={i} className="text-center group">
              <div className={`w-16 h-16 bg-${item.color === 'primary' ? 'primary-100' : item.color === 'accent' ? 'accent-100' : 'green-100'} rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform group-hover:scale-110`}>
                <item.icon className={`w-8 h-8 ${item.color === 'primary' ? 'text-primary-700' : item.color === 'accent' ? 'text-accent-600' : 'text-green-600'}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">AI-Powered Intelligence</h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">Leverage cutting-edge AI to gain competitive advantages in global trade</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Bot, title: 'AI Lead Scoring', desc: 'Know which buyers are most likely to convert with our 0-100 Buy Score based on actual import data from UN Comtrade.' },
              { icon: Globe, title: 'Buyer Radar', desc: 'Access a verified buyer database with import history, volume trends, and real-time market signals.' },
              { icon: BarChart3, title: 'Market Alerts', desc: 'Get notified when buyers in your target countries are actively searching for your specific product categories.' },
              { icon: MessageSquare, title: 'Smart Responses', desc: 'AI generates culturally-aware, professional response suggestions tailored to each buyer\'s language and market.' },
              { icon: Shield, title: 'HS Code Classifier', desc: 'Instantly classify your products with 95%+ accuracy. Get regulation notes and compliance alerts automatically.' },
              { icon: Award, title: 'Leaderboard', desc: 'Benchmark your performance against competitors with transparent scoring across conversion, response, and fulfillment.' },
            ].map((item, i) => (
              <div key={i} className="card-hover group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-accent-100 rounded-xl flex items-center justify-center mb-4 group-hover:from-primary-200 group-hover:to-accent-200 transition-all">
                  <item.icon className="w-6 h-6 text-primary-700" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Choose Your Plan</h2>
        <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">Start free and upgrade as you grow</p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card border-2 border-gray-200 hover:border-gray-300 transition-all">
            <h3 className="text-2xl font-bold mb-1">Basic Intelligence</h3>
            <p className="text-4xl font-extrabold gradient-text mb-6">Free</p>
            <ul className="space-y-3 mb-8">
              {['AI-Ranked Product Catalog', 'In-App Chat & WhatsApp Bridge', 'AI HS Code Classifier (3x/day)', 'AI Listing Optimizer', 'Basic Inquiry Analytics'].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="btn-outline w-full text-center block">Get Started</Link>
          </div>
          <div className="card border-2 border-primary-500 relative shadow-lg shadow-primary-100">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="badge-primary px-4 py-1.5 text-sm font-semibold shadow-md">Most Popular</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">Premium Intelligence</h3>
            <p className="text-4xl font-extrabold gradient-text mb-6">Contact Sales</p>
            <ul className="space-y-3 mb-8">
              {['Everything in Basic', 'Full Buyer Radar + AI Lead Scoring', 'Competitor Benchmarking', 'Unlimited AI HS Code', 'AI Response Suggestion', 'Market Opportunity Alerts', 'Buyer Quality Score', 'Premium Badge'].map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/register" className="btn-primary w-full text-center block">Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-bg py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Win Global Trade?</h2>
          <p className="text-primary-100 mb-8 max-w-lg mx-auto">Join thousands of exporters who use Grawizah to discover, qualify, and connect with verified international buyers.</p>
          <Link href="/register" className="inline-flex items-center bg-white text-primary-700 font-bold px-8 py-4 rounded-lg hover:bg-primary-50 transition-all shadow-xl">
            Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
