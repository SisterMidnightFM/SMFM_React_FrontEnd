import React, { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { LatestShowCard } from './LatestShowCard';
import { fetchEpisodes } from '../../services/episodes';
import type { Episode } from '../../types/episode';
import './HomeSection.css';

export const LatestEpisodes: React.FC = () => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    async function loadEpisodes() {
      try {
        setIsLoading(true);
        const { episodes: data } = await fetchEpisodes(1, 30);
        setEpisodes(data);
      } catch (err) {
        console.error('Failed to load latest episodes:', err);
        setError('Failed to load episodes');
      } finally {
        setIsLoading(false);
      }
    }

    loadEpisodes();
  }, []);

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
        {error && <p className="error">{error}</p>}
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
