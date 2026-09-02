import { useState, useMemo } from 'react';
import type { Artist } from '../../types/artist';
import { ArtistCard } from './ArtistCard';
import { CardGrid } from '../shared/CardGrid';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useShuffledCollection } from '../../hooks/useShuffledCollection';
import { fetchArtistsByIds } from '../../services/artists';
import './ArtistList.css';

interface ArtistListProps {
  artists: Artist[];
  isLoading?: boolean;
  isLoadingMore?: boolean;
  error?: Error | null;
  hasMore?: boolean;
  onLoadMore?: () => void;
  /**
   * Shuffle across the whole artist catalogue rather than only the artists
   * already paged in. Off for filtered lists (e.g. residents), where the
   * catalogue isn't what's on screen.
   */
  catalogueShuffle?: boolean;
}

type SortMode = 'alphabetical' | 'reverse-alphabetical' | 'random';

export function ArtistList({
  artists,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  onLoadMore,
  catalogueShuffle = false
}: ArtistListProps) {
  const [sortMode, setSortMode] = useState<SortMode>('alphabetical');
  const [shuffleSeed, setShuffleSeed] = useState(() => Date.now());

  // A shuffle of the full catalogue, paged in as the user scrolls
  const isCatalogueShuffle = catalogueShuffle && sortMode === 'random';
  const shuffled = useShuffledCollection<Artist>('artists', {
    enabled: isCatalogueShuffle,
    seed: shuffleSeed,
    fetchByIds: fetchArtistsByIds,
  });

  const sourceArtists = isCatalogueShuffle ? shuffled.items : artists;
  const listIsLoading = isCatalogueShuffle ? shuffled.isLoading : isLoading;
  const listIsLoadingMore = isCatalogueShuffle ? shuffled.isLoadingMore : isLoadingMore;
  const listError = isCatalogueShuffle ? shuffled.error : error;
  const listHasMore = isCatalogueShuffle ? shuffled.hasMore : hasMore;
  const listLoadMore = isCatalogueShuffle ? shuffled.fetchNextPage : onLoadMore;

  const sentinelRef = useInfiniteScroll(listLoadMore, listIsLoadingMore || false, listHasMore || false);

  // Sort artists based on the current sort mode
  const sortedArtists = useMemo(() => {
    const artistsCopy = [...sourceArtists];

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
        // A catalogue shuffle already arrives in random order
        if (isCatalogueShuffle) return artistsCopy;
        // Otherwise shuffle what's on screen, using Fisher-Yates
        for (let i = artistsCopy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [artistsCopy[i], artistsCopy[j]] = [artistsCopy[j], artistsCopy[i]];
        }
        return artistsCopy;
      default:
        return artistsCopy;
    }
    // shuffleSeed so a second click on shuffle reorders an on-screen shuffle too
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceArtists, sortMode, isCatalogueShuffle, shuffleSeed]);

  const handleAlphabeticalClick = () => {
    if (sortMode === 'alphabetical') {
      setSortMode('reverse-alphabetical');
    } else {
      setSortMode('alphabetical');
    }
  };

  const handleRandomClick = () => {
    // Clicking shuffle again draws a fresh selection rather than doing nothing
    setShuffleSeed((seed) => seed + 1);
    setSortMode('random');
  };

  if (listIsLoading && sortedArtists.length === 0) {
    return (
      <div className="artist-list">
        <div className="artist-list__loading">
          <p>Loading artists...</p>
        </div>
      </div>
    );
  }

  if (listError && sortedArtists.length === 0) {
    return (
      <div className="artist-list">
        <div className="artist-list__error">
          <h3>Error loading artists</h3>
          <p>{listError.message}</p>
        </div>
      </div>
    );
  }

  if (sortedArtists.length === 0) {
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

      {/* Infinite scroll sentinel */}
      {listHasMore && listLoadMore && (
        <div ref={sentinelRef} className="artist-list__sentinel" aria-hidden="true" />
      )}

      {/* Loading indicator for load more */}
      {listIsLoadingMore && (
        <div className="artist-list__loading-more">
          <p>Loading more artists...</p>
        </div>
      )}
    </div>
  );
}
