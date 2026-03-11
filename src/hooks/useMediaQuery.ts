import { useState, useEffect } from 'react';

/**
 * Shared hook for responsive breakpoint detection.
 * Uses matchMedia for efficient, event-driven breakpoint tracking
 * instead of resize listeners.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);

    mql.addEventListener('change', handler);
    setMatches(mql.matches);

    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

export function useIsMobile(): boolean {
  return !useMediaQuery('(min-width: 1024px)');
}
