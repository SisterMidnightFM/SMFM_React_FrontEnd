import { useEffect, useState } from 'react';
import { EpisodeCard } from '../episodes/EpisodeCard';
import { CardGrid } from '../shared/CardGrid';
import { PageHeader } from '../shared/PageHeader';
import { fetchStaffPickEpisodes } from '../../services/episodes';
import type { Episode } from '../../types/episode';
import './SMFMPicksPage.css';

export function SMFMPicksPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSMFMPicks() {
      try {
        setIsLoading(true);
        const data = await fetchStaffPickEpisodes();
        setEpisodes(data);
      } catch (err) {
        console.error('Failed to load SMFM picks:', err);
        setError('Failed to load SMFM picks');
      } finally {
        setIsLoading(false);
      }
    }

    loadSMFMPicks();
  }, []);

  return (
    <div className="smfm-picks-page">
      <PageHeader
        title="SMFM PICKS"
        iconSrc="/Images/GuitarMan_Dark.webp"
      />

      {isLoading && <p className="smfm-picks-page__loading">Loading SMFM picks...</p>}
      {error && <p className="smfm-picks-page__error">{error}</p>}

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
