import type { SearchFilters } from '../types/search';
import type { Episode } from '../types/episode';
import type { Show } from '../types/show';
import type { Artist } from '../types/artist';
import { extractRichText } from './cardHelpers';

/**
 * Calculate relevance score for an episode based on search filters.
 * Higher score = more criteria matched.
 */
export function calculateEpisodeRelevance(
  episode: Episode,
  filters: SearchFilters
): number {
  let score = 0;

  // Text search matches (highest weight)
  if (filters.query.trim()) {
    const query = filters.query.toLowerCase();
    const title = episode.EpisodeTitle?.toLowerCase() || '';
    const description = episode.EpisodeDescription?.toLowerCase() || '';
    const showName = episode.link_episode_to_show?.ShowName?.toLowerCase() || '';

    if (title.includes(query)) score += 10;
    if (description.includes(query)) score += 5;
    if (showName.includes(query)) score += 8;
  }

  // Genre tag matches
  if (filters.genreIds.length > 0 && episode.tag_genres) {
    const episodeGenreIds = episode.tag_genres.map((g) => g.id);
    const matchCount = filters.genreIds.filter((id) =>
      episodeGenreIds.includes(id)
    ).length;
    score += matchCount * 3;
  }

  // Mood tag matches
  if (filters.moodIds.length > 0 && episode.tag_mood_vibes) {
    const episodeMoodIds = episode.tag_mood_vibes.map((m) => m.id);
    const matchCount = filters.moodIds.filter((id) =>
      episodeMoodIds.includes(id)
    ).length;
    score += matchCount * 3;
  }

  // Theme tag matches
  if (filters.themeIds.length > 0 && episode.tag_themes) {
    const episodeThemeIds = episode.tag_themes.map((t) => t.id);
    const matchCount = filters.themeIds.filter((id) =>
      episodeThemeIds.includes(id)
    ).length;
    score += matchCount * 3;
  }

  // Date range match (binary - either in range or not)
  if (filters.dateRange.start || filters.dateRange.end) {
    const broadcastDate = new Date(episode.BroadcastDateTime);
    const inRange =
      (!filters.dateRange.start || broadcastDate >= new Date(filters.dateRange.start)) &&
      (!filters.dateRange.end || broadcastDate <= new Date(filters.dateRange.end));

    if (inRange) score += 2;
  }

  return score;
}

/**
 * Calculate relevance score for a show based on search filters.
 * Higher score = more criteria matched.
 */
export function calculateShowRelevance(
  show: Show,
  filters: SearchFilters
): number {
  let score = 0;

  // Text search matches (highest weight)
  if (filters.query.trim()) {
    const query = filters.query.toLowerCase();
    const name = show.ShowName?.toLowerCase() || '';
    const description = extractRichText(show.ShowDescription).toLowerCase();

    if (name.includes(query)) score += 10;
    if (description.includes(query)) score += 5;
  }

  return score;
}

/**
 * Calculate relevance score for an artist based on search filters.
 * Higher score = more criteria matched.
 */
export function calculateArtistRelevance(
  artist: Artist,
  filters: SearchFilters
): number {
  let score = 0;

  // Text search matches (highest weight)
  if (filters.query.trim()) {
    const query = filters.query.toLowerCase();
    const name = artist.ArtistName?.toLowerCase() || '';
    const bio = artist.ArtistBio?.toLowerCase() || '';

    if (name.includes(query)) score += 10;
    if (bio.includes(query)) score += 5;
  }

  // Location tag matches
  if (filters.locationIds.length > 0 && artist.tag_locations) {
    const artistLocationIds = artist.tag_locations.map((l) => l.id);
    const matchCount = filters.locationIds.filter((id) =>
      artistLocationIds.includes(id)
    ).length;
    score += matchCount * 3;
  }

  return score;
}
