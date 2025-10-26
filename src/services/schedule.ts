import type { Schedule } from '../types/schedule';
import type { StrapiCollectionResponse } from '../types/strapi';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_TOKEN;

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

/**
 * Get today's date in YYYY-MM-DD format
 */
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Fetch the schedule for today's date
 * Returns the schedule if one is published for today, otherwise null
 */
export async function fetchScheduleForToday(): Promise<Schedule | null> {
  const todayDate = getTodayDate();
  return fetchScheduleByDate(todayDate);
}

/**
 * Fetch the schedule for a specific date
 * Returns the schedule if one is published for that date, otherwise null
 */
export async function fetchScheduleByDate(date: string): Promise<Schedule | null> {
  try {
    const url = new URL(`${STRAPI_URL}/api/schedules`);

    // Filter for specific date
    url.searchParams.append('filters[Date][$eq]', date);

    // Deep populate Show_Slots and the related Show_Name
    url.searchParams.append('populate[Show_Slots][populate][Show_Name][populate][0]', 'ShowImage');
    url.searchParams.append('populate[Show_Slots][populate][Show_Name][populate][1]', 'Main_Host');

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch schedule: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Schedule> = await response.json();

    // Return the first schedule found (there should only be one due to unique Date constraint)
    return data.data[0] || null;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
}

/**
 * Fetch schedules within a date range
 * Returns array of schedules sorted by date (newest first)
 */
export async function fetchSchedulesByDateRange(
  startDate: string,
  endDate: string
): Promise<Schedule[]> {
  try {
    const url = new URL(`${STRAPI_URL}/api/schedules`);

    // Filter for date range
    url.searchParams.append('filters[Date][$gte]', startDate);
    url.searchParams.append('filters[Date][$lte]', endDate);

    // Sort by date descending (newest first)
    url.searchParams.append('sort', 'Date:desc');

    // Deep populate Show_Slots and the related Show_Name
    url.searchParams.append('populate[Show_Slots][populate][Show_Name][populate][0]', 'ShowImage');
    url.searchParams.append('populate[Show_Slots][populate][Show_Name][populate][1]', 'Main_Host');

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi error response:', errorText);
      throw new Error(`Failed to fetch schedules: ${response.statusText}`);
    }

    const data: StrapiCollectionResponse<Schedule> = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
}
