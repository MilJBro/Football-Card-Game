import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Golden XI',
  description:
    'Build a squad from World Cup legends, guide them through the tournament, and lift the trophy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pb-24 pt-6">{children}</main>
      </body>
    </html>
  );
}
