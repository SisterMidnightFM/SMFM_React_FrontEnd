import React, { useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { ArtistCard } from '../artists/ArtistCard';
import { SeeMoreCard } from './SeeMoreCard';
import { useResidentArtists } from '../../hooks/useResidentArtists';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { Artist } from '../../types/artist';
import './HomeSection.css';

/**
 * Fisher-Yates shuffle - returns a new array, leaves the query cache untouched
 */
function shuffle(artists: Artist[]): Artist[] {
  const shuffled = [...artists];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const Residents: React.FC = () => {
  const { data: artists, isLoading, error } = useResidentArtists();

  const isMin768 = useMediaQuery('(min-width: 768px)');
  const isMin1200 = useMediaQuery('(min-width: 1200px)');
  const isMin1600 = useMediaQuery('(min-width: 1600px)');

  const visibleCount = !isMin768 ? 6 : !isMin1200 ? 8 : !isMin1600 ? 10 : 12;

  // Randomise once per set of residents so the order stays put while the
  // section is on screen (resizing across a breakpoint won't reshuffle it)
  const randomisedArtists = useMemo(() => shuffle(artists ?? []), [artists]);

  return (
    <section className="home-section">
      <div className="home-section__header">
        <img src="/Images/Star1_Dark.webp" alt="" className="home-section__icon" />
        <Link to="/residents" className="home-section__title-link">
          <h2 className="home-section__title">RESIDENTS</h2>
        </Link>
      </div>
      <div className="home-section__cards home-section__cards--scrollable">
        {isLoading && <p>Loading residents...</p>}
        {error && <p className="error">{error.message}</p>}
        {!isLoading && !error && randomisedArtists.slice(0, visibleCount).map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
          />
        ))}
        {!isLoading && !error && randomisedArtists.length > 0 && (
          <SeeMoreCard to="/residents" ariaLabel="See more residents" />
        )}
      </div>
    </section>
  );
};
