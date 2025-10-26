import { Card } from '../shared/Card';
import type { Artist } from '../../types/artist';
import { truncateText } from '../../utils/cardHelpers';

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Card
      to="/artists/$slug"
      params={{ slug: artist.Artist_Slug }}
      image={artist.ArtistImage}
      headerText={artist.ArtistName}
      descriptiveText2={truncateText(artist.ArtistBio, 120)}
    />
  );
}
