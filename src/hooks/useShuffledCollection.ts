import { useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchAllIds, type Collection } from '../services/ids';

const PAGE_SIZE = 10;

/** Small deterministic PRNG, so a given seed always produces the same order */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates driven by the seeded PRNG */
function shuffleWithSeed(ids: number[], seed: number): number[] {
  const random = mulberry32(seed);
  const shuffled = [...ids];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface UseShuffledCollectionOptions<T> {
  /** Only fetch while the list is actually in shuffle mode */
  enabled: boolean;
  /** Bumped on every shuffle click to draw a fresh order */
  seed: number;
  fetchByIds: (ids: number[]) => Promise<T[]>;
}

/**
 * A random ordering of a whole Strapi collection, paged in as the user scrolls.
 *
 * The catalogue's ids are fetched once (id field only) and cached for the
 * session, so re-shuffling costs nothing but a reorder; each shuffle then pulls
 * the full records for a page of ids at a time. Pages are cached per seed, so
 * scrolling back and forth — or returning to a shuffle already seen — is served
 * from the cache.
 */
export function useShuffledCollection<T>(
  collection: Collection,
  { enabled, seed, fetchByIds }: UseShuffledCollectionOptions<T>
) {
  const idsQuery = useQuery({
    queryKey: [collection, 'all-ids'],
    queryFn: () => fetchAllIds(collection),
    staleTime: 1000 * 60 * 30, // 30 minutes - the catalogue barely moves
    gcTime: 1000 * 60 * 60,
    enabled,
  });

  const shuffledIds = useMemo(
    () => shuffleWithSeed(idsQuery.data ?? [], seed),
    [idsQuery.data, seed]
  );

  const pagesQuery = useInfiniteQuery({
    queryKey: [collection, 'shuffled', seed],
    queryFn: ({ pageParam }) =>
      fetchByIds(shuffledIds.slice(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE)),
    initialPageParam: 0,
    getNextPageParam: (_lastPage, allPages) =>
      allPages.length * PAGE_SIZE < shuffledIds.length ? allPages.length : undefined,
    enabled: enabled && shuffledIds.length > 0,
    staleTime: Infinity, // a given shuffle never needs refetching
  });

  const items = useMemo(
    () => pagesQuery.data?.pages.flat() ?? [],
    [pagesQuery.data]
  );

  return {
    items: items as T[],
    isLoading: idsQuery.isLoading || (pagesQuery.isLoading && items.length === 0),
    isLoadingMore: pagesQuery.isFetchingNextPage,
    error: (idsQuery.error ?? pagesQuery.error) as Error | null,
    hasMore: pagesQuery.hasNextPage,
    fetchNextPage: pagesQuery.fetchNextPage,
  };
}
