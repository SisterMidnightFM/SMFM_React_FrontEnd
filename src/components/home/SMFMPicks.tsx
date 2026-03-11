import React from 'react';
import { Link } from '@tanstack/react-router';
import { EpisodeCard } from '../episodes/EpisodeCard';
import { useStaffPicks } from '../../hooks/useStaffPicks';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import './HomeSection.css';

export const SMFMPicks: React.FC = () => {
  const { data: episodes, isLoading, error } = useStaffPicks();

  const isMin768 = useMediaQuery('(min-width: 768px)');
  const isMin1200 = useMediaQuery('(min-width: 1200px)');
  const isMin1600 = useMediaQuery('(min-width: 1600px)');

  const visibleCount = !isMin768 ? 6 : !isMin1200 ? 8 : !isMin1600 ? 10 : 12;

  return (
    <section className="home-section">
      <div className="home-section__header">
        <img src="/Images/Hand1_Dark.webp" alt="" className="home-section__icon" />
        <Link to="/smfm-picks" className="home-section__title-link">
          <h2 className="home-section__title">SMFM PICKS</h2>
        </Link>
      </div>
      <div className="home-section__cards home-section__cards--scrollable">
        {isLoading && <p>Loading SMFM picks...</p>}
        {error && <p className="error">{error.message}</p>}
        {!isLoading && !error && episodes && episodes.slice(0, visibleCount).map((episode) => (
          <EpisodeCard
            key={episode.id}
            episode={episode}
          />
        ))}
      </div>
    </section>
  );
};
