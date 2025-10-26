import type { Episode } from './episode';
import type { Show } from './show';
import type { Artist } from './artist';

// Content types that can be searched
export type ContentType = 'episodes' | 'shows' | 'artists';

// Date range for filtering episodes
export interface DateRange {
  start: string | null; // ISO date string
  end: string | null; // ISO date string
}

// All possible search filters
export interface SearchFilters {
  // Text search
  query: string;

  // Content type toggles
  contentTypes: ContentType[];

  // Date range (only for episodes)
  dateRange: DateRange;

  // Tag filters (multi-select)
  genreIds: number[];
  moodIds: number[];
  themeIds: number[];
  locationIds: number[];
}

// Search result item with relevance score
export interface SearchResultItem {
  type: ContentType;
  data: Episode | Show | Artist;
  relevanceScore: number; // Higher = more criteria matched
}

// Paginated search results
export interface SearchResults {
  items: SearchResultItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Default/empty search filters
export const defaultSearchFilters: SearchFilters = {
  query: '',
  contentTypes: ['episodes'],
  dateRange: {
    start: null,
    end: null,
  },
  genreIds: [],
  moodIds: [],
  themeIds: [],
  locationIds: [],
};
