import { useQuery } from '@tanstack/react-query';
import { fetchNextBroadcastForShow } from '../services/schedule';

/**
 * Hook for fetching the next scheduled broadcast for a specific show
 * Uses TanStack Query for caching with a 15-minute stale time
 *
 * @param showName - The name of the show
 * @param showSlug - The slug of the show
 * @returns Query result with next broadcast data, loading, and error states
 */
export function useNextBroadcast(showName: string, showSlug: string) {
  return useQuery({
    queryKey: ['nextBroadcast', showSlug],
    queryFn: () => fetchNextBroadcastForShow(showName, showSlug),
    staleTime: 1000 * 60 * 15, // 15 minutes - schedule can change
    gcTime: 1000 * 60 * 30, // 30 minutes cache retention
    enabled: !!showName && !!showSlug, // Only run if both params exist
  });
}
