import { useQuery } from '@tanstack/react-query';
import { fetchScheduleForToday, fetchNextUpcomingShow } from '../services/schedule';

export function useTodaySchedule() {
  return useQuery({
    queryKey: ['schedule', 'today'],
    queryFn: fetchScheduleForToday,
    staleTime: 1000 * 60 * 5,
  });
}

export function useNextUpcomingShow(enabled: boolean = true) {
  return useQuery({
    queryKey: ['schedule', 'next-upcoming'],
    queryFn: fetchNextUpcomingShow,
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}
