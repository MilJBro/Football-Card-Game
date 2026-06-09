'use client';

import { useRef, useState } from 'react';
import type { PackDef, PackCategory } from '@/store/types';
import { ALL_PACKS } from '@/data/packs';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { PackOpening } from '@/components/opening/PackOpening';
import { PackArt } from '@/components/opening/PackArt';
import { GlovesIcon, WallIcon, TargetIcon, CompassStarIcon } from '@/components/ui/icons';
import { cn, TIER_STYLES, TIER_BADGE, formatCoins } from '@/lib/ui';

const CATEGORY_LABEL: Record<PackCategory, string> = {
  GK: 'Goalkeepers',
  DEF: 'Defenders',
  MID: 'Midfielders',
  ATT: 'Attackers',
};
const CATEGORY_ICON: Record<PackCategory, (props: { className?: string }) => JSX.Element> = {
  GK: GlovesIcon,
  DEF: WallIcon,
  MID: CompassStarIcon,
  ATT: TargetIcon,
};
const CATEGORY_ORDER: PackCategory[] = ['GK', 'DEF', 'MID', 'ATT'];

export function PacksTab({ onGoToUpgrades }: { onGoToUpgrades: () => void }) {
  const [openingPackId, setOpeningPackId] = useState<string | null>(null);
  const [category, setCategory] = useState<PackCategory>('ATT');

  // Inline pack-opening view.
  if (openingPackId) {
    return (
      <PackOpening
        packId={openingPackId}
        onClose={() => setOpeningPackId(null)}
        onViewCards={() => {
          setOpeningPackId(null);
          onGoToUpgrades();
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-black">Packs</h1>
        <p className="text-sm text-white/60">
          Pick a position, then swipe through the tiers. Every pack holds 5 cards.
        </p>
      </header>

      {/* Category tabs */}
      <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-black/30 p-1.5">
        {CATEGORY_ORDER.map((cat) => {
          const isActive = cat === category;
          const Icon = CATEGORY_ICON[cat];
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-bold transition-colors',
                isActive
                  ? 'bg-emerald-500 text-emerald-950'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{CATEGORY_LABEL[cat]}</span>
            </button>
          );
        })}
      </div>

      <PackStory
        key={category}
        packs={ALL_PACKS.filter((p) => p.pack === category)}
        onOpen={setOpeningPackId}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// One position category as an Instagram-story-style horizontal carousel.
// ---------------------------------------------------------------------------

function PackStory({
  packs,
  onOpen,
}: {
  packs: PackDef[];
  onOpen: (packId: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(i);
  }

  function goTo(i: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }

  return (
    <section className="space-y-2">
      {/* Story progress segments */}
      <div className="flex gap-1.5">
        {packs.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goTo(i)}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/15"
            aria-label={`Go to ${p.tier}`}
          >
            <span
              className={cn(
                'block h-full rounded-full transition-all',
                i === active ? 'w-full bg-emerald-400' : 'w-0 bg-emerald-400'
              )}
            />
          </button>
        ))}
      </div>

      {/* Horizontal snap carousel */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth"
      >
        {packs.map((pack) => (
          <PackSlide key={pack.id} pack={pack} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

function PackSlide({ pack, onOpen }: { pack: PackDef; onOpen: (id: string) => void }) {
  const hydrated = useHydrated();
  const coins = useGameStore((s) => s.coins);
  const styles = TIER_STYLES[pack.tier];
  const affordable = hydrated && coins >= pack.cost;

  const stripe =
    pack.tier === 'Legend'
      ? 'repeating-linear-gradient(135deg,rgba(255,210,0,0.16) 0px,rgba(255,210,0,0.16) 3px,transparent 3px,transparent 16px)'
      : pack.tier === 'Star'
        ? 'repeating-linear-gradient(135deg,rgba(220,225,240,0.08) 0px,rgba(220,225,240,0.08) 2px,transparent 2px,transparent 15px)'
        : undefined;

  return (
    <div className="w-full min-w-full shrink-0 snap-center">
      <div
        className={cn(
          'relative flex h-72 flex-col items-center justify-between overflow-hidden rounded-3xl border-2 bg-gradient-to-b p-6 text-center',
          styles.border,
          styles.gradient,
          styles.glow
        )}
      >
        {stripe && (
          <div className="pointer-events-none absolute inset-0" style={{ background: stripe }} />
        )}

        <span
          className={cn(
            'relative rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest',
            TIER_BADGE[pack.tier]
          )}
        >
          {pack.tier}
        </span>

        <PackArt category={pack.pack} className="relative h-32 w-32 drop-shadow-lg" />

        <div className="relative w-full">
          <h3 className="text-lg font-black leading-tight">{pack.name}</h3>
          <p className="mx-auto mt-1 max-w-[16rem] text-xs text-white/60">{pack.description}</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="flex items-center gap-1 text-lg font-bold text-yellow-300">
              🪙 {formatCoins(pack.cost)}
            </span>
            <Button size="sm" onClick={() => onOpen(pack.id)} disabled={!affordable}>
              {affordable ? 'Open' : 'Too pricey'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
