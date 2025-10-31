import { createFileRoute } from '@tanstack/react-router';
import { useArtistBySlug } from '../../hooks/useArtistBySlug';
import { ArtistDetail } from '../../components/artists/ArtistDetail';

export const Route = createFileRoute('/artists/$slug')({
  component: ArtistDetailPage,
});

function ArtistDetailPage() {
  const { slug } = Route.useParams();
  const { data: artist, isLoading, error } = useArtistBySlug(slug);

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
