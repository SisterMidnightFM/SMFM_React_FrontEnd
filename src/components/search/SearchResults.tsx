import type { SearchResultItem } from '../../types/search';
import type { Episode } from '../../types/episode';
import type { Show } from '../../types/show';
import type { Artist } from '../../types/artist';
import { EpisodeCard } from '../episodes/EpisodeCard';
import { ShowCard } from '../shows/ShowCard';
import { ArtistCard } from '../artists/ArtistCard';
import { CardGrid } from '../shared/CardGrid';
import './SearchResults.css';

interface SearchResultsProps {
  results: SearchResultItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  onLoadMore: () => void;
  hasSearched: boolean;
}

export function SearchResults({
  results,
  isLoading,
  isLoadingMore,
  error,
  hasMore,
  onLoadMore,
  hasSearched,
}: SearchResultsProps) {
  // Empty state - no search performed yet
  if (!hasSearched && !isLoading) {
    return (
      <div className="search-results">
        <div className="search-results__empty">
          <p>Enter your search criteria and click Search to find episodes, shows, and artists.</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="search-results">
        <div className="search-results__loading">Searching...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="search-results">
        <div className="search-results__error">
          <p>Error: {error.message}</p>
          <p>Please try again.</p>
        </div>
      </div>
    );
  }

  // No results found
  if (results.length === 0) {
    return (
      <div className="search-results">
        <div className="search-results__empty">
          <p>No results found matching your search criteria.</p>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      </div>
    );
  }

  // Results found
  return (
    <div className="search-results">
      <div className="search-results__header">
        <h2 className="search-results__title">
          {results.length} {results.length === 1 ? 'Result' : 'Results'} Found
        </h2>
      </div>

      <CardGrid>
        {results.map((result, index) => {
          switch (result.type) {
            case 'episodes':
              return <EpisodeCard key={`episode-${(result.data as Episode).id}-${index}`} episode={result.data as Episode} />;
            case 'shows':
              return <ShowCard key={`show-${(result.data as Show).id}-${index}`} show={result.data as Show} />;
            case 'artists':
              return <ArtistCard key={`artist-${(result.data as Artist).id}-${index}`} artist={result.data as Artist} />;
            default:
              return null;
          }
        })}
      </CardGrid>

      {hasMore && (
        <div className="search-results__load-more">
          <button
            className="search-results__load-more-button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
