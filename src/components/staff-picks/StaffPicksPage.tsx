import { useEffect, useState } from 'react';
import { EpisodeCard } from '../episodes/EpisodeCard';
import { CardGrid } from '../shared/CardGrid';
import { fetchStaffPickEpisodes } from '../../services/episodes';
import type { Episode } from '../../types/episode';
import './StaffPicksPage.css';

export function StaffPicksPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStaffPicks() {
      try {
        setIsLoading(true);
        const data = await fetchStaffPickEpisodes();
        setEpisodes(data);
      } catch (err) {
        console.error('Failed to load staff picks:', err);
        setError('Failed to load staff picks');
      } finally {
        setIsLoading(false);
      }
    }

    loadStaffPicks();
  }, []);

  return (
    <div className="staff-picks-page">
      <div className="staff-picks-page__header">
        <img src="/Images/GuitarMan_Dark.webp" alt="" className="staff-picks-page__icon" />
        <h1 className="staff-picks-page__title">STAFF PICKS</h1>
      </div>

      {isLoading && <p className="staff-picks-page__loading">Loading staff picks...</p>}
      {error && <p className="staff-picks-page__error">{error}</p>}

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
