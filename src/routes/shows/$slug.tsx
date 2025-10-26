import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fetchShowBySlug } from '../../services/shows';
import { ShowDetail } from '../../components/shows/ShowDetail';
import type { Show } from '../../types/show';

export const Route = createFileRoute('/shows/$slug')({
  component: ShowDetailPage,
});

function ShowDetailPage() {
  const { slug } = Route.useParams();
  const [show, setShow] = useState<Show | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadShow() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchShowBySlug(slug);

        if (!data) {
          throw new Error('Show not found');
        }

        setShow(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load show'));
      } finally {
        setIsLoading(false);
      }
    }

    loadShow();
  }, [slug]);

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
