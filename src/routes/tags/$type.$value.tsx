import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { fetchEpisodesByTag } from '../../services/episodes';
import { TaggedEpisodes } from '../../components/episodes/TaggedEpisodes';
import type { Episode } from '../../types/episode';

export const Route = createFileRoute('/tags/$type/$value')({
  component: TaggedEpisodesPage,
});

function TaggedEpisodesPage() {
  const { type, value } = Route.useParams();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Validate tag type
  const isValidTagType = (t: string): t is 'genre' | 'mood' | 'theme' => {
    return t === 'genre' || t === 'mood' || t === 'theme';
  };

  useEffect(() => {
    async function loadEpisodes() {
      try {
        setIsLoading(true);
        setError(null);

        if (!isValidTagType(type)) {
          throw new Error(`Invalid tag type: ${type}`);
        }

        const data = await fetchEpisodesByTag(type, decodeURIComponent(value));
        setEpisodes(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load episodes'));
      } finally {
        setIsLoading(false);
      }
    }

    loadEpisodes();
  }, [type, value]);

  if (isLoading) {
    return (
      <div className="tagged-episodes-page">
        <div className="tagged-episodes-page__loading">
          <p>Loading episodes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tagged-episodes-page">
        <div className="tagged-episodes-page__error">
          <h3>Error loading episodes</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!isValidTagType(type)) {
    return (
      <div className="tagged-episodes-page">
        <div className="tagged-episodes-page__error">
          <h3>Invalid tag type</h3>
          <p>Tag type must be one of: genre, mood, or theme</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tagged-episodes-page">
      <TaggedEpisodes
        episodes={episodes}
        tagType={type}
        tagValue={decodeURIComponent(value)}
      />
    </div>
  );
}
