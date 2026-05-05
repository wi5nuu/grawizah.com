import Link from 'next/link';
import { ArrowRight, Search, Target, TrendingUp } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-accent-500 rounded-lg"></div>
            <span className="text-2xl font-bold text-primary-700">Grawizah</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/catalog" className="text-gray-700 hover:text-primary-700 transition">
              Catalog
            </Link>
            <Link href="/features" className="text-gray-700 hover:text-primary-700 transition">
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
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Pre-Transaction Intelligence
            <span className="block text-primary-700 mt-2">for Global Trade</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with verified buyers worldwide. AI-powered insights to help you win deals before negotiations even start.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary flex items-center">
              Start Free <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/catalog" className="btn-outline">
              Browse Catalog
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Free forever plan available
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Buyer Search</h3>
            <p className="text-gray-600">
              Buyers discover suppliers through AI-ranked catalog based on relevance and quality
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-accent-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">2. AI-Qualified Match</h3>
            <p className="text-gray-600">
              Our AI scores buyer quality and conversion probability in real-time
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Inquiry & Deal</h3>
            <p className="text-gray-600">
              Track inquiries, get AI response suggestions, and close deals faster
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">AI-Powered Intelligence</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-semibold mb-3 text-primary-700">AI Lead Scoring</h3>
              <p className="text-gray-600">
                Know which buyers are most likely to convert with our 0-100 Buy Score based on actual import data
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-3 text-primary-700">Buyer Radar</h3>
              <p className="text-gray-600">
                Access verified buyer database with import history from UN Comtrade and customs data
              </p>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-3 text-primary-700">Market Alerts</h3>
              <p className="text-gray-600">
                Get notified when buyers in your target countries are actively searching for your products
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tier Comparison */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="card border-2 border-gray-300">
            <h3 className="text-2xl font-bold mb-2">Basic Intelligence</h3>
            <p className="text-4xl font-bold text-primary-700 mb-4">Free</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>AI-Ranked Product Catalog</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>In-App Chat & WhatsApp Bridge</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>AI HS Code Classifier (3x/day)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Basic Inquiry Analytics</span>
              </li>
            </ul>
            <Link href="/register" className="btn-outline w-full text-center block">
              Get Started
            </Link>
          </div>
          <div className="card border-2 border-primary-700 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="badge badge-primary">Most Popular</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Premium Intelligence</h3>
            <p className="text-4xl font-bold text-primary-700 mb-4">Contact Sales</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Everything in Basic</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Full Buyer Radar + AI Lead Scoring</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Competitor Benchmarking</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Unlimited AI HS Code</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>AI Response Suggestion</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Market Opportunity Alerts</span>
              </li>
            </ul>
            <Link href="/contact" className="btn-primary w-full text-center block">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-700 to-accent-500 rounded-lg"></div>
                <span className="text-xl font-bold">Grawizah</span>
              </div>
              <p className="text-gray-400 text-sm">
                Secure, Fast, & Intelligent Global Trade
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/catalog">Catalog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Grawizah Intelligence Hub. All rights reserved.</p>
            <p className="mt-2">grawizah.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
