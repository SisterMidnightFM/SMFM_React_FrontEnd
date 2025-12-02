import type { News } from '../../types/news';
import { NewsCard } from './NewsCard';
import { CardGrid } from '../shared/CardGrid';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import './NewsList.css';

interface NewsListProps {
  news: News[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  error?: Error | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function NewsList({
  news,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  onLoadMore
}: NewsListProps) {
  const sentinelRef = useInfiniteScroll(onLoadMore, isLoadingMore || false, hasMore || false);

  if (isLoading && news.length === 0) {
    return (
      <div className="news-list">
        <div className="news-list__loading">
          <p>Loading news...</p>
        </div>
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div className="news-list">
        <div className="news-list__error">
          <h3>Error loading news</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="news-list">
        <div className="news-list__empty">
          <p>No news found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-list">
      {/* Responsive Grid */}
      <CardGrid>
        {news.map((newsItem) => (
          <NewsCard key={newsItem.id} news={newsItem} />
        ))}
      </CardGrid>

      {/* Infinite scroll sentinel */}
      {hasMore && onLoadMore && (
        <div ref={sentinelRef} className="news-list__sentinel" aria-hidden="true" />
      )}

      {/* Loading indicator for load more */}
      {isLoadingMore && (
        <div className="news-list__loading-more">
          <p>Loading more news...</p>
        </div>
      )}
    </div>
  );
}
