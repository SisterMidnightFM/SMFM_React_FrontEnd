/**
 * Schedule service
 * Fetches schedule data from Google Calendar and transforms it to the Schedule type
 */

import type { Schedule, ShowSlot, UpcomingShow } from '../types/schedule';
import type { ShowReference } from '../types/show';
import type { GoogleCalendarEvent } from '../types/googleCalendar';
import { fetchCalendarEventsForDate, fetchCalendarEvents } from './googleCalendar';
import { buildShowLookup, findShowByName, findShowBySlug } from './showLookup';

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
 * Extract time string (HH:mm:ss.SSS) from ISO datetime
 */
function extractTimeFromISO(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}.000`;
}

/**
 * Generate a numeric ID from a string (for ShowSlot.id)
 */
function hashStringToNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate a numeric ID from a date string (for Schedule.id)
 */
function dateToNumericId(date: string): number {
  // Convert YYYY-MM-DD to a number (e.g., 20240115)
  return parseInt(date.replace(/-/g, ''), 10);
}

/**
 * Transform a Google Calendar event to a ShowSlot
 */
function transformCalendarEventToShowSlot(
  event: GoogleCalendarEvent,
  showLookup: Map<string, ShowReference>,
  index: number
): ShowSlot {
  // Try to find the show by slug first (if set in extended properties)
  let showRef: ShowReference | undefined;

  const extendedSlug = event.extendedProperties?.shared?.showSlug;
  if (extendedSlug) {
    showRef = findShowBySlug(extendedSlug, showLookup);
  }

  // Fall back to fuzzy name matching
  if (!showRef && event.summary) {
    showRef = findShowByName(event.summary, showLookup);
  }

  // Create a ShowReference even if we couldn't find a match (show name without link)
  const showName: ShowReference | undefined = showRef || (event.summary ? {
    id: hashStringToNumber(event.id),
    ShowName: event.summary,
    ShowSlug: '', // Empty slug means no link
    Show_Instagram: null,
  } : undefined);

  return {
    id: hashStringToNumber(event.id) || index,
    Show_Name: showName,
    Start_Time: extractTimeFromISO(event.start.dateTime),
    End_Time: extractTimeFromISO(event.end.dateTime),
  };
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
 * Returns the schedule if there are events for that date, otherwise null
 */
export async function fetchScheduleByDate(date: string): Promise<Schedule | null> {
  try {
    // Fetch calendar events and show lookup in parallel
    const [events, showLookup] = await Promise.all([
      fetchCalendarEventsForDate(date),
      buildShowLookup(),
    ]);

    // Return null if no events for this date
    if (!events || events.length === 0) {
      return null;
    }

    // Transform events to show slots
    const showSlots: ShowSlot[] = events.map((event, index) =>
      transformCalendarEventToShowSlot(event, showLookup, index)
    );

    // Create and return the schedule
    const now = new Date().toISOString();
    return {
      id: dateToNumericId(date),
      Date: date,
      Show_Slots: showSlots,
      createdAt: now,
      updatedAt: now,
      publishedAt: now,
    };
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
    // Fetch calendar events and show lookup in parallel
    const [events, showLookup] = await Promise.all([
      fetchCalendarEvents(startDate, endDate),
      buildShowLookup(),
    ]);

    if (!events || events.length === 0) {
      return [];
    }

    // Group events by date
    const eventsByDate = new Map<string, GoogleCalendarEvent[]>();

    events.forEach((event) => {
      const eventDate = event.start.dateTime.split('T')[0];
      if (!eventsByDate.has(eventDate)) {
        eventsByDate.set(eventDate, []);
      }
      eventsByDate.get(eventDate)!.push(event);
    });

    // Transform to schedules
    const schedules: Schedule[] = [];
    const now = new Date().toISOString();

    eventsByDate.forEach((dateEvents, date) => {
      const showSlots: ShowSlot[] = dateEvents.map((event, index) =>
        transformCalendarEventToShowSlot(event, showLookup, index)
      );

      schedules.push({
        id: dateToNumericId(date),
        Date: date,
        Show_Slots: showSlots,
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      });
    });

    // Sort by date descending (newest first)
    schedules.sort((a, b) => b.Date.localeCompare(a.Date));

    return schedules;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
}

/**
 * Get ordinal suffix for a day (1st, 2nd, 3rd, etc.)
 */
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * Format a date as "Wed 23rd Jan"
 */
function formatDateShort(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];

  return `${dayName} ${dayNum}${getOrdinalSuffix(dayNum)} ${monthName}`;
}

/**
 * Format time from Date to readable format (e.g., "2pm", "10am")
 */
function formatTimeFromDate(date: Date): string {
  const hour = date.getHours();
  const minutes = date.getMinutes();

  if (hour === 0) {
    return '12am';
  } else if (hour < 12) {
    return `${hour}${minutes !== 0 ? ':' + String(minutes).padStart(2, '0') : ''}am`;
  } else if (hour === 12) {
    return `12${minutes !== 0 ? ':' + String(minutes).padStart(2, '0') : ''}pm`;
  } else {
    return `${hour - 12}${minutes !== 0 ? ':' + String(minutes).padStart(2, '0') : ''}pm`;
  }
}

/**
 * Fetch the next upcoming show from the calendar
 * Looks up to 14 days ahead to find the next scheduled show
 * Returns null if no upcoming shows found
 */
export async function fetchNextUpcomingShow(): Promise<UpcomingShow | null> {
  try {
    const today = new Date();
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);

    const startDate = getTodayDate();
    const endDate = `${twoWeeksLater.getFullYear()}-${String(twoWeeksLater.getMonth() + 1).padStart(2, '0')}-${String(twoWeeksLater.getDate()).padStart(2, '0')}`;

    const [events, showLookup] = await Promise.all([
      fetchCalendarEvents(startDate, endDate),
      buildShowLookup(),
    ]);

    if (!events || events.length === 0) {
      return null;
    }

    // Find the first event that starts in the future
    const now = new Date();
    const futureEvent = events.find(event => {
      const eventStart = new Date(event.start.dateTime);
      return eventStart > now;
    });

    if (!futureEvent) {
      return null;
    }

    // Get show info
    let showRef;
    const extendedSlug = futureEvent.extendedProperties?.shared?.showSlug;
    if (extendedSlug) {
      showRef = findShowBySlug(extendedSlug, showLookup);
    }
    if (!showRef && futureEvent.summary) {
      showRef = findShowByName(futureEvent.summary, showLookup);
    }

    const eventDateTime = new Date(futureEvent.start.dateTime);

    return {
      showName: showRef?.ShowName || futureEvent.summary || 'Unknown Show',
      showSlug: showRef?.ShowSlug || undefined,
      dateTime: eventDateTime,
      formattedDate: formatDateShort(eventDateTime),
      formattedTime: formatTimeFromDate(eventDateTime),
    };
  } catch (error) {
    console.error('Error fetching next upcoming show:', error);
    throw error;
  }
}
