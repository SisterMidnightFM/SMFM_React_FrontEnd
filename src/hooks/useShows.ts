import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchShows } from '../services/shows';
import type { Show } from '../types/show';

const PAGE_SIZE = 10;

/**
 * Hook for fetching paginated shows with infinite scroll support
 * Uses TanStack Query's useInfiniteQuery for automatic caching and pagination
 */
export function useShows() {
  const query = useInfiniteQuery({
    queryKey: ['shows'],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchShows(pageParam, PAGE_SIZE);
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten pages into a single array of shows
  const shows: Show[] = query.data?.pages.flatMap(page => page.shows) ?? [];

  return {
    shows,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    error: query.error,
    hasMore: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
