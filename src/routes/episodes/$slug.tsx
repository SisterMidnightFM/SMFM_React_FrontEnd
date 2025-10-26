import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fetchEpisodeBySlug } from '../../services/episodes';
import { EpisodeDetail } from '../../components/episodes/EpisodeDetail';
import type { Episode } from '../../types/episode';

export const Route = createFileRoute('/episodes/$slug')({
  component: EpisodeDetailPage,
});

function EpisodeDetailPage() {
  const { slug } = Route.useParams();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadEpisode() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchEpisodeBySlug(slug);

        if (!data) {
          throw new Error('Episode not found');
        }

        setEpisode(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load episode'));
      } finally {
        setIsLoading(false);
      }
    }

    loadEpisode();
  }, [slug]);

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