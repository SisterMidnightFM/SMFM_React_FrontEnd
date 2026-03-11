import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchAllNews } from '../services/news';
import type { News } from '../types/news';

const PAGE_SIZE = 10;

export function useNews() {
  const query = useInfiniteQuery({
    queryKey: ['news'],
    queryFn: async ({ pageParam = 1 }) => {
      return await fetchAllNews(pageParam, PAGE_SIZE);
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const news: News[] = query.data?.pages.flatMap(page => page.news) ?? [];

  return {
    news,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    error: query.error,
    hasMore: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
}
