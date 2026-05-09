'use client';

import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    desc: 'For individual traders exploring the platform.',
    icon: 'rocket_launch',
    features: ['5 Product Listings', 'Basic Search', 'Email Support', 'Market Overview'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$49',
    period: '/month',
    desc: 'For growing businesses that need deeper intelligence.',
    icon: 'workspace_premium',
    features: ['50 Product Listings', 'AI HS Code Classifier', 'Buyer Radar (Limited)', 'Priority Support', 'Market Alerts'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$199',
    period: '/month',
    desc: 'Full platform access for large-scale global operations.',
    icon: 'diamond',
    features: ['Unlimited Listings', 'Full AI Intelligence Suite', 'Unlimited Buyer Radar', 'Dedicated Account Manager', 'API Access', 'Custom Integrations'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-background">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        {/* Hero */}
        <section className="text-center max-w-[1440px] mx-auto px-8 pt-16 pb-20">
          <h1 className="text-5xl md:text-6xl font-display font-extrabold text-on-background mb-6 tracking-tight">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-2xl mx-auto font-body leading-relaxed">
            Choose the plan that fits your global trade operations. Scale up as your business grows.
          </p>
        </section>

        {/* Plans Grid */}
        <section className="max-w-[1200px] mx-auto px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-2 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-primary to-secondary text-on-primary shadow-lg scale-105'
                    : 'bg-surface-container-lowest border border-surface-variant shadow-ambient'
                }`}
                style={plan.popular ? { boxShadow: '0 16px 48px rgba(83,0,183,0.3)' } : {}}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-surface-container-lowest text-primary rounded-full text-xs font-bold shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <span className={`material-symbols-outlined text-2xl ${plan.popular ? 'text-primary-fixed' : 'text-primary'}`}>{plan.icon}</span>
                  <h3 className={`text-xl font-display font-bold ${plan.popular ? '' : 'text-on-surface'}`}>{plan.name}</h3>
                </div>

                <div className="mb-4">
                  <span className={`text-4xl font-display font-extrabold ${plan.popular ? '' : 'text-on-surface'}`}>{plan.price}</span>
                  {plan.period && <span className={`text-lg ${plan.popular ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}`}>{plan.period}</span>}
                </div>
                <p className={`text-sm mb-8 ${plan.popular ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}`}>{plan.desc}</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <span className={`material-symbols-outlined text-[18px] ${plan.popular ? 'text-primary-fixed' : 'text-secondary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`w-full py-3 rounded-xl font-bold text-center block transition-all ${
                    plan.popular
                      ? 'bg-surface-container-lowest text-primary hover:bg-surface shadow-lg'
                      : 'bg-primary text-on-primary hover:opacity-90'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-[800px] mx-auto px-8 pb-24">
          <h2 className="text-3xl font-display font-bold text-center text-on-surface mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'Can I switch plans at any time?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we prorate billing accordingly.' },
              { q: 'Is there a free trial for paid plans?', a: 'Yes! The Professional plan comes with a 14-day free trial. No credit card required to start.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, bank transfers, and PayPal for international customers.' },
            ].map((faq) => (
              <details key={faq.q} className="group bg-surface-container-lowest border border-surface-variant rounded-xl p-6 cursor-pointer shadow-sm hover:shadow-ambient transition-shadow">
                <summary className="flex items-center justify-between font-semibold text-on-surface list-none">
                  {faq.q}
                  <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <p className="mt-4 text-on-surface-variant text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
