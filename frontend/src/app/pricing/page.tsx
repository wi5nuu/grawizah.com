'use client';

import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: 'Basic Intelligence',
    price: 'Free',
    priceDetail: 'Forever',
    cta: 'Get Started',
    ctaHref: '/register',
    featured: false,
    features: {
      'AI-Ranked Product Catalog': true,
      'In-App Chat & WhatsApp Bridge': true,
      'AI HS Code Classifier': '3x/day',
      'AI Listing Optimizer': true,
      'Basic Inquiry Analytics': true,
      'Full Buyer Radar': false,
      'AI Lead Scoring': false,
      'Competitor Benchmarking': false,
      'Unlimited AI HS Code': false,
      'AI Response Suggestion': false,
      'Market Opportunity Alerts': false,
      'Buyer Quality Score': false,
      'Premium Badge': false,
    },
  },
  {
    name: 'Premium Intelligence',
    price: 'Contact Sales',
    priceDetail: 'Custom pricing',
    cta: 'Contact Sales',
    ctaHref: '/register',
    featured: true,
    features: {
      'AI-Ranked Product Catalog': true,
      'In-App Chat & WhatsApp Bridge': true,
      'AI HS Code Classifier': 'Unlimited',
      'AI Listing Optimizer': true,
      'Basic Inquiry Analytics': true,
      'Full Buyer Radar': true,
      'AI Lead Scoring': true,
      'Competitor Benchmarking': true,
      'Unlimited AI HS Code': true,
      'AI Response Suggestion': true,
      'Market Opportunity Alerts': true,
      'Buyer Quality Score': true,
      'Premium Badge': true,
    },
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-lg text-gray-500">Start free and upgrade when you need more power. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 transition-all ${
                plan.featured
                  ? 'border-2 border-primary-500 shadow-xl shadow-primary-100 relative'
                  : 'border-2 border-gray-200'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="badge-primary px-4 py-1.5 text-sm font-semibold shadow-md">Recommended</span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-4xl font-extrabold gradient-text mb-1">{plan.price}</p>
              <p className="text-sm text-gray-500 mb-8">{plan.priceDetail}</p>

              <ul className="space-y-3 mb-8">
                {Object.entries(plan.features).map(([feature, value]) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    {value ? (
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    )}
                    <span className={value ? 'text-gray-700' : 'text-gray-400'}>
                      {feature}
                      {typeof value === 'string' && <span className="ml-1 text-xs badge-primary">{value}</span>}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref}
                className={`w-full text-center block py-3 rounded-lg font-semibold transition-all ${
                  plan.featured ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          {[
            { q: 'Can I start for free?', a: 'Yes! The Basic Intelligence plan is free forever with core features including AI HS Code classification, product catalog, and inquiry management.' },
            { q: 'What payment methods do you accept?', a: 'For Premium plans, we accept bank transfer, credit card, and PayPal. Contact our sales team for enterprise billing.' },
            { q: 'Can I upgrade or downgrade anytime?', a: 'Absolutely. You can upgrade to Premium anytime, and your data will be preserved if you switch plans.' },
            { q: 'Is there a free trial for Premium?', a: 'Yes, we offer a 14-day free trial for Premium Intelligence. No credit card required to start.' },
          ].map((faq, i) => (
            <div key={i} className="border-b border-gray-100 py-5">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
