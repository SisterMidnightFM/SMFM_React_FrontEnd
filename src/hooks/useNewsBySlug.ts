import { useQuery } from '@tanstack/react-query';
import { fetchNewsBySlug } from '../services/news';

export function useNewsBySlug(slug: string) {
  return useQuery({
    queryKey: ['news', slug],
    queryFn: async () => {
      const news = await fetchNewsBySlug(slug);
      if (!news) {
        throw new Error('News not found');
      }
      return news;
    },
    enabled: !!slug,
  });
}
