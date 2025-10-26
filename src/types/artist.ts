/**
 * Artist type definitions
 */

import type { StrapiTimestamps, StrapiImage } from './strapi';
import type { Show } from './show';
import type { Episode } from './episode';
import type { News } from './news';
import type { TagLocation } from './tag';

export interface Artist extends StrapiTimestamps {
  id: number;

  // Basic info
  ArtistName: string;
  Artist_Slug: string;
  ArtistBio: string | null;

  // Social & web presence
  ArtistInstagram: string | null;
  ArtistWebsite: string | null;

  // Media
  ArtistImage?: StrapiImage;

  // Relations
  Main_host?: Show[]; // Shows where this artist is the main host
  episodes_guest_featured?: Episode[]; // Episodes where this artist is a guest
  tag_locations?: TagLocation[]; // Location tags for the artist
  blogs_written?: News[]; // Blog posts written by the artist
}

// Simplified artist reference (for use in relations)
export interface ArtistReference {
  id: number;
  ArtistName: string;
  Artist_Slug: string;
  ArtistInstagram: string | null;
  ArtistImage?: Pick<StrapiImage, 'id' | 'url' | 'formats' | 'alternativeText'>;
}
