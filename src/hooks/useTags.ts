import { useQuery } from '@tanstack/react-query';
import { fetchAllTags } from '../services/tags';

/**
 * Hook for fetching all tags (genres, themes, locations)
 * Uses longer staleTime since tags rarely change
 */
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: fetchAllTags,
    staleTime: 1000 * 60 * 30, // 30 minutes - tags don't change frequently
  });
}
