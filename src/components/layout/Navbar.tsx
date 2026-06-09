'use client';

import Link from 'next/link';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCoins } from '@/lib/ui';

export function Navbar() {
  const coins = useGameStore((s) => s.coins);
  const hydrated = useHydrated();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-pitch-dark/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
          <span className="text-emerald-400">⚽</span>
        </Link>

        <div className="flex items-center gap-1.5 rounded-full bg-yellow-400/10 px-3 py-1.5 text-sm font-bold text-yellow-300">
          <span>🪙</span>
          <span className="tabular-nums">{hydrated ? formatCoins(coins) : '—'}</span>
        </div>
      </nav>
    </header>
  );
}
