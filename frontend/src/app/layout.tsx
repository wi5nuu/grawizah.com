import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grawizah - Pre-Transaction Intelligence Platform',
  description: 'Secure, Fast, & Intelligent Global Trade',
  keywords: ['B2B', 'Export', 'Import', 'Trade', 'AI', 'Intelligence'],
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
