import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fetchArtists } from '../../services/artists';
import { ArtistList } from '../../components/artists/ArtistList';
import { PageHeader } from '../../components/shared/PageHeader';
import type { Artist } from '../../types/artist';

export const Route = createFileRoute('/artists/')({
  component: ArtistsPage,
});

function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const PAGE_SIZE = 10;

  // Load initial artists
  useEffect(() => {
    async function loadInitialArtists() {
      try {
        setIsLoading(true);
        const { artists: data, hasMore: more } = await fetchArtists(1, PAGE_SIZE);
        setArtists(data);
        setHasMore(more);
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load artists'));
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialArtists();
  }, []);

  // Load more artists
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const { artists: newArtists, hasMore: more } = await fetchArtists(nextPage, PAGE_SIZE);

      setArtists((prev) => [...prev, ...newArtists]);
      setHasMore(more);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Error loading more artists:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="artists-page">
      <PageHeader
        title="ARTISTS"
        subtitle="Explore our community of artists and radio hosts."
        iconSrc="/Images/Head1_Dark.webp"
      />

      <ArtistList
        artists={artists}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
