import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback } from 'react';
import type { SearchFilters, ContentType } from '../types/search';
import { defaultSearchFilters } from '../types/search';

/**
 * Hook to manage search filters in URL query parameters
 * Provides methods to read and update search state from/to URL
 */
export function useSearchParams() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/search' });

  /**
   * Parse search filters from URL query parameters
   */
  const getFiltersFromUrl = useCallback((): SearchFilters => {
    const params = searchParams as any;

    return {
      query: params.q || defaultSearchFilters.query,

      contentTypes: params.types
        ? (params.types as string).split(',').filter((t): t is ContentType =>
            ['episodes', 'shows', 'artists'].includes(t)
          )
        : defaultSearchFilters.contentTypes,

      dateRange: {
        start: params.dateStart || defaultSearchFilters.dateRange.start,
        end: params.dateEnd || defaultSearchFilters.dateRange.end,
      },

      genreIds: params.genres
        ? (params.genres as string).split(',').map(Number).filter((n) => !isNaN(n))
        : defaultSearchFilters.genreIds,

      moodIds: params.moods
        ? (params.moods as string).split(',').map(Number).filter((n) => !isNaN(n))
        : defaultSearchFilters.moodIds,

      themeIds: params.themes
        ? (params.themes as string).split(',').map(Number).filter((n) => !isNaN(n))
        : defaultSearchFilters.themeIds,

      locationIds: params.locations
        ? (params.locations as string).split(',').map(Number).filter((n) => !isNaN(n))
        : defaultSearchFilters.locationIds,
    };
  }, [searchParams]);

  /**
   * Update URL with new search filters
   */
  const setFiltersToUrl = useCallback(
    (filters: SearchFilters) => {
      const params: Record<string, string> = {};

      // Only add non-empty/non-default values to URL
      if (filters.query) {
        params.q = filters.query;
      }

      if (filters.contentTypes.length > 0) {
        params.types = filters.contentTypes.join(',');
      }

      if (filters.dateRange.start) {
        params.dateStart = filters.dateRange.start;
      }

      if (filters.dateRange.end) {
        params.dateEnd = filters.dateRange.end;
      }

      if (filters.genreIds.length > 0) {
        params.genres = filters.genreIds.join(',');
      }

      if (filters.moodIds.length > 0) {
        params.moods = filters.moodIds.join(',');
      }

      if (filters.themeIds.length > 0) {
        params.themes = filters.themeIds.join(',');
      }

      if (filters.locationIds.length > 0) {
        params.locations = filters.locationIds.join(',');
      }

      // Navigate to search route with updated params
      navigate({
        to: '/search',
        search: params,
      });
    },
    [navigate]
  );

  /**
   * Clear all search filters and reset URL
   */
  const clearFilters = useCallback(() => {
    navigate({
      to: '/search',
      search: {},
    });
  }, [navigate]);

  return {
    filters: getFiltersFromUrl(),
    setFilters: setFiltersToUrl,
    clearFilters,
  };
}
