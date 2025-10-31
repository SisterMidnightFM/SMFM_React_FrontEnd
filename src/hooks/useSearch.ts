import { useQuery } from '@tanstack/react-query';
import { search } from '../services/search';
import type { SearchFilters } from '../types/search';

const PAGE_SIZE = 10;

/**
 * Hook for searching episodes, shows, and artists
 * Uses TanStack Query with filters as part of the query key for automatic caching
 *
 * @param filters - Search filters including query text, content types, date range, and tags
 * @param enabled - Whether to run the query (false until user clicks search)
 */
export function useSearch(filters: SearchFilters, enabled: boolean = false) {
  return useQuery({
    queryKey: ['search', filters],
    queryFn: async () => {
      return await search(filters, 1, PAGE_SIZE);
    },
    enabled: enabled, // Only run when explicitly enabled (user clicked search)
    staleTime: 1000 * 60 * 2, // 2 minutes - search results can go stale faster
  });
}
