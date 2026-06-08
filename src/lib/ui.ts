import type { Tier } from '@/store/types';

/** Concatenate class names, dropping falsy values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const TIER_STYLES: Record<
  Tier,
  { glow: string; border: string; text: string; ring: string; gradient: string }
> = {
  Rising: {
    glow: 'shadow-glow-rising',
    border: 'border-tier-rising',
    text: 'text-tier-rising',
    ring: 'ring-tier-rising',
    gradient: 'from-amber-800/40 to-amber-950/40',
  },
  Star: {
    glow: 'shadow-glow-star',
    border: 'border-tier-star',
    text: 'text-tier-star',
    ring: 'ring-tier-star',
    gradient: 'from-slate-400/30 to-slate-700/40',
  },
  Legend: {
    glow: 'shadow-glow-legend',
    border: 'border-tier-legend',
    text: 'text-tier-legend',
    ring: 'ring-tier-legend',
    gradient: 'from-yellow-500/40 to-amber-900/40',
  },
};

export function formatCoins(n: number): string {
  return n.toLocaleString('en-GB');
}
