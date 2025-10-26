import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fetchArtistBySlug } from '../../services/artists';
import { ArtistDetail } from '../../components/artists/ArtistDetail';
import type { Artist } from '../../types/artist';

export const Route = createFileRoute('/artists/$slug')({
  component: ArtistDetailPage,
});

function ArtistDetailPage() {
  const { slug } = Route.useParams();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadArtist() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchArtistBySlug(slug);

        if (!data) {
          throw new Error('Artist not found');
        }

        setArtist(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load artist'));
      } finally {
        setIsLoading(false);
      }
    }

    loadArtist();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="artist-detail-page">
        <div className="artist-detail-page__loading">
          <p>Loading artist...</p>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="artist-detail-page">
        <div className="artist-detail-page__error">
          <h3>Error loading artist</h3>
          <p>{error?.message || 'Artist not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="artist-detail-page">
      <ArtistDetail artist={artist} />
    </div>
  );
}
