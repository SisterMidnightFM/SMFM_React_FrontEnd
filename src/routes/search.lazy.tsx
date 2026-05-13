import { createLazyFileRoute } from '@tanstack/react-router';
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

export const Route = createLazyFileRoute('/search')({
  component: SearchPage,
});

function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>(defaultSearchFilters);
  const [hasSearched, setHasSearched] = useState(false);

  const { data: tagsData, isLoading: tagsLoading } = useTags();
  const genres = tagsData?.genres ?? [];
  const themes = tagsData?.themes ?? [];

  const { data: searchData, isLoading: isSearching, error } = useSearch(filters, hasSearched);
  const results = searchData?.items ?? [];
  const hasMore = searchData?.hasMore ?? false;
  const isLoadingMore = false;

  const handleSearch = () => {
    setHasSearched(true);
  };

  const handleLoadMore = () => {
    console.log('Load more search results - would need infinite query implementation');
  };

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

  const updateThemes = (themeIds: number[]) => {
    setFilters({ ...filters, themeIds });
  };

  const showDatePicker = filters.contentTypes.includes('episodes');

  return (
    <div className="search-page">
      <PageHeader
        title="Search"
        subtitle="Find episodes, shows, and artists"
        iconSrc="/Images/Hand1_Dark.webp"
      />

      <div className="search-page__filters">
        <div className="search-page__filter-row">
          <SearchBar value={filters.query} onChange={updateQuery} onClear={clearQuery} onSearch={handleSearch} />
        </div>

        <div className="search-page__filter-row">
          <ContentTypeToggle selectedTypes={filters.contentTypes} onChange={updateContentTypes} />
        </div>

        {showDatePicker && (
          <div className="search-page__filter-row">
            <DateRangePicker
              dateRange={filters.dateRange}
              onChange={updateDateRange}
              onClear={clearDateRange}
            />
          </div>
        )}

        <div className="search-page__filter-row">
          <FilterDropdowns
            genres={genres}
            themes={themes}
            selectedGenreIds={filters.genreIds}
            selectedThemeIds={filters.themeIds}
            onGenreChange={updateGenres}
            onThemeChange={updateThemes}
            isLoading={tagsLoading}
          />
        </div>

        <div className="search-page__filter-row">
          <SearchButton onClick={handleSearch} isLoading={isSearching} />
        </div>

        <div className="search-page__filter-row">
          <LuckyDipButton>
            Lucky Dip
          </LuckyDipButton>
        </div>
      </div>

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
