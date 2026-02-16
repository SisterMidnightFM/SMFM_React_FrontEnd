/**
 * Utility functions for Card component data transformation
 */

import type { StrapiRichText } from '../types/strapi';

/**
 * Get ordinal suffix for a day number (1st, 2nd, 3rd, 4th, etc.)
 */
function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * Format date string with ordinal day
 * Returns formatted string like "5th Feb 2026"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = date.toLocaleDateString('en-GB', { month: 'short' });
  const year = date.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
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

/**
 * Check if a date is within the last 7 days
 * @param dateString - ISO date string (e.g., "2024-11-01T15:30:00.000Z")
 * @returns true if the date is within the last 7 days and not in the future
 */
export function isWithinLastWeek(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const daysDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

  // Must be past date (daysDiff >= 0) and within 7 days (daysDiff <= 7)
  return daysDiff >= 0 && daysDiff <= 7;
}
