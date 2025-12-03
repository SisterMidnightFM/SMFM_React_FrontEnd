import type { SearchFilters, ContentType } from '../types/search';

/**
 * Build Strapi query URL parameters for searching episodes
 */
export function buildEpisodeSearchQuery(
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 10
): URLSearchParams {
  const params = new URLSearchParams();

  // Populate all relations
  params.append('populate', '*');

  // Pagination
  params.append('pagination[page]', page.toString());
  params.append('pagination[pageSize]', pageSize.toString());

  // Sort by broadcast date (newest first)
  params.append('sort', 'BroadcastDateTime:desc');

  // Increase page size for fuzzy search to have more items to work with
  if (filters.query.trim()) {
    params.set('pagination[pageSize]', '50'); // Get more results for fuzzy matching
  }

  // For fuzzy search: Don't filter by text on server, let client-side fuzzy search handle it
  // This allows fuzzy matching to work on typos and partial matches
  // (Server-side containsi filter would exclude results before fuzzy search sees them)

  // Date range filter (only for episodes)
  if (filters.dateRange.start) {
    params.append('filters[BroadcastDateTime][$gte]', filters.dateRange.start);
  }
  if (filters.dateRange.end) {
    params.append('filters[BroadcastDateTime][$lte]', filters.dateRange.end);
  }

  // Tag filters - using OR logic within each category
  if (filters.genreIds.length > 0) {
    filters.genreIds.forEach((id, index) => {
      params.append(`filters[tag_genres][id][$in][${index}]`, id.toString());
    });
  }

  if (filters.moodIds.length > 0) {
    filters.moodIds.forEach((id, index) => {
      params.append(`filters[tag_mood_vibes][id][$in][${index}]`, id.toString());
    });
  }

  if (filters.themeIds.length > 0) {
    filters.themeIds.forEach((id, index) => {
      params.append(`filters[tag_themes][id][$in][${index}]`, id.toString());
    });
  }

  return params;
}

/**
 * Build Strapi query URL parameters for searching shows
 */
export function buildShowSearchQuery(
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 10
): URLSearchParams {
  const params = new URLSearchParams();

  // Populate all relations
  params.append('populate', '*');

  // Pagination
  params.append('pagination[page]', page.toString());
  params.append('pagination[pageSize]', pageSize.toString());

  // Sort alphabetically
  params.append('sort', 'ShowName:asc');

  // Increase page size for fuzzy search to have more items to work with
  if (filters.query.trim()) {
    params.set('pagination[pageSize]', '50'); // Get more results for fuzzy matching
  }

  // For fuzzy search: Don't filter by text on server, let client-side fuzzy search handle it

  return params;
}

/**
 * Build Strapi query URL parameters for searching artists
 */
export function buildArtistSearchQuery(
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 10
): URLSearchParams {
  const params = new URLSearchParams();

  // Populate all relations
  params.append('populate', '*');

  // Pagination
  params.append('pagination[page]', page.toString());
  params.append('pagination[pageSize]', pageSize.toString());

  // Sort alphabetically
  params.append('sort', 'ArtistName:asc');

  // Increase page size for fuzzy search to have more items to work with
  if (filters.query.trim()) {
    params.set('pagination[pageSize]', '50'); // Get more results for fuzzy matching
  }

  // For fuzzy search: Don't filter by text on server, let client-side fuzzy search handle it

  // Location filter (only for artists)
  if (filters.locationIds.length > 0) {
    filters.locationIds.forEach((id, index) => {
      params.append(`filters[tag_locations][id][$in][${index}]`, id.toString());
    });
  }

  return params;
}

/**
 * Get the appropriate query builder for a content type
 */
export function getQueryBuilder(contentType: ContentType) {
  switch (contentType) {
    case 'episodes':
      return buildEpisodeSearchQuery;
    case 'shows':
      return buildShowSearchQuery;
    case 'artists':
      return buildArtistSearchQuery;
  }
}
