import { Card } from '../shared/Card';
import type { Artist } from '../../types/artist';
import { truncateText } from '../../utils/cardHelpers';

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  // Get the first location if available
  const location = artist.tag_locations?.[0]?.Location;

  return (
    <Card
      to="/artists/$slug"
      params={{ slug: artist.Artist_Slug }}
      image={artist.ArtistImage}
      circularImage={true}
      headerText={artist.ArtistName}
      location={location}
      descriptiveText2={truncateText(artist.ArtistBio, 120)}
    />
  );
}
