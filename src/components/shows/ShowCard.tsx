import { Card } from '../shared/Card';
import type { Show } from '../../types/show';
import { extractRichText, truncateText } from '../../utils/cardHelpers';

interface ShowCardProps {
  show: Show;
}

export function ShowCard({ show }: ShowCardProps) {
  // Format host names
  const hostNames = show.Main_Host && show.Main_Host.length > 0
    ? show.Main_Host.map(host => host.ArtistName).join(', ')
    : undefined;

  // Extract and truncate description
  const description = extractRichText(show.ShowDescription);

  return (
    <Card
      to="/shows/$slug"
      params={{ slug: show.ShowSlug }}
      image={show.ShowImage}
      headerText={show.ShowName}
      descriptiveText={hostNames}
      descriptiveText2={truncateText(description, 120)}
    />
  );
}
