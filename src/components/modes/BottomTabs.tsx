'use client';

import { cn } from '@/lib/ui';
import { WhistleIcon, BenchIcon } from '@/components/ui/icons';

export type ChallengeTab = 'simulation' | 'squad';

const TABS: {
  id: ChallengeTab;
  label: string;
  Icon: (props: { className?: string }) => JSX.Element;
}[] = [
  { id: 'simulation', label: 'Simulation', Icon: WhistleIcon },
  { id: 'squad', label: 'Squad', Icon: BenchIcon },
];

export function BottomTabs({
  active,
  onChange,
}: {
  active: ChallengeTab;
  onChange: (tab: ChallengeTab) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-pitch-dark/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-stretch justify-around">
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-bold transition-colors',
                isActive ? 'text-emerald-400' : 'text-white/50 hover:text-white/80'
              )}
            >
              <t.Icon
                className={cn(
                  'h-5 w-5',
                  isActive && 'drop-shadow-[0_0_6px_rgba(0,255,133,0.7)]'
                )}
              />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
