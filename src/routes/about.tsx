import { createFileRoute } from '@tanstack/react-router';
import { aboutQueryOptions } from '../hooks/useAbout';
import { AboutPage } from '../components/about/AboutPage';

export const Route = createFileRoute('/about')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(aboutQueryOptions);
  },
  pendingComponent: () => null,
  component: AboutPage,
});
