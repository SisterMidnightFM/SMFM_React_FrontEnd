import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { SearchBar } from '../components/search/SearchBar';
import { ContentTypeToggle } from '../components/search/ContentTypeToggle';
import { DateRangePicker } from '../components/search/DateRangePicker';
import { FilterDropdowns } from '../components/search/FilterDropdowns';
import { SearchButton } from '../components/search/SearchButton';
import { SearchResults } from '../components/search/SearchResults';
import { search } from '../services/search';
import { fetchAllTags } from '../services/tags';
import type { SearchFilters, SearchResultItem, ContentType } from '../types/search';
import { defaultSearchFilters } from '../types/search';
import type { TagGenre, TagMoodVibe, TagTheme } from '../types/tag';
import './search.css';

export const Route = createFileRoute('/search')({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>) => {
    return search;
  },
});

function SearchPage() {
  // Local filter state (not synced to URL until search is clicked)
  const [filters, setFilters] = useState<SearchFilters>(defaultSearchFilters);

  // Tag data
  const [genres, setGenres] = useState<TagGenre[]>([]);
  const [moods, setMoods] = useState<TagMoodVibe[]>([]);
  const [themes, setThemes] = useState<TagTheme[]>([]);
  const [tagsLoading, setTagsLoading] = useState(true);

  // Search results
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const PAGE_SIZE = 10;

  // Load tags on mount
  useEffect(() => {
    async function loadTags() {
      try {
        setTagsLoading(true);
        const allTags = await fetchAllTags();
        setGenres(allTags.genres);
        setMoods(allTags.moods);
        setThemes(allTags.themes);
      } catch (err) {
        console.error('Error loading tags:', err);
      } finally {
        setTagsLoading(false);
      }
    }

    loadTags();
  }, []);

  // Perform search
  const handleSearch = async () => {
    try {
      setIsSearching(true);
      setError(null);
      setHasSearched(true);

      const searchResults = await search(filters, 1, PAGE_SIZE);

      setResults(searchResults.items);
      setHasMore(searchResults.hasMore);
      setCurrentPage(1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to perform search'));
    } finally {
      setIsSearching(false);
    }
  };

  // Load more results
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;

      const searchResults = await search(filters, nextPage, PAGE_SIZE);

      setResults((prev) => [...prev, ...searchResults.items]);
      setHasMore(searchResults.hasMore);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error('Error loading more results:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Filter update handlers
  const updateQuery = (query: string) => {
    setFilters({ ...filters, query });
  };

  const clearQuery = () => {
    setFilters({ ...filters, query: '' });
  };

  const updateContentTypes = (contentTypes: ContentType[]) => {
    setFilters({ ...filters, contentTypes });
  };

  const updateDateRange = (dateRange: { start: string | null; end: string | null }) => {
    setFilters({ ...filters, dateRange });
  };

  const clearDateRange = () => {
    setFilters({ ...filters, dateRange: { start: null, end: null } });
  };

  const updateGenres = (genreIds: number[]) => {
    setFilters({ ...filters, genreIds });
  };

  const updateMoods = (moodIds: number[]) => {
    setFilters({ ...filters, moodIds });
  };

  const updateThemes = (themeIds: number[]) => {
    setFilters({ ...filters, themeIds });
  };

  // Show date picker only when Episodes is selected
  const showDatePicker = filters.contentTypes.includes('episodes');

  return (
    <div className="search-page">
      <header className="search-page__header">
        <h1>Search</h1>
        <p>Find episodes, shows, and artists</p>
      </header>

      <div className="search-page__filters">
        {/* Text Search Bar */}
        <div className="search-page__filter-row">
          <SearchBar value={filters.query} onChange={updateQuery} onClear={clearQuery} />
        </div>

        {/* Content Type Toggle */}
        <div className="search-page__filter-row">
          <ContentTypeToggle selectedTypes={filters.contentTypes} onChange={updateContentTypes} />
        </div>

        {/* Date Range Picker (only for Episodes) */}
        {showDatePicker && (
          <div className="search-page__filter-row">
            <DateRangePicker
              dateRange={filters.dateRange}
              onChange={updateDateRange}
              onClear={clearDateRange}
            />
          </div>
        )}

        {/* Tag Filter Dropdowns */}
        <div className="search-page__filter-row">
          <FilterDropdowns
            genres={genres}
            moods={moods}
            themes={themes}
            selectedGenreIds={filters.genreIds}
            selectedMoodIds={filters.moodIds}
            selectedThemeIds={filters.themeIds}
            onGenreChange={updateGenres}
            onMoodChange={updateMoods}
            onThemeChange={updateThemes}
            isLoading={tagsLoading}
          />
        </div>

        {/* Search Button */}
        <div className="search-page__filter-row">
          <SearchButton onClick={handleSearch} isLoading={isSearching} />
        </div>
      </div>

      {/* Search Results */}
      <SearchResults
        results={results}
        isLoading={isSearching}
        isLoadingMore={isLoadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        hasSearched={hasSearched}
      />
    </div>
  );
}
