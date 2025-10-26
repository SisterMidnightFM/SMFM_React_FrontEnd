import type { Episode } from '../../types/episode';
import { EpisodeCard } from './EpisodeCard';
import { CardGrid } from '../shared/CardGrid';
import './TaggedEpisodes.css';

interface TaggedEpisodesProps {
  episodes: Episode[];
  tagType: 'genre' | 'mood' | 'theme';
  tagValue: string;
}

export function TaggedEpisodes({ episodes, tagType, tagValue }: TaggedEpisodesProps) {
  // Map tag type to display name and CSS class
  const tagTypeMap = {
    genre: { displayName: 'Genre', className: 'tagged-episodes__tag--genre' },
    mood: { displayName: 'Mood/Vibe', className: 'tagged-episodes__tag--mood' },
    theme: { displayName: 'Theme', className: 'tagged-episodes__tag--theme' }
  };

  const { displayName, className } = tagTypeMap[tagType];

  return (
    <div className="tagged-episodes">
      {/* Header Section */}
      <div className="tagged-episodes__header">
        <h1 className="tagged-episodes__title">Episodes tagged with</h1>
        <div className={`tagged-episodes__tag ${className}`}>
          {tagValue}
        </div>
        <div className="tagged-episodes__count">
          {episodes.length} {episodes.length === 1 ? 'episode' : 'episodes'} found
        </div>
      </div>

      {/* Episodes Grid */}
      {episodes.length > 0 ? (
        <CardGrid>
          {episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </CardGrid>
      ) : (
        <div className="tagged-episodes__empty">
          <p>No episodes found with this tag.</p>
        </div>
      )}
    </div>
  );
}
