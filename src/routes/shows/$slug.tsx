import { createFileRoute } from '@tanstack/react-router';
import { fetchShowBySlug } from '../../services/shows';

export const Route = createFileRoute('/shows/$slug')({
  loader: async ({ context: { queryClient }, params: { slug } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['shows', slug],
      queryFn: () => fetchShowBySlug(slug),
    });
  },
  pendingComponent: () => null,
});
