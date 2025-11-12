/**
 * Episode type definitions
 */

import type { StrapiTimestamps, StrapiImage, StrapiRichText } from './strapi';
import type { ShowReference } from './show';
import type { ArtistReference } from './artist';
import type { TagGenre, TagMoodVibe, TagTheme } from './tag';

export interface TrackListItem {
  id: number;
  Artist: string;
  Track_Title: string;
}

export interface Episode extends StrapiTimestamps {
  id: number;

  // Basic info
  EpisodeTitle: string;
  EpisodeSlug: string;
  EpisodeDescription: string | null;
  BroadcastDateTime: string; // ISO datetime string

  // Content
  Tracklist?: TrackListItem[];
  SoundcloudLink: string | null;
  MixCloudLink: string | null;

  // Flags
  StaffPick: boolean | null;
  StaffPickComments: string | null;

  // Media
  EpisodeImage?: StrapiImage;

  // Internal notes
  StaffCommentEpisode?: StrapiRichText;

  // Relations
  link_episode_to_show?: ShowReference;
  guest_artists?: ArtistReference[];

  // Tags
  tag_genres?: TagGenre[];
  tag_mood_vibes?: TagMoodVibe[];
  tag_themes?: TagTheme[];
}

// Simplified episode reference (for use in relations)
export interface EpisodeReference {
  id: number;
  EpisodeTitle: string;
  EpisodeSlug: string;
  BroadcastDateTime: string;
  StaffPick: boolean | null;
  StaffPickComments: string | null;
  SoundcloudLink: string | null;
  MixCloudLink: string | null;
  EpisodeImage?: Pick<StrapiImage, 'id' | 'url' | 'formats' | 'alternativeText'>;
}
