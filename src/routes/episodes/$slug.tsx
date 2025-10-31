import { createFileRoute } from '@tanstack/react-router';
import { useEpisodeBySlug } from '../../hooks/useEpisodeBySlug';
import { EpisodeDetail } from '../../components/episodes/EpisodeDetail';

export const Route = createFileRoute('/episodes/$slug')({
  component: EpisodeDetailPage,
});

function EpisodeDetailPage() {
  const { slug } = Route.useParams();
  const { data: episode, isLoading, error } = useEpisodeBySlug(slug);

  if (isLoading) {
    return (
      <div className="episode-detail-page">
        <div className="episode-detail-page__loading">
          <p>Loading episode...</p>
        </div>
      </div>
    );
  }

  if (error || !episode) {
    return (
      <div className="episode-detail-page">
        <div className="episode-detail-page__error">
          <h3>Error loading episode</h3>
          <p>{error?.message || 'Episode not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="episode-detail-page">
      <EpisodeDetail episode={episode} />
    </div>
  );
}