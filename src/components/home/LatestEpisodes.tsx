import React from 'react';
import { Link } from '@tanstack/react-router';
import { LatestShowCard } from './LatestShowCard';
import { useEpisodes } from '../../hooks/useEpisodes';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import './HomeSection.css';

export const LatestEpisodes: React.FC = () => {
  const { episodes, isLoading, error } = useEpisodes();

  const isMin480 = useMediaQuery('(min-width: 480px)');
  const isMin768 = useMediaQuery('(min-width: 768px)');
  const isMin1200 = useMediaQuery('(min-width: 1200px)');
  const isMin1600 = useMediaQuery('(min-width: 1600px)');

  const visibleCount = !isMin480 ? 10 : !isMin768 ? 12 : !isMin1200 ? 15 : !isMin1600 ? 20 : 30;

  return (
    <section className="home-section">
      <div className="home-section__header">
        <img src="/Images/Moon_Dark.webp" alt="" className="home-section__icon" />
        <Link to="/episodes" className="home-section__title-link">
          <h2 className="home-section__title">LATEST EPISODES</h2>
        </Link>
      </div>
      <div className="home-section__cards home-section__cards--scrollable">
        {isLoading && <p>Loading episodes...</p>}
        {error && <p className="error">{error.message}</p>}
        {!isLoading && !error && episodes.slice(0, visibleCount).map((episode) => (
          <LatestShowCard
            key={episode.id}
            episode={episode}
          />
        ))}
      </div>
    </section>
  );
};
