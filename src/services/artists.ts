import type { Artist } from '../types/artist';
import type { StrapiCollectionResponse } from '../types/strapi';
import { appendIdFilter, orderByIds } from './ids';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

/**
 * Fetch paginated artists from Strapi
 */
export async function fetchArtists(page: number = 1, pageSize: number = 10): Promise<{ artists: Artist[]; hasMore: boolean; total: number }> {
  try {
    const url = new URL(`${STRAPI_URL}/api/artists`);

    // Populate all fields including episodes for badge logic
    url.searchParams.append('populate[0]', 'ArtistImage');
    url.searchParams.append('populate[1]', 'tag_locations');
    url.searchParams.append('populate[2]', 'Main_host');
    url.searchParams.append('populate[3]', 'Main_host.Show_Episodes');
    url.searchParams.append('populate[4]', 'episodes_guest_featured');

    // Sort by artist name
    url.searchParams.append('sort', 'ArtistName:asc');

    // Pagination
    url.searchParams.append('pagination[page]', page.toString());
    url.searchParams.append('pagination[pageSize]', pageSize.toString());

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch artists: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Artist> = await response.json();

    return {
      artists: data.data,
      hasMore: data.meta.pagination.page < data.meta.pagination.pageCount,
      total: data.meta.pagination.total
    };
  } catch (error) {
    console.error('Error fetching artists:', error);
    throw error;
  }
}

/**
 * Fetch a specific set of artists by id, in the order the ids were given.
 * Used by the catalogue-wide shuffle.
 */
export async function fetchArtistsByIds(ids: number[]): Promise<Artist[]> {
  if (ids.length === 0) return [];

  try {
    const url = new URL(`${STRAPI_URL}/api/artists`);

    appendIdFilter(url, ids);

    // Same fields the artist cards need
    url.searchParams.append('populate[0]', 'ArtistImage');
    url.searchParams.append('populate[1]', 'tag_locations');
    url.searchParams.append('populate[2]', 'Main_host');
    url.searchParams.append('populate[3]', 'Main_host.Show_Episodes');
    url.searchParams.append('populate[4]', 'episodes_guest_featured');

    url.searchParams.append('pagination[pageSize]', ids.length.toString());

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch artists by id: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Artist> = await response.json();
    return orderByIds(data.data, ids);
  } catch (error) {
    console.error('Error fetching artists by id:', error);
    throw error;
  }
}

/**
 * Fetch artists flagged as residents (Resident boolean in Strapi)
 */
export async function fetchResidentArtists(limit: number = 100): Promise<Artist[]> {
  try {
    const url = new URL(`${STRAPI_URL}/api/artists`);

    // Only residents
    url.searchParams.append('filters[Resident][$eq]', 'true');

    // Populate the fields the artist card needs (image, location, badge logic)
    url.searchParams.append('populate[0]', 'ArtistImage');
    url.searchParams.append('populate[1]', 'tag_locations');
    url.searchParams.append('populate[2]', 'Main_host');
    url.searchParams.append('populate[3]', 'Main_host.Show_Episodes');
    url.searchParams.append('populate[4]', 'episodes_guest_featured');

    url.searchParams.append('sort', 'ArtistName:asc');
    url.searchParams.append('pagination[pageSize]', limit.toString());

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch resident artists: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Artist> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching resident artists:', error);
    throw error;
  }
}

/**
 * Fetch all artists (legacy - for backwards compatibility)
 */
export async function fetchAllArtists(): Promise<Artist[]> {
  const result = await fetchArtists(1, 100);
  return result.artists;
}

/**
 * Fetch a single artist by slug
 */
export async function fetchArtistBySlug(slug: string): Promise<Artist | null> {
  try {
    const url = new URL(`${STRAPI_URL}/api/artists`);

    // Filter by slug
    url.searchParams.append('filters[Artist_Slug][$eq]', slug);

    // Populate all relations
    url.searchParams.append('populate', '*');

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch artist: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Artist> = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error(`Error fetching artist with slug ${slug}:`, error);
    throw error;
  }
}
