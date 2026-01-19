import type { TagGenre, TagTheme, TagLocation } from '../types/tag';
import type { StrapiCollectionResponse } from '../types/strapi';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

/**
 * Fetch all genre tags from Strapi
 */
export async function fetchGenreTags(): Promise<TagGenre[]> {
  try {
    const url = new URL(`${STRAPI_URL}/api/tags`);

    // Sort alphabetically
    url.searchParams.append('sort', 'Genre:asc');

    // Get all tags (no pagination)
    url.searchParams.append('pagination[limit]', '100');

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch genre tags: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<TagGenre> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching genre tags:', error);
    throw error;
  }
}

/**
 * Fetch all theme tags from Strapi
 */
export async function fetchThemeTags(): Promise<TagTheme[]> {
  try {
    const url = new URL(`${STRAPI_URL}/api/tag-themes`);

    // Sort alphabetically
    url.searchParams.append('sort', 'Theme:asc');

    // Get all tags (no pagination)
    url.searchParams.append('pagination[limit]', '100');

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch theme tags: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<TagTheme> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching theme tags:', error);
    throw error;
  }
}

/**
 * Fetch all location tags from Strapi
 */
export async function fetchLocationTags(): Promise<TagLocation[]> {
  try {
    const url = new URL(`${STRAPI_URL}/api/tag-locations`);

    // Sort alphabetically
    url.searchParams.append('sort', 'Location:asc');

    // Get all tags (no pagination)
    url.searchParams.append('pagination[limit]', '100');

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch location tags: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<TagLocation> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching location tags:', error);
    throw error;
  }
}

/**
 * Fetch all tags at once
 */
export async function fetchAllTags(): Promise<{
  genres: TagGenre[];
  themes: TagTheme[];
  locations: TagLocation[];
}> {
  try {
    const [genres, themes, locations] = await Promise.all([
      fetchGenreTags(),
      fetchThemeTags(),
      fetchLocationTags(),
    ]);

    return { genres, themes, locations };
  } catch (error) {
    console.error('Error fetching all tags:', error);
    throw error;
  }
}
