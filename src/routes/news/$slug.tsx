import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fetchNewsBySlug } from '../../services/news';
import { NewsDetail } from '../../components/news/NewsDetail';
import type { News } from '../../types/news';

export const Route = createFileRoute('/news/$slug')({
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const { slug } = Route.useParams();
  const [news, setNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadNews() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchNewsBySlug(slug);

        if (!data) {
          throw new Error('News not found');
        }

        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load news'));
      } finally {
        setIsLoading(false);
      }
    }

    loadNews();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-page__loading">
          <p>Loading news...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-page__error">
          <h3>Error loading news</h3>
          <p>{error?.message || 'News not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <NewsDetail news={news} />
    </div>
  );
}
