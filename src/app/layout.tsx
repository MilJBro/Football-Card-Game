import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Premier XI',
  description: 'Pick your Premier League club and build your all-time best XI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pt-4 pb-6">{children}</main>
      </body>
    </html>
  );
}
