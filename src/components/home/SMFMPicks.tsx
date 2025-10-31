import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { EpisodeCard } from '../episodes/EpisodeCard';
import { useStaffPicks } from '../../hooks/useStaffPicks';
import './HomeSection.css';

export const SMFMPicks: React.FC = () => {
  const { data: episodes, isLoading, error } = useStaffPicks();
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    function updateVisibleCount() {
      const width = window.innerWidth;
      if (width < 768) {
        setVisibleCount(6);
      } else if (width < 1200) {
        setVisibleCount(8);
      } else if (width < 1600) {
        setVisibleCount(10);
      } else {
        setVisibleCount(12);
      }
    }

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

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
