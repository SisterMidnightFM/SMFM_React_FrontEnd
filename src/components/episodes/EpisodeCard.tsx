import { useQueryClient } from '@tanstack/react-query';
import { Card } from '../shared/Card';
import type { Episode } from '../../types/episode';
import { formatEpisodeDateTime } from '../../utils/cardHelpers';
import { shouldShowEpisodeBadge } from '../../utils/badgeHelpers';
import { fetchEpisodeBySlug } from '../../services/episodes';

interface EpisodeCardProps {
  episode: Episode;
  showNewBadge?: boolean;
}

export function EpisodeCard({ episode, showNewBadge = true }: EpisodeCardProps) {
  const queryClient = useQueryClient();

  // Prefetch episode detail on hover
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['episodes', episode.EpisodeSlug],
      queryFn: () => fetchEpisodeBySlug(episode.EpisodeSlug),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return (
    <Card
      to="/episodes/$slug"
      params={{ slug: episode.EpisodeSlug }}
      image={episode.EpisodeImage}
      headerText={episode.EpisodeTitle}
      descriptiveText={episode.link_episode_to_show?.ShowName || 'Unknown Show'}
      descriptiveText2={formatEpisodeDateTime(episode.BroadcastDateTime)}
      tags={episode.tag_genres?.map((g) => ({ id: g.id, label: g.Genre }))}
      newBadge={showNewBadge && shouldShowEpisodeBadge(episode)}
      onMouseEnter={handleMouseEnter}
    />
  );
}
