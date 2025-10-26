/**
 * Show type definitions
 */

import type { StrapiTimestamps, StrapiImage, StrapiRichText } from './strapi';
import type { ArtistReference } from './artist';
import type { Episode } from './episode';

export interface Show extends StrapiTimestamps {
  id: number;

  // Basic info
  ShowName: string;
  ShowSlug: string;
  ShowDescription?: StrapiRichText;

  // Social & links
  Show_Instagram: string | null;
  WebLink1: string | null;
  WebLink2: string | null;

  // Broadcast schedule
  Broadcast_Day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' | null;
  Broadcast_Time: number | null; // Hour (e.g., 7 for 7pm)
  Broadcast_AmPm: 'am' | 'pm' | null;
  Broadcast_IsRepeat: boolean | null;
  Broadcast_RepeatEvery_Weeks: number | null;

  // Media
  ShowImage?: StrapiImage;

  // Internal notes
  StaffComments: string | null;

  // Relations
  Main_Host?: ArtistReference[];
  Show_Episodes?: Episode[];
}

// Simplified show reference (for use in relations)
export interface ShowReference {
  id: number;
  ShowName: string;
  ShowSlug: string;
  Show_Instagram: string | null;
  ShowImage?: Pick<StrapiImage, 'id' | 'url' | 'formats' | 'alternativeText'>;
  Main_Host?: ArtistReference[];
}
