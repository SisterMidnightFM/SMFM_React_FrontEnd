/**
 * Live now service
 * Works out what to show in the header player: the Google Calendar is the
 * source of truth for the show name (same as the schedule page), and Radio Cult
 * decides whether we're on air at all and what to fall back to when nothing is
 * scheduled in the calendar.
 */

import { fetchCurrentCalendarShow } from './schedule';

const LIVE_NOW_URL = 'https://api.radiocult.fm/api/station/sister-midnight-fm/schedule/live';

export const OFFLINE_TEXT = 'STATION OFFLINE - BRB';
export const LIVE_STUDIO_TEXT = 'Broadcasting Live from SMFM studio';
export const DEFAULT_SHOW_TEXT = 'Sister Midnight FM';

interface LiveNowResponse {
  success: boolean;
  result?: {
    // 'schedule' | 'defaultPlaylist' | 'offAir'
    status: string;
    content?: {
      title?: string;
      name?: string;
      startDateUtc?: string;
      endDateUtc?: string;
      // 'live' means someone is broadcasting from the studio,
      // 'mix' / 'playlist' / 'relay' mean pre-recorded content
      media?: {
        type?: string;
      } | null;
    } | null;
    metadata?: {
      title?: string;
      artist?: string | null;
    } | null;
  };
}

export interface LiveNow {
  isOnline: boolean;
  showName: string;
}

/**
 * Fetch the station status and the name of whatever is currently broadcasting
 */
export async function fetchLiveNow(): Promise<LiveNow> {
  const [response, calendarShow] = await Promise.all([
    fetch(LIVE_NOW_URL),
    fetchCurrentCalendarShow(),
  ]);

  const data: LiveNowResponse = await response.json();
  const live = data.result;

  const isOnline = data.success === true && live?.status !== 'offAir';

  // Nothing broadcasting on Radio Cult at all
  if (!isOnline) {
    return { isOnline, showName: OFFLINE_TEXT };
  }

  // A show scheduled in the Google Calendar always wins
  if (calendarShow) {
    return { isOnline, showName: calendarShow };
  }

  if (live?.status === 'schedule') {
    // Live from the studio, or a pre-recorded show scheduled in Radio Cult
    const showName =
      live.content?.media?.type === 'live'
        ? LIVE_STUDIO_TEXT
        : live.content?.title || live.metadata?.title || DEFAULT_SHOW_TEXT;
    return { isOnline, showName };
  }

  // Default playlist filling the gap - show the track with a rebroadcast tag
  const trackTitle = live?.metadata?.title;
  return {
    isOnline,
    showName: trackTitle ? `${trackTitle} [Rebroadcast]` : DEFAULT_SHOW_TEXT,
  };
}
