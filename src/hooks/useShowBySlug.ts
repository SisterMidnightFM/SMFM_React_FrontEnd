import { useQuery } from '@tanstack/react-query';
import { fetchShowBySlug } from '../services/shows';

/**
 * Hook for fetching a single show by its slug
 * Uses TanStack Query for automatic caching and background refetching
 */
export function useShowBySlug(slug: string) {
  return useQuery({
    queryKey: ['shows', slug],
    queryFn: async () => {
      const show = await fetchShowBySlug(slug);
      if (!show) {
        throw new Error('Show not found');
      }
      return show;
    },
    enabled: !!slug, // Only run query if slug exists
  });
}
