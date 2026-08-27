import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchEpisodesByArtist } from '../services/episodes';
import type { Episode } from '../types/episode';

const PAGE_SIZE = 4;

/**
 * Hook for fetching the episodes an artist appeared on (as host or guest),
 * most recent first, in pages of 4
 */
export function useArtistEpisodes(artistId: number | undefined) {
  const query = useInfiniteQuery({
    queryKey: ['artists', artistId, 'episodes'],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchEpisodesByArtist(artistId!, pageParam, PAGE_SIZE);
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!artistId,
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
