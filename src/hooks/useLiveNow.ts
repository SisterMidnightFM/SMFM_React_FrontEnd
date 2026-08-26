import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLiveNow, OFFLINE_TEXT, type LiveNow } from '../services/liveNow';

const STORAGE_KEY = 'smfm-live-now';
const POLL_INTERVAL = 1000 * 30;

/**
 * How old a persisted value can be before we'd rather show nothing than show
 * the wrong show name. Anything fresher is painted immediately on load while
 * the real fetch is in flight.
 */
const MAX_PERSISTED_AGE = 1000 * 60 * 30;

interface PersistedLiveNow extends LiveNow {
  savedAt: number;
}

/**
 * Read the last known live-now state so a page refresh can paint the show name
 * straight away - the TanStack Query cache itself is in-memory only
 */
function readPersisted(): PersistedLiveNow | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw) as PersistedLiveNow;
    if (typeof data?.showName !== 'string' || typeof data?.savedAt !== 'number') {
      return null;
    }
    if (Date.now() - data.savedAt > MAX_PERSISTED_AGE) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writePersisted(data: LiveNow): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...data, savedAt: Date.now() } satisfies PersistedLiveNow)
    );
  } catch {
    // Storage full or blocked - the header just falls back to fetching
  }
}

/**
 * Station status and the name of whatever is currently broadcasting.
 * Polls every 30 seconds and persists the last result so it shows correctly
 * as soon as the page loads.
 */
export function useLiveNow() {
  // Only read on mount - initialData is ignored once the query is cached
  const [persisted] = useState(readPersisted);

  const query = useQuery({
    queryKey: ['live-now'],
    queryFn: fetchLiveNow,
    refetchInterval: POLL_INTERVAL,
    refetchIntervalInBackground: true,
    staleTime: POLL_INTERVAL,
    gcTime: POLL_INTERVAL * 2,
    initialData: persisted ? { isOnline: persisted.isOnline, showName: persisted.showName } : undefined,
    // Treat the restored value as already stale so a fresh fetch starts at once
    initialDataUpdatedAt: persisted ? persisted.savedAt : undefined,
  });

  const { data, isSuccess } = query;

  useEffect(() => {
    if (isSuccess && data) {
      writePersisted(data);
    }
  }, [isSuccess, data]);

  // A failed fetch means we can't tell what's on, so say we're off air rather
  // than leaving a stale show name up
  if (query.isError) {
    return { isOnline: false, showName: OFFLINE_TEXT, isLoading: false };
  }

  return {
    isOnline: data?.isOnline ?? true,
    showName: data?.showName ?? '',
    isLoading: query.isLoading,
  };
}
