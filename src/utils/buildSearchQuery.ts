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

  // Build OR filters array for text search
  const orFilters: string[] = [];

  // Text search: ShowName, EpisodeTitle, EpisodeDescription
  if (filters.query.trim()) {
    const searchText = filters.query.trim();
    orFilters.push(`filters[$or][0][EpisodeTitle][$containsi]=${encodeURIComponent(searchText)}`);
    orFilters.push(`filters[$or][1][EpisodeDescription][$containsi]=${encodeURIComponent(searchText)}`);
    orFilters.push(`filters[$or][2][link_episode_to_show][ShowName][$containsi]=${encodeURIComponent(searchText)}`);
  }

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

  // Add OR filters to params
  orFilters.forEach((filter) => {
    const [key, value] = filter.split('=');
    params.append(key, decodeURIComponent(value));
  });

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

  // Build OR filters array for text search
  const orFilters: string[] = [];

  // Text search: ShowName, ShowDescription
  if (filters.query.trim()) {
    const searchText = filters.query.trim();
    orFilters.push(`filters[$or][0][ShowName][$containsi]=${encodeURIComponent(searchText)}`);
    orFilters.push(`filters[$or][1][ShowDescription][$containsi]=${encodeURIComponent(searchText)}`);
  }

  // Add OR filters to params
  orFilters.forEach((filter) => {
    const [key, value] = filter.split('=');
    params.append(key, decodeURIComponent(value));
  });

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

  // Build OR filters array for text search
  const orFilters: string[] = [];

  // Text search: ArtistName, ArtistBio
  if (filters.query.trim()) {
    const searchText = filters.query.trim();
    orFilters.push(`filters[$or][0][ArtistName][$containsi]=${encodeURIComponent(searchText)}`);
    orFilters.push(`filters[$or][1][ArtistBio][$containsi]=${encodeURIComponent(searchText)}`);
  }

  // Location filter (only for artists)
  if (filters.locationIds.length > 0) {
    filters.locationIds.forEach((id, index) => {
      params.append(`filters[tag_locations][id][$in][${index}]`, id.toString());
    });
  }

  // Add OR filters to params
  orFilters.forEach((filter) => {
    const [key, value] = filter.split('=');
    params.append(key, decodeURIComponent(value));
  });

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
