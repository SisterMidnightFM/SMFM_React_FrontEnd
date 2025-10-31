import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { LatestShowCard } from './LatestShowCard';
import { useEpisodes } from '../../hooks/useEpisodes';
import './HomeSection.css';

export const LatestEpisodes: React.FC = () => {
  const { episodes, isLoading, error } = useEpisodes();
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    function updateVisibleCount() {
      const width = window.innerWidth;
      if (width < 480) {
        setVisibleCount(10);
      } else if (width < 768) {
        setVisibleCount(12);
      } else if (width < 1200) {
        setVisibleCount(15);
      } else if (width < 1600) {
        setVisibleCount(20);
      } else {
        setVisibleCount(30);
      }
    }

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

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
