import { useQueryClient } from '@tanstack/react-query';
import { Card } from '../shared/Card';
import type { Artist } from '../../types/artist';
import { truncateText } from '../../utils/cardHelpers';
import { shouldShowArtistBadge } from '../../utils/badgeHelpers';
import { fetchArtistBySlug } from '../../services/artists';

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const queryClient = useQueryClient();

  // Get the first location if available
  const location = artist.tag_locations?.[0]?.Location;

  // Prefetch artist detail on hover
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['artists', artist.Artist_Slug],
      queryFn: () => fetchArtistBySlug(artist.Artist_Slug),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return (
    <Card
      to="/artists/$slug"
      params={{ slug: artist.Artist_Slug }}
      image={artist.ArtistImage}
      circularImage={true}
      headerText={artist.ArtistName}
      location={location}
      descriptiveText2={truncateText(artist.ArtistBio, 120)}
      newBadge={shouldShowArtistBadge(artist)}
      onMouseEnter={handleMouseEnter}
    />
  );
}
