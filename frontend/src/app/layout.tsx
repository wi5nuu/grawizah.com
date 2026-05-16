import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Grawizah - Pre-Transaction Intelligence Platform',
  description: 'Secure, Fast, & Intelligent Global Trade. Connect with verified buyers worldwide through AI-powered insights.',
  keywords: ['B2B', 'Export', 'Import', 'Trade', 'AI', 'Intelligence', 'Buyer Radar', 'HS Code'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
