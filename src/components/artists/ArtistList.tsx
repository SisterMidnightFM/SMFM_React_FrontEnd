import { useState, useMemo } from 'react';
import type { Artist } from '../../types/artist';
import { ArtistCard } from './ArtistCard';
import { CardGrid } from '../shared/CardGrid';
import './ArtistList.css';

interface ArtistListProps {
  artists: Artist[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  error?: Error | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

type SortMode = 'alphabetical' | 'reverse-alphabetical' | 'random';

export function ArtistList({
  artists,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  onLoadMore
}: ArtistListProps) {
  const [sortMode, setSortMode] = useState<SortMode>('alphabetical');

  // Sort artists based on the current sort mode
  const sortedArtists = useMemo(() => {
    const artistsCopy = [...artists];

    switch (sortMode) {
      case 'alphabetical':
        return artistsCopy.sort((a, b) =>
          a.ArtistName.localeCompare(b.ArtistName)
        );
      case 'reverse-alphabetical':
        return artistsCopy.sort((a, b) =>
          b.ArtistName.localeCompare(a.ArtistName)
        );
      case 'random':
        // Shuffle array using Fisher-Yates algorithm
        for (let i = artistsCopy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [artistsCopy[i], artistsCopy[j]] = [artistsCopy[j], artistsCopy[i]];
        }
        return artistsCopy;
      default:
        return artistsCopy;
    }
  }, [artists, sortMode]);

  const handleAlphabeticalClick = () => {
    if (sortMode === 'alphabetical') {
      setSortMode('reverse-alphabetical');
    } else {
      setSortMode('alphabetical');
    }
  };

  const handleRandomClick = () => {
    setSortMode('random');
  };

  if (isLoading && artists.length === 0) {
    return (
      <div className="artist-list">
        <div className="artist-list__loading">
          <p>Loading artists...</p>
        </div>
      </div>
    );
  }

  if (error && artists.length === 0) {
    return (
      <div className="artist-list">
        <div className="artist-list__error">
          <h3>Error loading artists</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className="artist-list">
        <div className="artist-list__empty">
          <p>No artists found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="artist-list">
      {/* Sort Controls */}
      <div className="artist-list__controls">
        <button
          onClick={handleAlphabeticalClick}
          className={`artist-list__sort-btn ${sortMode !== 'random' ? 'artist-list__sort-btn--active' : ''}`}
          aria-label={sortMode === 'alphabetical' ? 'Sort Z to A' : 'Sort A to Z'}
          title={sortMode === 'alphabetical' ? 'Sort Z to A' : 'Sort A to Z'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            {sortMode === 'reverse-alphabetical' ? (
              // Z to A icon (reverse)
              <path d="M3 3h18v2H3V3zm0 8h12v2H3v-2zm0 8h18v2H3v-2zm18-4l-4-4v3h-4v2h4v3l4-4z"/>
            ) : (
              // A to Z icon
              <path d="M3 3h18v2H3V3zm0 8h12v2H3v-2zm0 8h18v2H3v-2zm16-4V9l-4 4h3v4h2v-4h3l-4-4z"/>
            )}
          </svg>
        </button>
        <button
          onClick={handleRandomClick}
          className={`artist-list__sort-btn ${sortMode === 'random' ? 'artist-list__sort-btn--active' : ''}`}
          aria-label="Shuffle artists"
          title="Shuffle artists"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        </button>
      </div>

      {/* Responsive Grid */}
      <CardGrid>
        {sortedArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </CardGrid>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="artist-list__load-more">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="artist-list__load-more-btn"
          >
            {isLoadingMore ? 'Loading...' : 'Load More Artists'}
          </button>
        </div>
      )}

      {/* Loading indicator for load more */}
      {isLoadingMore && (
        <div className="artist-list__loading-more">
          <p>Loading more artists...</p>
        </div>
      )}
    </div>
  );
}
