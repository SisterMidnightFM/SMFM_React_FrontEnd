import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchArtists } from '../services/artists';
import type { Artist } from '../types/artist';

const PAGE_SIZE = 10;

/**
 * Hook for fetching paginated artists with infinite scroll support
 * Uses TanStack Query's useInfiniteQuery for automatic caching and pagination
 */
export function useArtists() {
  const query = useInfiniteQuery({
    queryKey: ['artists'],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchArtists(pageParam, PAGE_SIZE);
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten pages into a single array of artists
  const artists: Artist[] = query.data?.pages.flatMap(page => page.artists) ?? [];

  return {
    artists,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    error: query.error,
    hasMore: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
