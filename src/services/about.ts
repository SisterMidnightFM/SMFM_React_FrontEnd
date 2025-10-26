import type { AboutPage } from '../types/about';
import type { StrapiCollectionResponse, StrapiSingleResponse } from '../types/strapi';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

/**
 * Fetch the About Page from Strapi
 * Tries both Single Type and Collection Type endpoints
 */
export async function fetchAboutPage(): Promise<AboutPage | null> {
  try {
    // First try as Single Type endpoint (most common for About pages)
    let url = new URL(`${STRAPI_URL}/api/about-page`);
    url.searchParams.append('populate', '*');

    console.log('Attempting to fetch from:', url.toString());
    let response = await fetch(url.toString(), { headers });
    console.log('Response status:', response.status, response.statusText);

    // If Single Type works, return the data
    if (response.ok) {
      const data: StrapiSingleResponse<AboutPage> = await response.json();
      console.log('Successfully fetched about page (Single Type):', data);
      return data.data;
    }

    // If Single Type failed with 404, try Collection Type endpoint
    if (response.status === 404) {
      console.log('Single type not found (404), trying collection type...');
      url = new URL(`${STRAPI_URL}/api/about-pages`);
      url.searchParams.append('populate', '*');
      url.searchParams.append('sort', 'publishedAt:desc');
      url.searchParams.append('pagination[limit]', '1');

      console.log('Attempting to fetch from:', url.toString());
      response = await fetch(url.toString(), { headers });
      console.log('Response status:', response.status, response.statusText);

      if (response.ok) {
        const data: StrapiCollectionResponse<AboutPage> = await response.json();
        console.log('Successfully fetched about page (Collection Type):', data);
        return data.data[0] || null;
      }
    }

    // If we get here, something went wrong
    const errorText = await response.text();
    console.error('Strapi error response:', errorText);
    console.error('Failed URL was:', url.toString());
    throw new Error(`Failed to fetch about page: ${response.statusText}`);
  } catch (error) {
    console.error('Error fetching about page:', error);
    throw error;
  }
}
