/**
 * About Page type definitions
 */

import type { StrapiTimestamps, StrapiRichText } from './strapi';

export interface AboutPage extends StrapiTimestamps {
  id: number;
  AboutPageText: StrapiRichText | string; // Rich text content for the about page
}
