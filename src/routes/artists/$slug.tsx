import { createFileRoute } from '@tanstack/react-router';
import { fetchArtistBySlug } from '../../services/artists';

export const Route = createFileRoute('/artists/$slug')({
  loader: async ({ context: { queryClient }, params: { slug } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['artists', slug],
      queryFn: () => fetchArtistBySlug(slug),
    });
  },
  pendingComponent: () => null,
});
