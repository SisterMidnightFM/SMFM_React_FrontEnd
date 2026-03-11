import { useQuery } from '@tanstack/react-query';
import { fetchAboutPage } from '../services/about';

export const aboutQueryOptions = {
  queryKey: ['about'] as const,
  queryFn: fetchAboutPage,
};

export function useAbout() {
  return useQuery(aboutQueryOptions);
}
