import { EpisodeCard } from '../episodes/EpisodeCard';
import type { Episode } from '../../types/episode';

interface LatestShowCardProps {
  episode: Episode;
}

export function LatestShowCard({ episode }: LatestShowCardProps) {
  return <EpisodeCard episode={episode} showNewBadge={false} />;
}
