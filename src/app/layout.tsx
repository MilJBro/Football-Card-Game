import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Gaffer — Premier League Card Game',
  description:
    'Collect Premier League legends across their careers, build a squad, and simulate a season.',
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
