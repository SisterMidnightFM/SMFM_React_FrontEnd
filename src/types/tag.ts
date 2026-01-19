/**
 * Tag type definitions for episodes
 */

import type { StrapiTimestamps } from './strapi';

// Genre tags
export interface TagGenre extends StrapiTimestamps {
  id: number;
  Genre: string; // e.g., "bass", "Club", "Breakbeat", "House", "Techno", "Jazz", "Spiritual", "Baile Funk"
}

// Theme tags
export interface TagTheme extends StrapiTimestamps {
  id: number;
  Theme: string; // e.g., "Politics", "Culture", etc.
}

// Location tags (for artists)
export interface TagLocation extends StrapiTimestamps {
  id: number;
  Location: string; // e.g., "London", "Berlin", "Tokyo"
}


// Combined tag interface for episodes
export interface EpisodeTags {
  tag_genres?: TagGenre[];
  tag_themes?: TagTheme[];
}
