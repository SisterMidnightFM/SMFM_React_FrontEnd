import { createFileRoute } from '@tanstack/react-router';
import { useShowBySlug } from '../../hooks/useShowBySlug';
import { ShowDetail } from '../../components/shows/ShowDetail';

export const Route = createFileRoute('/shows/$slug')({
  component: ShowDetailPage,
});

function ShowDetailPage() {
  const { slug } = Route.useParams();
  const { data: show, isLoading, error } = useShowBySlug(slug);

  if (isLoading) {
    return (
      <div className="show-detail-page">
        <div className="show-detail-page__loading">
          <p>Loading show...</p>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="show-detail-page">
        <div className="show-detail-page__error">
          <h3>Error loading show</h3>
          <p>{error?.message || 'Show not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="show-detail-page">
      <ShowDetail show={show} />
    </div>
  );
}
