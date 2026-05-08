import Link from 'next/link';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">Grawizah</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pre-Transaction Intelligence & Deal Orchestration Platform for global B2B trade.
            </p>
            <p className="text-gray-500 text-xs mt-4">
              Secure, Fast, & Intelligent Global Trade
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/features" className="hover:text-white transition">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition">Catalog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="#" className="hover:text-white transition">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition">PDPA Compliance</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; 2026 Grawizah Intelligence Hub. All rights reserved.</p>
          <p className="mt-2 md:mt-0">grawizah.com</p>
        </div>
      </div>
    </footer>
  );
}
