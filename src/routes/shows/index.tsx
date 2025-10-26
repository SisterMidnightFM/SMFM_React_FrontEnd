import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fetchShows } from '../../services/shows';
import { ShowList } from '../../components/shows/ShowList';
import type { Show } from '../../types/show';

export const Route = createFileRoute('/shows/')({
  component: ShowsPage,
});

function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const PAGE_SIZE = 10;

  // Load initial shows
  useEffect(() => {
    async function loadInitialShows() {
      try {
        setIsLoading(true);
        const { shows: data, hasMore: more } = await fetchShows(1, PAGE_SIZE);
        setShows(data);
        setHasMore(more);
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load shows'));
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialShows();
  }, []);

  // Load more shows
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const { shows: newShows, hasMore: more } = await fetchShows(nextPage, PAGE_SIZE);

      setShows((prev) => [...prev, ...newShows]);
      setHasMore(more);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Error loading more shows:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="shows-page">
      <header className="shows-page__header">
        <h1>All Shows</h1>
        <p>Discover our collection of radio shows</p>
      </header>

      <ShowList
        shows={shows}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
