import { createFileRoute } from '@tanstack/react-router';
import { fetchEpisodeBySlug } from '../../services/episodes';

export const Route = createFileRoute('/episodes/$slug')({
  loader: async ({ context: { queryClient }, params: { slug } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['episodes', slug],
      queryFn: () => fetchEpisodeBySlug(slug),
    });
  },
  pendingComponent: () => null,
});
