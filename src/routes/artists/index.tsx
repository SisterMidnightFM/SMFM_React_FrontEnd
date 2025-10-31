import { createFileRoute } from '@tanstack/react-router';
import { useArtists } from '../../hooks/useArtists';
import { ArtistList } from '../../components/artists/ArtistList';
import { PageHeader } from '../../components/shared/PageHeader';

export const Route = createFileRoute('/artists/')({
  component: ArtistsPage,
});

function ArtistsPage() {
  const { artists, isLoading, isLoadingMore, error, hasMore, fetchNextPage } = useArtists();

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
        onLoadMore={fetchNextPage}
      />
    </div>
  );
}
