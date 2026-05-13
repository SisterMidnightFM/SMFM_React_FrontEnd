import { createFileRoute } from '@tanstack/react-router';
import { aboutQueryOptions } from '../hooks/useAbout';

export const Route = createFileRoute('/about')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(aboutQueryOptions);
  },
  pendingComponent: () => null,
});
