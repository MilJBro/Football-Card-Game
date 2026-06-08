'use client';

import { useRef, useState } from 'react';
import { getPack } from '@/data/packs';
import { getCard } from '@/data/players';
import { drawPack } from '@/lib/packSystem';
import { useGameStore } from '@/store/useGameStore';
import { useHydrated } from '@/hooks/useHydrated';
import { Button } from '@/components/ui/Button';
import { CardFlip } from '@/components/cards/CardFlip';
import { cn, TIER_STYLES, formatCoins } from '@/lib/ui';

type Phase = 'sealed' | 'revealing' | 'done';

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
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);
  const openedRef = useRef(false);

  const allFlipped = flipped.length > 0 && flipped.every(Boolean);

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

  const styles = TIER_STYLES[pack.tier];

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

    setDrawn(
      ids.map((cardId) => ({
        cardId,
        isNew: newSet.has(cardId),
        isFoil: foilSet.has(cardId),
      }))
    );
    setFlipped(new Array(ids.length).fill(false));
    setPhase('revealing');
  }

  function flip(i: number) {
    setFlipped((f) => {
      if (f[i]) return f;
      const next = [...f];
      next[i] = true;
      return next;
    });
  }

  function revealAll() {
    setFlipped((f) => f.map(() => true));
  }

  // ---- Sealed ----
  if (phase === 'sealed') {
    const affordable = hydrated && coins >= pack.cost;
    return (
      <div className="flex flex-col items-center gap-6 py-10 text-center">
        <h1 className="text-2xl font-black">{pack.name}</h1>
        <div
          className={cn(
            'flex h-72 w-52 items-center justify-center rounded-2xl border-4 bg-gradient-to-b text-7xl',
            styles.border,
            styles.gradient,
            styles.glow
          )}
        >
          📦
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

  // ---- Revealing / done ----
  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <h1 className="text-2xl font-black">{pack.name}</h1>
      <p className="text-sm text-white/60">
        {allFlipped ? 'All revealed!' : 'Tap each card to reveal'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {drawn.map((d, i) => {
          const card = getCard(d.cardId)!;
          return (
            <CardFlip
              key={i}
              card={card}
              flipped={flipped[i]}
              foil={d.isFoil}
              isNew={d.isNew}
              onClick={() => flip(i)}
            />
          );
        })}
      </div>

      <div className="flex gap-3">
        {!allFlipped ? (
          <Button variant="secondary" onClick={revealAll}>
            Reveal All
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose}>
              Open Another
            </Button>
            {onViewCards && <Button onClick={onViewCards}>View Cards</Button>}
          </>
        )}
      </div>
    </div>
  );
}
