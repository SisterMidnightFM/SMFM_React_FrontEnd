import { useQuery } from '@tanstack/react-query';
import { fetchArtistBySlug } from '../services/artists';

/**
 * Hook for fetching a single artist by their slug
 * Uses TanStack Query for automatic caching and background refetching
 */
export function useArtistBySlug(slug: string) {
  return useQuery({
    queryKey: ['artists', slug],
    queryFn: async () => {
      const artist = await fetchArtistBySlug(slug);
      if (!artist) {
        throw new Error('Artist not found');
      }
      return artist;
    },
    enabled: !!slug, // Only run query if slug exists
  });
}
