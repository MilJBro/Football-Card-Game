'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-pitch-dark/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
          <span className="text-emerald-400">⚽</span>
          <span className="hidden text-white sm:block">Footy Pack Challenge</span>
        </Link>
      </nav>
    </header>
  );
}
