import { useQuery } from '@tanstack/react-query';
import { fetchResidentArtists } from '../services/artists';

/**
 * Hook for fetching artists flagged as residents in Strapi
 * Uses longer staleTime since the resident roster changes infrequently
 */
export function useResidentArtists(limit: number = 100) {
  return useQuery({
    queryKey: ['artists', 'residents', limit],
    queryFn: () => fetchResidentArtists(limit),
    staleTime: 1000 * 60 * 10, // 10 minutes - residents don't change frequently
  });
}
