/**
 * Utility functions for Card component data transformation
 */

import type { StrapiRichText } from '../types/strapi';

/**
 * Format episode broadcast date and time
 * Returns formatted string like "Jan 15, 2024 3:30 PM"
 */
export function formatEpisodeDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Extract plain text from Strapi rich text format
 * Handles both string and StrapiRichText array formats
 */
export function extractRichText(richText: StrapiRichText | string | undefined): string {
  if (!richText) return '';

  if (typeof richText === 'string') {
    return richText;
  }

  if (Array.isArray(richText) && richText.length > 0) {
    // Get first paragraph's text
    const firstParagraph = richText[0];
    if (firstParagraph?.children && firstParagraph.children.length > 0) {
      return firstParagraph.children
        .map((child) => child.text || '')
        .join('');
    }
  }

  return '';
}

/**
 * Truncate text to specified length and add ellipsis if needed
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return '';

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
}
