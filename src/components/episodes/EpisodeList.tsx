import { useState, useMemo } from 'react';
import type { Episode } from '../../types/episode';
import { EpisodeCard } from './EpisodeCard';
import { CardGrid } from '../shared/CardGrid';
import './EpisodeList.css';

interface EpisodeListProps {
  episodes: Episode[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  error?: Error | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

type SortMode = 'recent' | 'alphabetical' | 'reverse-alphabetical' | 'random';

export function EpisodeList({
  episodes,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  onLoadMore
}: EpisodeListProps) {
  const [sortMode, setSortMode] = useState<SortMode>('recent');

  // Sort episodes based on the current sort mode
  const sortedEpisodes = useMemo(() => {
    const episodesCopy = [...episodes];

    switch (sortMode) {
      case 'recent':
        return episodesCopy.sort((a, b) => {
          const dateA = new Date(a.BroadcastDateTime).getTime();
          const dateB = new Date(b.BroadcastDateTime).getTime();
          return dateB - dateA; // Most recent first
        });
      case 'alphabetical':
        return episodesCopy.sort((a, b) =>
          a.EpisodeTitle.localeCompare(b.EpisodeTitle)
        );
      case 'reverse-alphabetical':
        return episodesCopy.sort((a, b) =>
          b.EpisodeTitle.localeCompare(a.EpisodeTitle)
        );
      case 'random':
        // Shuffle array using Fisher-Yates algorithm
        for (let i = episodesCopy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [episodesCopy[i], episodesCopy[j]] = [episodesCopy[j], episodesCopy[i]];
        }
        return episodesCopy;
      default:
        return episodesCopy;
    }
  }, [episodes, sortMode]);

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

  if (isLoading && episodes.length === 0) {
    return (
      <div className="episode-list">
        <div className="episode-list__loading">
          <p>Loading episodes...</p>
        </div>
      </div>
    );
  }

  if (error && episodes.length === 0) {
    return (
      <div className="episode-list">
        <div className="episode-list__error">
          <h3>Error loading episodes</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="episode-list">
        <div className="episode-list__empty">
          <p>No episodes found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="episode-list">
      {/* Sort Controls */}
      <div className="episode-list__controls">
        <button
          onClick={handleRecentClick}
          className={`episode-list__sort-btn ${sortMode === 'recent' ? 'episode-list__sort-btn--active' : ''}`}
          aria-label="Sort by most recent broadcast"
          title="Sort by most recent broadcast"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        </button>
        <button
          onClick={handleAlphabeticalClick}
          className={`episode-list__sort-btn ${sortMode !== 'random' && sortMode !== 'recent' ? 'episode-list__sort-btn--active' : ''}`}
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
          className={`episode-list__sort-btn ${sortMode === 'random' ? 'episode-list__sort-btn--active' : ''}`}
          aria-label="Shuffle episodes"
          title="Shuffle episodes"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        </button>
      </div>

      {/* Responsive Grid */}
      <CardGrid>
        {sortedEpisodes.map((episode) => (
          <EpisodeCard key={episode.id} episode={episode} />
        ))}
      </CardGrid>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="episode-list__load-more">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="episode-list__load-more-btn"
          >
            {isLoadingMore ? 'Loading...' : 'Load More Episodes'}
          </button>
        </div>
      )}

      {/* Loading indicator for load more */}
      {isLoadingMore && (
        <div className="episode-list__loading-more">
          <p>Loading more episodes...</p>
        </div>
      )}
    </div>
  );
}
