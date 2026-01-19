import type { Episode } from '../types/episode';
import type { StrapiCollectionResponse } from '../types/strapi';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

/**
 * Fetch paginated episodes from Strapi
 */
export async function fetchEpisodes(page: number = 1, pageSize: number = 10): Promise<{ episodes: Episode[]; hasMore: boolean; total: number }> {
  try {
    const url = new URL(`${STRAPI_URL}/api/episodes`);

    // Simple populate syntax - populate everything
    url.searchParams.append('populate', '*');

    // Sort by broadcast date (newest first)
    url.searchParams.append('sort', 'BroadcastDateTime:desc');

    // Pagination
    url.searchParams.append('pagination[page]', page.toString());
    url.searchParams.append('pagination[pageSize]', pageSize.toString());

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch episodes: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Episode> = await response.json();

    return {
      episodes: data.data,
      hasMore: data.meta.pagination.page < data.meta.pagination.pageCount,
      total: data.meta.pagination.total
    };
  } catch (error) {
    console.error('Error fetching episodes:', error);
    throw error;
  }
}

/**
 * Fetch all episodes from Strapi with populated relations (legacy - for backwards compatibility)
 */
export async function fetchAllEpisodes(): Promise<Episode[]> {
  const result = await fetchEpisodes(1, 100);
  return result.episodes;
}

/**
 * Fetch a single episode by slug
 */
export async function fetchEpisodeBySlug(slug: string): Promise<Episode | null> {
  try {
    const url = new URL(`${STRAPI_URL}/api/episodes`);

    // Filter by slug
    url.searchParams.append('filters[EpisodeSlug][$eq]', slug);

    // Deep populate to get nested relations (Main_Host within link_episode_to_show, ArtistImage within artists)
    url.searchParams.append('populate[link_episode_to_show][populate][0]', 'Main_Host');
    url.searchParams.append('populate[link_episode_to_show][populate][1]', 'ShowImage');
    url.searchParams.append('populate[link_episode_to_show][populate][Main_Host][populate][0]', 'ArtistImage');
    url.searchParams.append('populate[guest_artists][populate][0]', 'ArtistImage');
    url.searchParams.append('populate[EpisodeImage]', 'true');
    url.searchParams.append('populate[Tracklist]', 'true');
    url.searchParams.append('populate[tag_genres]', 'true');
    url.searchParams.append('populate[tag_themes]', 'true');

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch episode: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Episode> = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error(`Error fetching episode with slug ${slug}:`, error);
    throw error;
  }
}

/**
 * Fetch station pick episodes
 */
export async function fetchStaffPickEpisodes(): Promise<Episode[]> {
  try {
    const url = new URL(`${STRAPI_URL}/api/episodes`);

    // Filter for station picks
    url.searchParams.append('filters[StaffPick][$eq]', 'true');

    // Populate everything
    url.searchParams.append('populate', '*');

    // Sort by broadcast date (newest first)
    url.searchParams.append('sort', 'BroadcastDateTime:desc');

    // Limit to recent station picks
    url.searchParams.append('pagination[limit]', '12');

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch station pick episodes: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Episode> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching station pick episodes:', error);
    throw error;
  }
}

/**
 * Fetch episodes filtered by a specific tag
 */
export async function fetchEpisodesByTag(
  tagType: 'genre' | 'theme',
  tagValue: string
): Promise<Episode[]> {
  try {
    const url = new URL(`${STRAPI_URL}/api/episodes`);

    // Map tag type to Strapi field name and filter accordingly
    const tagFieldMap = {
      genre: { relation: 'tag_genres', field: 'Genre' },
      theme: { relation: 'tag_themes', field: 'Theme' }
    };

    const { relation, field } = tagFieldMap[tagType];

    // Filter by the specific tag value
    url.searchParams.append(`filters[${relation}][${field}][$eq]`, tagValue);

    // Populate everything
    url.searchParams.append('populate', '*');

    // Sort by broadcast date (newest first)
    url.searchParams.append('sort', 'BroadcastDateTime:desc');

    // Set a reasonable limit
    url.searchParams.append('pagination[limit]', '100');

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch episodes by tag: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Episode> = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching episodes for ${tagType} tag "${tagValue}":`, error);
    throw error;
  }
}
