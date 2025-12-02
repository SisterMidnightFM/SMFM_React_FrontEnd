import { useEffect, useRef } from 'react';

/**
 * Custom hook for infinite scroll using Intersection Observer API
 *
 * @param onLoadMore - Callback function to load more items
 * @param isLoading - Whether more items are currently being loaded
 * @param hasMore - Whether there are more items to load
 * @returns Ref to attach to sentinel element
 */
export function useInfiniteScroll(
  onLoadMore: (() => void) | undefined,
  isLoading: boolean,
  hasMore: boolean
) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't set up observer if conditions aren't met
    if (!onLoadMore || !hasMore || isLoading) {
      return;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        // When sentinel becomes visible, load more
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && hasMore) {
          onLoadMore();
        }
      },
      {
        // Trigger slightly before element is fully visible
        rootMargin: '100px',
        threshold: 0,
      }
    );

    // Start observing
    observer.observe(sentinel);

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, isLoading, hasMore]);

  return sentinelRef;
}
