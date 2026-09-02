import { useQuery } from '@tanstack/react-query';
import { fetchGuestShowEpisodes } from '../services/episodes';

/**
 * Hook for fetching episodes from the Guest Show
 * Uses longer staleTime since guest shows are added infrequently
 */
export function useGuestShows(limit: number = 30) {
  return useQuery({
    queryKey: ['episodes', 'guest-shows', limit],
    queryFn: () => fetchGuestShowEpisodes(limit),
    staleTime: 1000 * 60 * 10, // 10 minutes - guest shows don't change frequently
  });
}
