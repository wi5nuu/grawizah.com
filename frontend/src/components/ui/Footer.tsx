'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-12 bg-surface-container-lowest border-t border-surface-variant/20">
      <div className="max-w-[1440px] mx-auto px-16 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-lg font-display font-bold text-primary">Grawizah</span>
          <span className="font-body text-sm text-on-surface-variant">© 2024 Grawizah Intelligence. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 font-body text-sm">
          <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors">Terms of Service</Link>
          <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors">Cookie Policy</Link>
          <Link href="#" className="text-on-surface-variant hover:text-secondary transition-colors">Global Trade Index</Link>
        </div>
      </div>
    </footer>
  );
}
