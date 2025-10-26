import type { Episode } from '../types/episode';
import type { Show } from '../types/show';
import type { Artist } from '../types/artist';
import type { SearchFilters, SearchResults, SearchResultItem, ContentType } from '../types/search';
import type { StrapiCollectionResponse } from '../types/strapi';
import { buildEpisodeSearchQuery, buildShowSearchQuery, buildArtistSearchQuery } from '../utils/buildSearchQuery';
import { calculateEpisodeRelevance, calculateShowRelevance, calculateArtistRelevance } from '../utils/calculateRelevance';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

/**
 * Search episodes based on filters
 */
async function searchEpisodes(
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 10
): Promise<{ items: SearchResultItem[]; total: number; hasMore: boolean }> {
  try {
    const queryParams = buildEpisodeSearchQuery(filters, page, pageSize);
    const url = new URL(`${STRAPI_URL}/api/episodes`);
    url.search = queryParams.toString();

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to search episodes: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Episode> = await response.json();

    // Calculate relevance scores for each episode
    const items: SearchResultItem[] = data.data.map((episode) => ({
      type: 'episodes' as ContentType,
      data: episode,
      relevanceScore: calculateEpisodeRelevance(episode, filters),
    }));

    return {
      items,
      total: data.meta.pagination.total,
      hasMore: data.meta.pagination.page < data.meta.pagination.pageCount,
    };
  } catch (error) {
    console.error('Error searching episodes:', error);
    throw error;
  }
}

/**
 * Search shows based on filters
 */
async function searchShows(
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 10
): Promise<{ items: SearchResultItem[]; total: number; hasMore: boolean }> {
  try {
    const queryParams = buildShowSearchQuery(filters, page, pageSize);
    const url = new URL(`${STRAPI_URL}/api/shows`);
    url.search = queryParams.toString();

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to search shows: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Show> = await response.json();

    // Calculate relevance scores for each show
    const items: SearchResultItem[] = data.data.map((show) => ({
      type: 'shows' as ContentType,
      data: show,
      relevanceScore: calculateShowRelevance(show, filters),
    }));

    return {
      items,
      total: data.meta.pagination.total,
      hasMore: data.meta.pagination.page < data.meta.pagination.pageCount,
    };
  } catch (error) {
    console.error('Error searching shows:', error);
    throw error;
  }
}

/**
 * Search artists based on filters
 */
async function searchArtists(
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 10
): Promise<{ items: SearchResultItem[]; total: number; hasMore: boolean }> {
  try {
    const queryParams = buildArtistSearchQuery(filters, page, pageSize);
    const url = new URL(`${STRAPI_URL}/api/artists`);
    url.search = queryParams.toString();

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to search artists: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Artist> = await response.json();

    // Calculate relevance scores for each artist
    const items: SearchResultItem[] = data.data.map((artist) => ({
      type: 'artists' as ContentType,
      data: artist,
      relevanceScore: calculateArtistRelevance(artist, filters),
    }));

    return {
      items,
      total: data.meta.pagination.total,
      hasMore: data.meta.pagination.page < data.meta.pagination.pageCount,
    };
  } catch (error) {
    console.error('Error searching artists:', error);
    throw error;
  }
}

/**
 * Unified search across all selected content types
 * Returns combined results sorted by relevance score
 */
export async function search(
  filters: SearchFilters,
  page: number = 1,
  pageSize: number = 10
): Promise<SearchResults> {
  try {
    // Execute searches in parallel for selected content types
    const searchPromises: Promise<{ items: SearchResultItem[]; total: number; hasMore: boolean }>[] = [];

    if (filters.contentTypes.includes('episodes')) {
      searchPromises.push(searchEpisodes(filters, page, pageSize));
    }

    if (filters.contentTypes.includes('shows')) {
      searchPromises.push(searchShows(filters, page, pageSize));
    }

    if (filters.contentTypes.includes('artists')) {
      searchPromises.push(searchArtists(filters, page, pageSize));
    }

    // Wait for all searches to complete
    const results = await Promise.all(searchPromises);

    // Combine all results
    const allItems: SearchResultItem[] = results.flatMap((result) => result.items);

    // Sort by relevance score (highest first)
    allItems.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Calculate total and hasMore
    const total = results.reduce((sum, result) => sum + result.total, 0);
    const hasMore = results.some((result) => result.hasMore);

    return {
      items: allItems,
      total,
      page,
      pageSize,
      hasMore,
    };
  } catch (error) {
    console.error('Error performing search:', error);
    throw error;
  }
}
