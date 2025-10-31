import { useQuery } from '@tanstack/react-query';
import { fetchEpisodeBySlug } from '../services/episodes';

/**
 * Hook for fetching a single episode by its slug
 * Uses TanStack Query for automatic caching and background refetching
 */
export function useEpisodeBySlug(slug: string) {
  return useQuery({
    queryKey: ['episodes', slug],
    queryFn: async () => {
      const episode = await fetchEpisodeBySlug(slug);
      if (!episode) {
        throw new Error('Episode not found');
      }
      return episode;
    },
    enabled: !!slug, // Only run query if slug exists
  });
}
