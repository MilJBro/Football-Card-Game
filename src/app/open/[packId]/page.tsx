import { ALL_PACKS } from '@/data/packs';
import { PackOpening } from '@/components/opening/PackOpening';

// Static export needs every dynamic path enumerated at build time.
export function generateStaticParams() {
  return ALL_PACKS.map((p) => ({ packId: p.id }));
}

export default function OpenPackPage({ params }: { params: { packId: string } }) {
  return <PackOpening packId={params.packId} />;
}
