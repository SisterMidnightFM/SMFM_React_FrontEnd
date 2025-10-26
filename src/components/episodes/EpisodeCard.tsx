import { Card } from '../shared/Card';
import type { Episode } from '../../types/episode';
import { formatEpisodeDateTime } from '../../utils/cardHelpers';

interface EpisodeCardProps {
  episode: Episode;
}

export function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <Card
      to="/episodes/$slug"
      params={{ slug: episode.EpisodeSlug }}
      image={episode.EpisodeImage}
      headerText={episode.link_episode_to_show?.ShowName || 'Unknown Show'}
      descriptiveText={episode.EpisodeTitle}
      descriptiveText2={formatEpisodeDateTime(episode.BroadcastDateTime)}
      tags={episode.tag_genres?.map((g) => ({ id: g.id, label: g.Genre }))}
    />
  );
}
