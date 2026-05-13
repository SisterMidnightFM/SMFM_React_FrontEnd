import { createFileRoute } from '@tanstack/react-router';
import { fetchNewsBySlug } from '../../services/news';

export const Route = createFileRoute('/news/$slug')({
  loader: async ({ context: { queryClient }, params: { slug } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['news', slug],
      queryFn: () => fetchNewsBySlug(slug),
    });
  },
  pendingComponent: () => null,
});
