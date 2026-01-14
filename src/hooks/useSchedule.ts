import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchScheduleByDate } from '../services/schedule';

/**
 * Calculate stale time based on how far the date is from today
 * - Today: 15 minutes (most likely to have last-minute changes)
 * - Tomorrow: 30 minutes
 * - 2+ days in future: 1 hour
 * - Yesterday: 1 hour
 * - 2+ days in past: 24 hours (essentially static)
 */
function getStaleTime(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(date + 'T00:00:00');
  const diffMs = targetDate.getTime() - today.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 1000 * 60 * 15; // Today: 15 min
  if (diffDays === 1) return 1000 * 60 * 30; // Tomorrow: 30 min
  if (diffDays > 1) return 1000 * 60 * 60; // Future: 1 hour
  if (diffDays === -1) return 1000 * 60 * 60; // Yesterday: 1 hour
  return 1000 * 60 * 60 * 24; // Past: 24 hours
}

/**
 * Get the next day's date in YYYY-MM-DD format
 */
function getNextDay(date: string): string {
  const d = new Date(date + 'T00:00:00');
  d.setDate(d.getDate() + 1);
  return formatDateISO(d);
}

/**
 * Get the previous day's date in YYYY-MM-DD format
 */
function getPrevDay(date: string): string {
  const d = new Date(date + 'T00:00:00');
  d.setDate(d.getDate() - 1);
  return formatDateISO(d);
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Hook for fetching schedule data with smart caching
 * Uses TanStack Query with dynamic stale times based on date relevance
 */
export function useSchedule(date: string) {
  const queryClient = useQueryClient();
  const staleTime = getStaleTime(date);

  const query = useQuery({
    queryKey: ['schedule', date],
    queryFn: () => fetchScheduleByDate(date),
    staleTime,
    gcTime: staleTime * 2, // Keep in cache for twice the stale time
    enabled: !!date,
  });

  /**
   * Prefetch adjacent days for smooth navigation
   */
  const prefetchAdjacentDays = (currentDate: string) => {
    const nextDate = getNextDay(currentDate);
    const prevDate = getPrevDay(currentDate);

    // Prefetch next day
    queryClient.prefetchQuery({
      queryKey: ['schedule', nextDate],
      queryFn: () => fetchScheduleByDate(nextDate),
      staleTime: getStaleTime(nextDate),
    });

    // Prefetch previous day
    queryClient.prefetchQuery({
      queryKey: ['schedule', prevDate],
      queryFn: () => fetchScheduleByDate(prevDate),
      staleTime: getStaleTime(prevDate),
    });
  };

  return {
    schedule: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    prefetchAdjacentDays,
  };
}
