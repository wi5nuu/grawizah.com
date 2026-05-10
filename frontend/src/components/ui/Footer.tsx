'use client';

import Link from 'next/link';

export default function Footer() {
  const handleSubscribe = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing to Market Insights! Check your email for confirmation.');
  };

  return (
    <footer className="w-full relative overflow-hidden bg-surface-container-lowest dark:bg-[#0a0a0e] border-t border-surface-variant/20 dark:border-white/5 pt-20 pb-10">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-8 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-max">
              <img src="/images/android-chrome-192x192.png" alt="Grawizah Logo" className="w-10 h-10 object-contain" />
              <span className="text-3xl font-display font-extrabold text-[#5300b7] dark:text-dark-primary tracking-tight">Grawizah</span>
            </Link>
            <p className="font-body text-on-surface-variant dark:text-gray-400 max-w-sm text-sm leading-relaxed">
              Global trade intelligence platform for discovering, verifying, and connecting with trusted enterprise partners worldwide.
            </p>
            <div className="mt-2">
              <h4 className="font-bold text-on-surface dark:text-white mb-3 text-sm">Subscribe to Market Insights</h4>
              <form className="flex items-center w-full max-w-sm relative" onSubmit={(e) => { e.preventDefault(); handleSubscribe(e as any); }}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  required
                  className="w-full bg-surface-container-low dark:bg-white/5 border border-surface-variant/50 dark:border-white/10 rounded-xl py-3 pl-4 pr-32 text-sm text-on-surface dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-400"
                />
                <button type="submit" className="absolute right-1 top-1 bottom-1 bg-primary hover:bg-primary/90 text-white rounded-lg px-4 text-sm font-semibold transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Links 1 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-on-surface dark:text-white mb-2">Platform</h4>
            <Link href="/catalog" className="text-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">Supplier Catalog</Link>
            <Link href="/directory" className="text-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">Global Directory</Link>
            <Link href="/features" className="text-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">Intelligence Network</Link>
            <Link href="/pricing" className="text-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">Pricing</Link>
          </div>

          {/* Links 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-on-surface dark:text-white mb-2">Solutions</h4>
            <Link href="/info/solutions-for-buyers" className="text-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">For Buyers</Link>
            <Link href="/info/solutions-for-suppliers" className="text-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">For Suppliers</Link>
            <Link href="/info/trade-finance" className="text-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">Trade Finance</Link>
            <Link href="/info/api-access" className="text-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">API Access</Link>
          </div>

          {/* Links 3 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-on-surface dark:text-white mb-2">Company</h4>
            <Link href="/info/about-us" className="text-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">About Us</Link>
            <Link href="/info/careers" className="text-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">Careers</Link>
            <Link href="/info/contact" className="text-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">Contact</Link>
            <Link href="/info/blog" className="text-sm text-on-surface-variant dark:text-gray-400 hover:text-primary dark:hover:text-primary-400 transition-colors">Blog</Link>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-surface-variant/50 dark:via-white/10 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-body text-sm text-on-surface-variant dark:text-gray-500">
            © {new Date().getFullYear()} Grawizah Intelligence. All rights reserved.
          </span>
          <div className="flex flex-wrap justify-center gap-6 font-body text-sm">
            <Link href="/info/privacy-policy" className="text-on-surface-variant dark:text-gray-500 hover:text-primary dark:hover:text-primary-400 transition-colors">Privacy Policy</Link>
            <Link href="/info/terms-of-service" className="text-on-surface-variant dark:text-gray-500 hover:text-primary dark:hover:text-primary-400 transition-colors">Terms of Service</Link>
            <Link href="/info/cookie-policy" className="text-on-surface-variant dark:text-gray-500 hover:text-primary dark:hover:text-primary-400 transition-colors">Cookie Policy</Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Social Icons */}
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container-low dark:bg-white/5 flex items-center justify-center text-on-surface-variant dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all">
              <span className="material-symbols-outlined text-[20px]">public</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container-low dark:bg-white/5 flex items-center justify-center text-on-surface-variant dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all">
              <span className="material-symbols-outlined text-[20px]">share</span>
            </a>
            <a href="https://community.grawizah.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-surface-container-low dark:bg-white/5 flex items-center justify-center text-on-surface-variant dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all">
              <span className="material-symbols-outlined text-[20px]">forum</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
