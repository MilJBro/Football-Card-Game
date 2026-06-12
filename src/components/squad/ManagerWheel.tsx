'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { EnglandManager } from '@/store/types';
import { ENGLAND_MANAGERS } from '@/data/managers';
import { Button } from '@/components/ui/Button';

// Spin delays in ms — starts fast, slows to a stop
const SPIN_DELAYS = [60, 65, 70, 80, 95, 115, 140, 170, 210, 260, 320, 390, 470];

interface ManagerWheelProps {
  onComplete: (manager: EnglandManager) => void;
}

export function ManagerWheel({ onComplete }: ManagerWheelProps) {
  const chosen = useMemo(
    () => ENGLAND_MANAGERS[Math.floor(Math.random() * ENGLAND_MANAGERS.length)],
    []
  );

  const [spinning, setSpinning] = useState(true);
  const [current, setCurrent] = useState<EnglandManager>(ENGLAND_MANAGERS[0]);
  const delayIdx = useRef(0);
  const reelIdx = useRef(0);

  useEffect(() => {
    function tick() {
      reelIdx.current = (reelIdx.current + 1) % ENGLAND_MANAGERS.length;
      setCurrent(ENGLAND_MANAGERS[reelIdx.current]);
      delayIdx.current += 1;

      if (delayIdx.current < SPIN_DELAYS.length) {
        setTimeout(tick, SPIN_DELAYS[delayIdx.current]);
      } else {
        setCurrent(chosen);
        setSpinning(false);
      }
    }
    setTimeout(tick, SPIN_DELAYS[0]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center gap-6 py-10 text-center">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/40">New Tournament</p>
        <h1 className="mt-1 text-2xl font-black">Who&apos;s in the Dugout?</h1>
        <p className="mt-2 max-w-xs text-sm text-white/60">
          The FA is appointing a manager from England&apos;s past. Their formation is the one
          you&apos;ll play for the whole World Cup.
        </p>
      </div>

      {/* Manager reel */}
      <div className={`relative flex h-32 w-full max-w-xs items-center justify-center overflow-hidden rounded-2xl border-2 bg-black/40 transition-colors duration-300 ${spinning ? 'border-white/20' : 'border-emerald-400'}`}>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-black/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-black/60 to-transparent" />

        <AnimatePresence mode="popLayout">
          <motion.div
            key={current.name + String(delayIdx.current)}
            initial={{ y: 34, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -34, opacity: 0 }}
            transition={{ duration: 0.06 }}
            className="flex flex-col items-center gap-0.5"
          >
            <span className={`text-xl font-black ${spinning ? 'text-white/50 blur-[0.5px]' : 'text-white'}`}>
              {current.name}
            </span>
            <span className={`text-xs ${spinning ? 'text-white/25' : 'text-white/50'}`}>
              England {current.era}
            </span>
            <span className={`mt-1 rounded-full px-3 py-0.5 text-sm font-black ${spinning ? 'bg-white/10 text-white/40' : 'bg-emerald-500/20 text-emerald-300'}`}>
              {current.formation}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {spinning ? (
        <p className="text-xs text-white/30">Appointing a manager…</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xs space-y-3"
        >
          <p className="text-sm font-bold text-emerald-300">
            {chosen.name} takes charge — you&apos;re playing {chosen.formation}.
          </p>
          <Button size="lg" className="w-full" onClick={() => onComplete(chosen)}>
            Build the Squad
          </Button>
        </motion.div>
      )}
    </div>
  );
}
