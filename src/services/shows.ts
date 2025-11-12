import type { Show } from '../types/show';
import type { StrapiCollectionResponse } from '../types/strapi';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

/**
 * Fetch paginated shows from Strapi
 */
export async function fetchShows(page: number = 1, pageSize: number = 10): Promise<{ shows: Show[]; hasMore: boolean; total: number }> {
  try {
    const url = new URL(`${STRAPI_URL}/api/shows`);

    // Populate all fields including episodes for badge logic
    url.searchParams.append('populate[0]', 'ShowImage');
    url.searchParams.append('populate[1]', 'Main_Host');
    url.searchParams.append('populate[2]', 'Main_Host.ArtistImage');
    url.searchParams.append('populate[3]', 'Show_Episodes');

    // Sort by show name
    url.searchParams.append('sort', 'ShowName:asc');

    // Pagination
    url.searchParams.append('pagination[page]', page.toString());
    url.searchParams.append('pagination[pageSize]', pageSize.toString());

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch shows: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Show> = await response.json();

    return {
      shows: data.data,
      hasMore: data.meta.pagination.page < data.meta.pagination.pageCount,
      total: data.meta.pagination.total
    };
  } catch (error) {
    console.error('Error fetching shows:', error);
    throw error;
  }
}

/**
 * Fetch all shows (legacy - for backwards compatibility)
 */
export async function fetchAllShows(): Promise<Show[]> {
  const result = await fetchShows(1, 100);
  return result.shows;
}

/**
 * Fetch a single show by slug
 */
export async function fetchShowBySlug(slug: string): Promise<Show | null> {
  try {
    const url = new URL(`${STRAPI_URL}/api/shows`);

    // Filter by slug
    url.searchParams.append('filters[ShowSlug][$eq]', slug);

    // Populate all fields with proper syntax
    url.searchParams.append('populate[0]', 'ShowImage');
    url.searchParams.append('populate[1]', 'Main_Host');
    url.searchParams.append('populate[2]', 'Main_Host.ArtistImage');
    url.searchParams.append('populate[3]', 'Show_Episodes');
    url.searchParams.append('populate[4]', 'Show_Episodes.guest_artists');
    url.searchParams.append('populate[5]', 'Show_Episodes.guest_artists.ArtistImage');
    url.searchParams.append('populate[6]', 'Show_Episodes.link_episode_to_show');

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch show: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Show> = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error(`Error fetching show with slug ${slug}:`, error);
    throw error;
  }
}
