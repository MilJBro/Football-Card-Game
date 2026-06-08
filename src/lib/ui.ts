import type { Tier, PackCategory } from '@/store/types';

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

/** Surname only — used on compact pitch tokens. */
export function lastName(fullName: string): string {
  const parts = fullName.trim().split(' ');
  return parts[parts.length - 1];
}

/** Position/pack-based card background, border, ring, and position badge colours. */
export const PACK_STYLES: Record<
  PackCategory,
  { bg: string; border: string; ring: string; posBadge: string }
> = {
  GK: {
    bg: 'bg-gradient-to-b from-green-900 to-green-950',
    border: 'border-green-500',
    ring: 'ring-green-400',
    posBadge: 'bg-green-600',
  },
  DEF: {
    bg: 'bg-gradient-to-b from-amber-800/90 to-amber-950',
    border: 'border-amber-500',
    ring: 'ring-amber-400',
    posBadge: 'bg-amber-600',
  },
  MID: {
    bg: 'bg-gradient-to-b from-blue-900 to-blue-950',
    border: 'border-blue-500',
    ring: 'ring-blue-400',
    posBadge: 'bg-blue-700',
  },
  ATT: {
    bg: 'bg-gradient-to-b from-red-900 to-red-950',
    border: 'border-red-600',
    ring: 'ring-red-500',
    posBadge: 'bg-red-700',
  },
};

/** Tier badge Tailwind classes (background + text). */
export const TIER_BADGE: Record<Tier, string> = {
  Rising: 'bg-amber-700/90 text-amber-100',
  Star: 'bg-slate-300/90 text-slate-900',
  Legend: 'bg-yellow-400/95 text-yellow-950',
};

/** Diagonal stripe overlay for tier. null = no stripes (Rising). */
export const TIER_STRIPE_BG: Record<Tier, string | null> = {
  Rising: null,
  Star: 'repeating-linear-gradient(135deg,rgba(200,210,230,0.09) 0px,rgba(200,210,230,0.09) 2px,transparent 2px,transparent 14px)',
  Legend:
    'repeating-linear-gradient(135deg,rgba(255,210,0,0.18) 0px,rgba(255,210,0,0.18) 3px,transparent 3px,transparent 15px)',
};
