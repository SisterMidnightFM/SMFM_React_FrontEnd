import type { Artist } from '../types/artist';
import type { StrapiCollectionResponse } from '../types/strapi';

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

    // Populate everything
    url.searchParams.append('populate', '*');

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
