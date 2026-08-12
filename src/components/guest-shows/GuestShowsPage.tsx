import { useEffect, useState } from 'react';
import { EpisodeCard } from '../episodes/EpisodeCard';
import { CardGrid } from '../shared/CardGrid';
import { PageHeader } from '../shared/PageHeader';
import { fetchGuestShowEpisodes } from '../../services/episodes';
import type { Episode } from '../../types/episode';
import './GuestShowsPage.css';

export function GuestShowsPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGuestShows() {
      try {
        setIsLoading(true);
        const data = await fetchGuestShowEpisodes(100);
        setEpisodes(data);
      } catch (err) {
        console.error('Failed to load guest shows:', err);
        setError('Failed to load guest shows');
      } finally {
        setIsLoading(false);
      }
    }

    loadGuestShows();
  }, []);

  return (
    <div className="guest-shows-page">
      <PageHeader
        title="GUEST SHOWS"
        iconSrc="/Images/Record_Dark.webp"
      />

      {isLoading && <p className="guest-shows-page__loading">Loading guest shows...</p>}
      {error && <p className="guest-shows-page__error">{error}</p>}

      {!isLoading && !error && (
        <CardGrid>
          {episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </CardGrid>
      )}
    </div>
  );
}
