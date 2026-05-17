'use client';

import { ShieldCheck, Zap, Lock } from 'lucide-react';
import Link from 'next/link';

interface UpgradePromptProps {
  featureName: string;
}

export default function UpgradePrompt({ featureName }: UpgradePromptProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
        <Lock className="w-10 h-10 text-primary absolute -top-2 -right-2 bg-white rounded-full p-1 border border-primary/20" />
        <Zap className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white tracking-tight mb-4">
        Premium Intelligence Required
      </h2>
      <p className="text-gray-500 dark:text-gray-400 font-medium max-w-md mb-8">
        Access to <strong className="text-gray-900 dark:text-white">{featureName}</strong> is restricted to Professional and Enterprise nodes. Upgrade your clearance to unlock this capability.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link 
          href="/pricing"
          className="px-8 py-3.5 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" /> Review Security Clearance
        </Link>
        <Link 
          href="/dashboard"
          className="px-8 py-3.5 bg-white dark:bg-dark-surface-container-low text-gray-900 dark:text-white border border-gray-200 dark:border-dark-surface-variant/20 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center"
        >
          Return to Hub
        </Link>
      </div>
    </div>
  );
}
