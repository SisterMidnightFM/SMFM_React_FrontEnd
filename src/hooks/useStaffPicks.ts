import { useQuery } from '@tanstack/react-query';
import { fetchStaffPickEpisodes } from '../services/episodes';

/**
 * Hook for fetching staff pick episodes
 * Uses longer staleTime since staff picks change infrequently
 */
export function useStaffPicks() {
  return useQuery({
    queryKey: ['episodes', 'staff-picks'],
    queryFn: fetchStaffPickEpisodes,
    staleTime: 1000 * 60 * 10, // 10 minutes - staff picks don't change frequently
  });
}
