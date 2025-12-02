import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { SearchBar } from '../components/search/SearchBar';
import { ContentTypeToggle } from '../components/search/ContentTypeToggle';
import { DateRangePicker } from '../components/search/DateRangePicker';
import { FilterDropdowns } from '../components/search/FilterDropdowns';
import { SearchButton } from '../components/search/SearchButton';
import { SearchResults } from '../components/search/SearchResults';
import { LuckyDipButton } from '../components/search/LuckyDipButton';
import { PageHeader } from '../components/shared/PageHeader';
import { useTags } from '../hooks/useTags';
import { useSearch } from '../hooks/useSearch';
import type { SearchFilters, ContentType } from '../types/search';
import { defaultSearchFilters } from '../types/search';
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
  const [hasSearched, setHasSearched] = useState(false);

  // Load tags using TanStack Query
  const { data: tagsData, isLoading: tagsLoading } = useTags();
  const genres = tagsData?.genres ?? [];
  const moods = tagsData?.moods ?? [];
  const themes = tagsData?.themes ?? [];

  // Search query (only runs when hasSearched is true)
  const { data: searchData, isLoading: isSearching, error } = useSearch(filters, hasSearched);
  const results = searchData?.items ?? [];
  const hasMore = searchData?.hasMore ?? false;
  const isLoadingMore = false; // Simplified for now - would need infinite query for full support

  // Perform search
  const handleSearch = () => {
    setHasSearched(true);
  };

  // Note: Load More is simplified - would need useInfiniteQuery for full pagination support
  const handleLoadMore = () => {
    console.log('Load more search results - would need infinite query implementation');
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
      <PageHeader
        title="Search"
        subtitle="Find episodes, shows, and artists"
        iconSrc="/Images/Hand1_Dark.webp"
      />

      <div className="search-page__filters">
        {/* Text Search Bar */}
        <div className="search-page__filter-row">
          <SearchBar value={filters.query} onChange={updateQuery} onClear={clearQuery} onSearch={handleSearch} />
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

        {/* Lucky Dip Button */}
        <div className="search-page__filter-row">
          <LuckyDipButton>
            Lucky Dip
          </LuckyDipButton>
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
