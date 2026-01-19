/**
 * Show lookup service
 * Maps show names to ShowReference objects for linking calendar events to show pages
 */

import Fuse from 'fuse.js';
import { fetchAllShows } from './shows';
import type { ShowReference } from '../types/show';
import type { Show } from '../types/show';

// Cache for show lookup map
let showLookupCache: Map<string, ShowReference> | null = null;
let fuseMatcher: Fuse<ShowReference> | null = null;

/**
 * Convert a Show to a ShowReference
 */
function showToReference(show: Show): ShowReference {
  return {
    id: show.id,
    ShowName: show.ShowName,
    ShowSlug: show.ShowSlug,
    Show_Instagram: show.Show_Instagram,
    ShowImage: show.ShowImage,
    Main_Host: show.Main_Host,
  };
}

/**
 * Build the show lookup cache
 * Fetches all shows and creates maps for slug and name lookups
 */
export async function buildShowLookup(): Promise<Map<string, ShowReference>> {
  // Return cached version if available
  if (showLookupCache) {
    return showLookupCache;
  }

  try {
    const shows = await fetchAllShows();

    showLookupCache = new Map();
    const references: ShowReference[] = [];

    shows.forEach((show) => {
      const ref = showToReference(show);
      references.push(ref);

      // Index by slug (primary key)
      showLookupCache!.set(show.ShowSlug, ref);

      // Also index by lowercase name for direct name matching
      showLookupCache!.set(show.ShowName.toLowerCase(), ref);
    });

    // Setup Fuse.js for fuzzy matching
    fuseMatcher = new Fuse(references, {
      keys: ['ShowName'],
      threshold: 0.3, // Allow some variation in matching
      ignoreLocation: true,
    });

    return showLookupCache;
  } catch (error) {
    console.error('Error building show lookup:', error);
    throw error;
  }
}

/**
 * Find a show by exact slug
 */
export function findShowBySlug(
  slug: string,
  lookup: Map<string, ShowReference>
): ShowReference | undefined {
  return lookup.get(slug);
}

/**
 * Find a show by name (with fuzzy matching fallback)
 * @param eventSummary - The calendar event summary/title
 * @param lookup - The show lookup map
 * @returns ShowReference if found, undefined otherwise
 */
export function findShowByName(
  eventSummary: string,
  lookup: Map<string, ShowReference>
): ShowReference | undefined {
  // Try exact match first (case-insensitive)
  const exact = lookup.get(eventSummary.toLowerCase());
  if (exact) {
    return exact;
  }

  // Try fuzzy match
  if (fuseMatcher) {
    const results = fuseMatcher.search(eventSummary);
    if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.3) {
      return results[0].item;
    }
  }

  return undefined;
}

/**
 * Check if a calendar event summary matches a specific show name
 * Uses the same fuzzy matching logic as findShowByName but in reverse
 * @param eventSummary - The calendar event summary/title
 * @param showName - The show name to match against
 * @param showSlug - The show slug (used for exact extended property matching)
 * @returns true if the event matches the show
 */
export function doesEventMatchShow(
  eventSummary: string,
  showName: string,
  showSlug: string
): boolean {
  // Exact name match (case-insensitive)
  if (eventSummary.toLowerCase() === showName.toLowerCase()) {
    return true;
  }

  // Use the existing fuseMatcher if available
  if (fuseMatcher) {
    const results = fuseMatcher.search(eventSummary);
    if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.3) {
      // Check if the matched show is the one we're looking for
      return results[0].item.ShowSlug === showSlug;
    }
  }

  return false;
}

/**
 * Clear the show lookup cache
 * Call this if shows are updated and you need fresh data
 */
export function clearShowLookupCache(): void {
  showLookupCache = null;
  fuseMatcher = null;
}
