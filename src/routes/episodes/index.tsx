import { createFileRoute } from '@tanstack/react-router';
import { useEpisodes } from '../../hooks/useEpisodes';
import { EpisodeList } from '../../components/episodes/EpisodeList';
import { PageHeader } from '../../components/shared/PageHeader';

export const Route = createFileRoute('/episodes/')({
  component: EpisodesPage,
});

function EpisodesPage() {
  const { episodes, isLoading, isLoadingMore, error, hasMore, fetchNextPage } = useEpisodes();

  return (
    <div className="episodes-page">
      <PageHeader
        title="EPISODES"
        subtitle="Explore our full collection of radio broadcasts."
        iconSrc="/Images/Plant1_Dark.webp"
      />

      <EpisodeList
        episodes={episodes}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={fetchNextPage}
      />
    </div>
  );
}
