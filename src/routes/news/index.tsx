import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fetchAllNews } from '../../services/news';
import { NewsList } from '../../components/news/NewsList';
import { PageHeader } from '../../components/shared/PageHeader';
import type { News } from '../../types/news';

export const Route = createFileRoute('/news/')({
  component: NewsListPage,
});

function NewsListPage() {
  const [news, setNews] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const PAGE_SIZE = 10;

  // Load initial news
  useEffect(() => {
    async function loadInitialNews() {
      try {
        setIsLoading(true);
        const { news: data, hasMore: more } = await fetchAllNews(1, PAGE_SIZE);
        setNews(data);
        setHasMore(more);
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load news'));
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialNews();
  }, []);

  // Load more news
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const { news: newNews, hasMore: more } = await fetchAllNews(nextPage, PAGE_SIZE);

      setNews((prev) => [...prev, ...newNews]);
      setHasMore(more);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Error loading more news:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="news-list-page">
      <PageHeader
        title="News"
        iconSrc="/Images/Cat_Dark.webp"
      />

      <NewsList
        news={news}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
