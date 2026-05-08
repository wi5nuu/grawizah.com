import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grawizah - Pre-Transaction Intelligence Platform',
  description: 'Secure, Fast, & Intelligent Global Trade. Connect with verified buyers worldwide through AI-powered insights.',
  keywords: ['B2B', 'Export', 'Import', 'Trade', 'AI', 'Intelligence', 'Buyer Radar', 'HS Code'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
