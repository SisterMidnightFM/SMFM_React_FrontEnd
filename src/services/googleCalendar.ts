/**
 * Google Calendar API service
 * Fetches events from a public Google Calendar
 */

import type {
  GoogleCalendarEvent,
  GoogleCalendarListResponse,
} from '../types/googleCalendar';

const GOOGLE_CALENDAR_API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;

/**
 * Fetch calendar events for a specific date range
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @returns Array of calendar events sorted by start time
 */
export async function fetchCalendarEvents(
  startDate: string,
  endDate: string
): Promise<GoogleCalendarEvent[]> {
  if (!GOOGLE_CALENDAR_API_KEY || !CALENDAR_ID) {
    console.error('Google Calendar API key or Calendar ID not configured');
    throw new Error('Google Calendar configuration missing');
  }

  // Convert dates to ISO format for API
  const timeMin = `${startDate}T00:00:00Z`;
  const timeMax = `${endDate}T23:59:59Z`;

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`
  );

  url.searchParams.append('key', GOOGLE_CALENDAR_API_KEY);
  url.searchParams.append('timeMin', timeMin);
  url.searchParams.append('timeMax', timeMax);
  url.searchParams.append('singleEvents', 'true'); // Expand recurring events
  url.searchParams.append('orderBy', 'startTime');
  url.searchParams.append('maxResults', '50'); // Reasonable limit for a day's schedule

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Calendar API error:', errorText);
      throw new Error(`Failed to fetch calendar events: ${response.statusText}`);
    }

    const data: GoogleCalendarListResponse = await response.json();
    console.log('Google Calendar API response:', JSON.stringify(data, null, 2));
    return data.items || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

/**
 * Fetch calendar events for a single day
 * @param date - Date in YYYY-MM-DD format
 * @returns Array of calendar events for that day
 */
export async function fetchCalendarEventsForDate(
  date: string
): Promise<GoogleCalendarEvent[]> {
  return fetchCalendarEvents(date, date);
}
