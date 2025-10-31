import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchEpisodes } from '../services/episodes';
import type { Episode } from '../types/episode';

const PAGE_SIZE = 10;

/**
 * Hook for fetching paginated episodes with infinite scroll support
 * Uses TanStack Query's useInfiniteQuery for automatic caching and pagination
 */
export function useEpisodes() {
  const query = useInfiniteQuery({
    queryKey: ['episodes'],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchEpisodes(pageParam, PAGE_SIZE);
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  // Flatten pages into a single array of episodes
  const episodes: Episode[] = query.data?.pages.flatMap(page => page.episodes) ?? [];

  return {
    episodes,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    error: query.error,
    hasMore: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
