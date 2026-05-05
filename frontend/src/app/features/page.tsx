import React from 'react';
import Link from 'next/link';
import { Target, TrendingUp, Search, Zap, Shield, Globe } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      title: 'AI Lead Scoring',
      description: 'Know which buyers are most likely to convert with our 0-100 Buy Score based on actual import data.',
      icon: <Target className="w-8 h-8 text-primary-700" />,
      color: 'bg-primary-100'
    },
    {
      title: 'Buyer Radar',
      description: 'Access verified buyer database with import history from UN Comtrade and customs data.',
      icon: <Search className="w-8 h-8 text-accent-600" />,
      color: 'bg-accent-100'
    },
    {
      title: 'Market Alerts',
      description: 'Get notified when buyers in your target countries are actively searching for your products.',
      icon: <Globe className="w-8 h-8 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: 'Instant Intelligence',
      description: 'AI-driven insights that help you understand market trends and buyer behavior in real-time.',
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      color: 'bg-yellow-100'
    },
    {
      title: 'Secure Transactions',
      description: 'End-to-end encryption for your documents and communication with potential buyers.',
      icon: <Shield className="w-8 h-8 text-red-600" />,
      color: 'bg-red-100'
    },
    {
      title: 'Growth Analytics',
      description: 'Track your performance, inquiry conversion rates, and overall business growth.',
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      color: 'bg-purple-100'
    }
  ];

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
            <Link href="/features" className="text-primary-700 font-semibold transition">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-primary-700 transition">
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
            Powerful Features for <span className="text-primary-700">Global Trade</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how Grawizah uses AI to streamline your export business, connect you with the right buyers, and close deals faster.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
              <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-900 py-16 text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Ready to scale your global trade?</h2>
          <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
            Join thousands of suppliers using Grawizah to connect with verified buyers worldwide.
          </p>
          <Link href="/register" className="bg-white text-primary-900 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-colors inline-block">
            Start For Free Today
          </Link>
        </div>
      </section>
    </div>
  );
}
