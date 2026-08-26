import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 *
 * Used where a layout difference can't be expressed in CSS alone — for example
 * rendering a compact card plus a detail modal on phones versus a full inline
 * card on desktop. Prefer plain CSS media queries for anything purely visual.
 *
 * Built on useSyncExternalStore rather than useState + useEffect: matchMedia is
 * an external store, so this reads the value during render instead of setting
 * state from an effect (which causes an extra render and a cascading-render
 * lint error). Re-subscribes automatically when `query` changes.
 *
 * @param {string} query e.g. '(max-width: 768px)'
 * @returns {boolean}
 */
export default function useMediaQuery(query) {
  const subscribe = useCallback((onStoreChange) => {
    if (typeof window === 'undefined' || !window.matchMedia) return () => {};

    const mql = window.matchMedia(query);
    mql.addEventListener('change', onStoreChange);
    return () => mql.removeEventListener('change', onStoreChange);
  }, [query]);

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  }, [query]);

  // Server/prerender has no viewport; assume the desktop layout.
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
