import type { News } from '../types/news';
import type { StrapiCollectionResponse } from '../types/strapi';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

/**
 * Fetch recent news from Strapi
 */
export async function fetchRecentNews(limit: number = 4): Promise<News[]> {
  try {
    const url = new URL(`${STRAPI_URL}/api/newsplural`);

    // Explicitly populate media fields
    url.searchParams.append('populate[0]', 'CoverImage');
    url.searchParams.append('populate[1]', 'Additional_Images');

    // Sort by creation date (newest first)
    url.searchParams.append('sort', 'createdAt:desc');

    // Limit results
    url.searchParams.append('pagination[limit]', limit.toString());

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<News> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
}

/**
 * Fetch a single news item by slug
 */
export async function fetchNewsBySlug(slug: string): Promise<News | null> {
  try {
    const url = new URL(`${STRAPI_URL}/api/newsplural`);

    // Filter by slug
    url.searchParams.append('filters[News_Slug][$eq]', slug);

    // Populate each field explicitly
    url.searchParams.append('populate[CoverImage]', 'true');
    url.searchParams.append('populate[Additional_Images]', 'true');
    url.searchParams.append('populate[artists][populate][0]', 'ArtistImage');

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<News> = await response.json();
    return data.data[0] || null;
  } catch (error) {
    console.error(`Error fetching news with slug ${slug}:`, error);
    throw error;
  }
}

/**
 * Fetch all news from Strapi with pagination
 */
export async function fetchAllNews(
  page: number = 1,
  pageSize: number = 10
): Promise<{ news: News[]; hasMore: boolean }> {
  try {
    const url = new URL(`${STRAPI_URL}/api/newsplural`);

    // Explicitly populate media fields
    url.searchParams.append('populate[0]', 'CoverImage');
    url.searchParams.append('populate[1]', 'Additional_Images');

    // Sort by creation date (newest first)
    url.searchParams.append('sort', 'createdAt:desc');

    // Pagination
    url.searchParams.append('pagination[page]', page.toString());
    url.searchParams.append('pagination[pageSize]', pageSize.toString());

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<News> = await response.json();

    // Check if there are more pages
    const hasMore = data.meta.pagination.page < data.meta.pagination.pageCount;

    return {
      news: data.data,
      hasMore
    };
  } catch (error) {
    console.error('Error fetching all news:', error);
    throw error;
  }
}
