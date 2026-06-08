import { GAME_MODES } from '@/data/gameModes';
import { ModeRunner } from '@/components/modes/ModeRunner';

export function generateStaticParams() {
  return GAME_MODES.map((m) => ({ modeId: m.id }));
}

export default function ModePage({ params }: { params: { modeId: string } }) {
  return <ModeRunner modeId={params.modeId} />;
}
