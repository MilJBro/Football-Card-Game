'use client';

import { useRef, useState } from 'react';
import { getPack } from '@/data/packs';
import { getCard } from '@/data/players';
import { drawPack } from '@/lib/packSystem';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { CardFlip } from '@/components/cards/CardFlip';
import { PackArt } from '@/components/opening/PackArt';
import { cn, formatCoins } from '@/lib/ui';

type Phase = 'sealed' | 'revealing';

interface DrawnCard {
  cardId: string;
  isNew: boolean;
  isFoil: boolean;
}

interface PackOpeningProps {
  packId: string;
  /** Close the opening view (back to the shop grid). */
  onClose: () => void;
  /** Jump to the Upgrades tab to view the new cards. */
  onViewCards?: () => void;
}

export function PackOpening({ packId, onClose, onViewCards }: PackOpeningProps) {
  const hydrated = useHydrated();
  const pack = getPack(packId);

  const coins = useGameStore((s) => s.coins);
  const spendCoins = useGameStore((s) => s.spendCoins);
  const addCards = useGameStore((s) => s.addCards);

  const [phase, setPhase] = useState<Phase>('sealed');
  const [drawn, setDrawn] = useState<DrawnCard[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [active, setActive] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const openedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!pack) {
    return (
      <div className="py-20 text-center">
        <p className="text-white/60">Unknown pack.</p>
        <button onClick={onClose} className="mt-4 inline-block text-emerald-400 underline">
          Back
        </button>
      </div>
    );
  }

  function openPack() {
    if (openedRef.current) return;
    openedRef.current = true;

    const ok = spendCoins(pack!.cost, `Opened ${pack!.name}`);
    if (!ok) {
      setError('Not enough coins.');
      openedRef.current = false;
      return;
    }

    const ids = drawPack(pack!);
    const result = addCards(ids);
    const newSet = new Set(result.newCards);
    const foilSet = new Set(result.foilsUnlocked);

    // Reveal lowest-rated first, saving the best of the pack for last.
    const ordered = [...ids].sort(
      (a, b) => (getCard(a)?.rating ?? 0) - (getCard(b)?.rating ?? 0)
    );

    setDrawn(
      ordered.map((cardId) => ({
        cardId,
        isNew: newSet.has(cardId),
        isFoil: foilSet.has(cardId),
      }))
    );
    // First card starts revealed.
    setRevealed(ordered.map((_, i) => i === 0));
    setActive(0);
    setPhase('revealing');
  }

  function reveal(i: number) {
    setRevealed((r) => {
      if (r[i]) return r;
      const next = [...r];
      next[i] = true;
      return next;
    });
  }

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) {
      setActive(i);
      reveal(i);
    }
  }

  // ---- Sealed ----
  if (phase === 'sealed') {
    const affordable = hydrated && coins >= pack.cost;
    return (
      <div className="flex flex-col items-center gap-6 py-10 text-center">
        <h1 className="text-2xl font-black">{pack.name}</h1>
        <div className="flex h-80 w-56 items-center justify-center rounded-3xl border-2 border-white/15 bg-gradient-to-b from-pitch-light to-pitch-dark shadow-xl">
          <PackArt category={pack.pack} className="h-40 w-40 drop-shadow-lg" />
        </div>
        <p className="text-white/60">
          Cost: <span className="font-bold text-yellow-300">🪙 {formatCoins(pack.cost)}</span>
        </p>
        {error && <p className="text-pl-pink">{error}</p>}
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose}>
            Back
          </Button>
          <Button size="lg" onClick={openPack} disabled={!affordable}>
            {affordable ? 'Open Pack' : 'Not enough coins'}
          </Button>
        </div>
      </div>
    );
  }

  // ---- Revealing (Instagram-story style) ----
  const allRevealed = revealed.every(Boolean);
  return (
    <div className="flex flex-col items-center gap-4 pb-4 pt-2">
      <h1 className="text-xl font-black">{pack.name}</h1>

      {/* Story progress segments */}
      <div className="flex w-full max-w-xs gap-1.5">
        {drawn.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
            <span
              className={cn(
                'block h-full rounded-full bg-emerald-400 transition-all',
                revealed[i] ? 'w-full' : 'w-0',
                i === active && 'bg-emerald-300'
              )}
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-white/50">
        {allRevealed ? 'All revealed!' : `Swipe to reveal · ${active + 1}/${drawn.length}`}
      </p>

      {/* Card carousel */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {drawn.map((d, i) => {
          const card = getCard(d.cardId)!;
          return (
            <div key={i} className="flex w-full min-w-full shrink-0 snap-center justify-center px-4 py-2">
              <CardFlip
                card={card}
                flipped={revealed[i]}
                foil={d.isFoil}
                isNew={d.isNew}
                onClick={() => reveal(i)}
              />
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onClose}>
          Open Another
        </Button>
        {onViewCards && <Button onClick={onViewCards}>View Cards</Button>}
      </div>
    </div>
  );
}
