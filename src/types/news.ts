/**
 * News type definitions
 */

import type { StrapiTimestamps, StrapiImage, StrapiRichText } from './strapi';
import type { Artist } from './artist';

export interface News extends StrapiTimestamps {
  id: number;

  // Basic info
  News_Slug: string;
  News_Title: string;
  News_Text: StrapiRichText | string; // Can be rich text array or plain string

  // Media
  CoverImage?: StrapiImage | StrapiImage[]; // Can be single image or array
  Additional_Images?: StrapiImage[];

  // Relations
  artists?: Artist[];
}

// Simplified news reference (for use in lists)
export interface NewsReference {
  id: number;
  News_Slug: string;
  News_Title: string;
  CoverImage?: Pick<StrapiImage, 'id' | 'url' | 'formats' | 'alternativeText'>;
}
