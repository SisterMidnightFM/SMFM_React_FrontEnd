import Fuse, { type IFuseOptions } from 'fuse.js';
import type { Episode } from '../types/episode';
import type { Show } from '../types/show';
import type { Artist } from '../types/artist';

/**
 * Fuzzy search configuration for episodes
 */
const episodeSearchOptions: IFuseOptions<Episode> = {
  includeScore: true,
  threshold: 0.4, // 0.0 = perfect match, 1.0 = match anything
  keys: [
    { name: 'EpisodeTitle', weight: 2 },
    { name: 'EpisodeDescription', weight: 1 },
    { name: 'link_episode_to_show.ShowName', weight: 1.5 },
  ],
};

/**
 * Fuzzy search configuration for shows
 */
const showSearchOptions: IFuseOptions<Show> = {
  includeScore: true,
  threshold: 0.6,
  keys: [
    { name: 'ShowName', weight: 2 },
    { name: 'ShowDescription', weight: 1 },
  ],
};

/**
 * Fuzzy search configuration for artists
 */
const artistSearchOptions: IFuseOptions<Artist> = {
  includeScore: true,
  threshold: 0.6,
  keys: [
    { name: 'ArtistName', weight: 2 },
    { name: 'ArtistBio', weight: 1 },
  ],
};

/**
 * Perform fuzzy search on episodes
 */
export function fuzzySearchEpisodes(episodes: Episode[], query: string): Episode[] {
  if (!query.trim()) {
    return episodes;
  }

  const fuse = new Fuse(episodes, episodeSearchOptions);
  const results = fuse.search(query);
  return results.map(result => result.item);
}

/**
 * Perform fuzzy search on shows
 */
export function fuzzySearchShows(shows: Show[], query: string): Show[] {
  if (!query.trim()) {
    return shows;
  }

  const fuse = new Fuse(shows, showSearchOptions);
  const results = fuse.search(query);
  return results.map(result => result.item);
}

/**
 * Perform fuzzy search on artists
 */
export function fuzzySearchArtists(artists: Artist[], query: string): Artist[] {
  if (!query.trim()) {
    return artists;
  }

  const fuse = new Fuse(artists, artistSearchOptions);
  const results = fuse.search(query);
  return results.map(result => result.item);
}

/**
 * Calculate fuzzy match score for an item (0-100, higher is better)
 */
export function calculateFuzzyScore<T>(item: T, query: string, options: IFuseOptions<T>): number {
  if (!query.trim()) {
    return 50; // Neutral score when no query
  }

  const fuse = new Fuse([item], options);
  const results = fuse.search(query);

  if (results.length === 0) {
    return 0; // No match
  }

  // Convert Fuse score (0 = perfect, 1 = worst) to percentage (100 = perfect, 0 = worst)
  const fuseScore = results[0].score ?? 1;
  return Math.round((1 - fuseScore) * 100);
}
