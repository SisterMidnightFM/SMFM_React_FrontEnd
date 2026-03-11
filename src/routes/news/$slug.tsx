import { createFileRoute } from '@tanstack/react-router';
import { useNewsBySlug } from '../../hooks/useNewsBySlug';
import { NewsDetail } from '../../components/news/NewsDetail';
import { fetchNewsBySlug } from '../../services/news';

export const Route = createFileRoute('/news/$slug')({
  loader: async ({ context: { queryClient }, params: { slug } }) => {
    await queryClient.ensureQueryData({
      queryKey: ['news', slug],
      queryFn: () => fetchNewsBySlug(slug),
    });
  },
  pendingComponent: () => null,
  component: NewsDetailPage,
});

function NewsDetailPage() {
  const { slug } = Route.useParams();
  const { data: news, isLoading, error } = useNewsBySlug(slug);

  if (isLoading) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-page__loading">
          <p>Loading news...</p>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="news-detail-page">
        <div className="news-detail-page__error">
          <h3>Error loading news</h3>
          <p>{error?.message || 'News not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <NewsDetail news={news} />
    </div>
  );
}
