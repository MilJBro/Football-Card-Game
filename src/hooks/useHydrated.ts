'use client';

import { useEffect, useState } from 'react';

/** Returns true once the client has mounted, so persisted (localStorage) state
 *  can be read without causing SSG/CSR hydration mismatches. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
