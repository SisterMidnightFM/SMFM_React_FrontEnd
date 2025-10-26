import { useState, useMemo } from 'react';
import type { Show } from '../../types/show';
import { ShowCard } from './ShowCard';
import { CardGrid } from '../shared/CardGrid';
import './ShowList.css';

interface ShowListProps {
  shows: Show[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  error?: Error | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

type SortMode = 'recent' | 'alphabetical' | 'reverse-alphabetical' | 'random';

export function ShowList({
  shows,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  onLoadMore
}: ShowListProps) {
  const [sortMode, setSortMode] = useState<SortMode>('recent');

  // Helper function to get the most recent episode date for a show
  const getMostRecentEpisodeDate = (show: Show): number => {
    if (!show.Show_Episodes || show.Show_Episodes.length === 0) {
      return 0; // Shows without episodes go to the end
    }

    const dates = show.Show_Episodes
      .map(ep => new Date(ep.BroadcastDateTime).getTime())
      .filter(time => !isNaN(time));

    return dates.length > 0 ? Math.max(...dates) : 0;
  };

  // Sort shows based on the current sort mode
  const sortedShows = useMemo(() => {
    const showsCopy = [...shows];

    switch (sortMode) {
      case 'recent':
        return showsCopy.sort((a, b) => {
          const dateA = getMostRecentEpisodeDate(a);
          const dateB = getMostRecentEpisodeDate(b);
          return dateB - dateA; // Most recent first
        });
      case 'alphabetical':
        return showsCopy.sort((a, b) =>
          a.ShowName.localeCompare(b.ShowName)
        );
      case 'reverse-alphabetical':
        return showsCopy.sort((a, b) =>
          b.ShowName.localeCompare(a.ShowName)
        );
      case 'random':
        // Shuffle array using Fisher-Yates algorithm
        for (let i = showsCopy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [showsCopy[i], showsCopy[j]] = [showsCopy[j], showsCopy[i]];
        }
        return showsCopy;
      default:
        return showsCopy;
    }
  }, [shows, sortMode]);

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

  const handleRecentClick = () => {
    setSortMode('recent');
  };

  if (isLoading && shows.length === 0) {
    return (
      <div className="show-list">
        <div className="show-list__loading">
          <p>Loading shows...</p>
        </div>
      </div>
    );
  }

  if (error && shows.length === 0) {
    return (
      <div className="show-list">
        <div className="show-list__error">
          <h3>Error loading shows</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (shows.length === 0) {
    return (
      <div className="show-list">
        <div className="show-list__empty">
          <p>No shows found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="show-list">
      {/* Sort Controls */}
      <div className="show-list__controls">
        <button
          onClick={handleRecentClick}
          className={`show-list__sort-btn ${sortMode === 'recent' ? 'show-list__sort-btn--active' : ''}`}
          aria-label="Sort by most recent broadcast"
          title="Sort by most recent broadcast"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        </button>
        <button
          onClick={handleAlphabeticalClick}
          className={`show-list__sort-btn ${sortMode !== 'random' && sortMode !== 'recent' ? 'show-list__sort-btn--active' : ''}`}
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
          className={`show-list__sort-btn ${sortMode === 'random' ? 'show-list__sort-btn--active' : ''}`}
          aria-label="Shuffle shows"
          title="Shuffle shows"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        </button>
      </div>

      {/* Responsive Grid */}
      <CardGrid>
        {sortedShows.map((show) => (
          <ShowCard key={show.id} show={show} />
        ))}
      </CardGrid>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="show-list__load-more">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="show-list__load-more-btn"
          >
            {isLoadingMore ? 'Loading...' : 'Load More Shows'}
          </button>
        </div>
      )}

      {/* Loading indicator for load more */}
      {isLoadingMore && (
        <div className="show-list__loading-more">
          <p>Loading more shows...</p>
        </div>
      )}
    </div>
  );
}
