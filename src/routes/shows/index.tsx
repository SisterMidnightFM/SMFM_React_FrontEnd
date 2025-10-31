import { createFileRoute } from '@tanstack/react-router';
import { useShows } from '../../hooks/useShows';
import { ShowList } from '../../components/shows/ShowList';
import { PageHeader } from '../../components/shared/PageHeader';

export const Route = createFileRoute('/shows/')({
  component: ShowsPage,
});

function ShowsPage() {
  const { shows, isLoading, isLoadingMore, error, hasMore, fetchNextPage } = useShows();

  return (
    <div className="shows-page">
      <PageHeader
        title="SHOWS"
        subtitle="Explore SMFM by the show residencies."
        iconSrc="/Images/Moon_Dark.webp"
      />

      <ShowList
        shows={shows}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={fetchNextPage}
      />
    </div>
  );
}
