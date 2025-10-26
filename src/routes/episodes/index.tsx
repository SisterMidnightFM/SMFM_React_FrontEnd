import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fetchEpisodes } from '../../services/episodes';
import { EpisodeList } from '../../components/episodes/EpisodeList';
import type { Episode } from '../../types/episode';

export const Route = createFileRoute('/episodes/')({
  component: EpisodesPage,
});

function EpisodesPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const PAGE_SIZE = 10;

  // Load initial episodes
  useEffect(() => {
    async function loadInitialEpisodes() {
      try {
        setIsLoading(true);
        const { episodes: data, hasMore: more } = await fetchEpisodes(1, PAGE_SIZE);
        setEpisodes(data);
        setHasMore(more);
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load episodes'));
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialEpisodes();
  }, []);

  // Load more episodes
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const { episodes: newEpisodes, hasMore: more } = await fetchEpisodes(nextPage, PAGE_SIZE);

      setEpisodes((prev) => [...prev, ...newEpisodes]);
      setHasMore(more);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Error loading more episodes:', err);
      // Don't show error for load more, just log it
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="episodes-page">
      <header className="episodes-page__header">
        <h1>All Episodes</h1>
        <p>Explore our collection of radio episodes</p>
      </header>

      <EpisodeList
        episodes={episodes}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
