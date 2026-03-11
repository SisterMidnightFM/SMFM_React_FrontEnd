import { useQuery } from '@tanstack/react-query';
import { fetchRecentNews } from '../services/news';

export function useRecentNews(limit: number = 4) {
  return useQuery({
    queryKey: ['news', 'recent', limit],
    queryFn: () => fetchRecentNews(limit),
    staleTime: 1000 * 60 * 5,
  });
}
