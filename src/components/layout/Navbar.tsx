'use client';

import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-[60] border-b border-white/10 bg-[#38003C]/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight">
          <span className="text-lg text-[#00FF85]">⚽</span>
          <span className="text-white text-lg">Premier <span className="text-[#00FF85]">XI</span></span>
        </Link>
      </nav>
    </header>
  );
}
