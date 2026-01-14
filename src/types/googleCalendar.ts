/**
 * Google Calendar API type definitions
 */

export interface GoogleCalendarDateTime {
  dateTime: string; // ISO 8601 format
  timeZone?: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: GoogleCalendarDateTime;
  end: GoogleCalendarDateTime;
  extendedProperties?: {
    shared?: {
      showSlug?: string;
    };
  };
}

export interface GoogleCalendarListResponse {
  kind: string;
  etag: string;
  summary: string;
  updated: string;
  timeZone: string;
  accessRole: string;
  items: GoogleCalendarEvent[];
  nextPageToken?: string;
}
