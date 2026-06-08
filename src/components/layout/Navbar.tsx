'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { cn, formatCoins } from '@/lib/ui';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/collection', label: 'Collection' },
  { href: '/modes', label: 'Challenges' },
];

export function Navbar() {
  const pathname = usePathname();
  const coins = useGameStore((s) => s.coins);
  const hydrated = useHydrated();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-pitch-dark/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
          <span className="text-emerald-400">⚽</span>
          <span>GAFFER</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((l) => {
            const active = l.href === '/' ? pathname === '/' : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors',
                  active ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/70 hover:bg-white/10'
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-yellow-400/10 px-3 py-1.5 text-sm font-bold text-yellow-300">
          <span>🪙</span>
          <span className="tabular-nums">{hydrated ? formatCoins(coins) : '—'}</span>
        </div>
      </nav>
    </header>
  );
}
