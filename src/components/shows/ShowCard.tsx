import { useQueryClient } from '@tanstack/react-query';
import { Card } from '../shared/Card';
import type { Show } from '../../types/show';
import { extractRichText, truncateText } from '../../utils/cardHelpers';
import { fetchShowBySlug } from '../../services/shows';

interface ShowCardProps {
  show: Show;
}

export function ShowCard({ show }: ShowCardProps) {
  const queryClient = useQueryClient();

  // Format host names
  const hostNames = show.Main_Host && show.Main_Host.length > 0
    ? show.Main_Host.map(host => host.ArtistName).join(', ')
    : undefined;

  // Extract and truncate description
  const description = extractRichText(show.ShowDescription);

  // Prefetch show detail on hover
  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['shows', show.ShowSlug],
      queryFn: () => fetchShowBySlug(show.ShowSlug),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return (
    <Card
      to="/shows/$slug"
      params={{ slug: show.ShowSlug }}
      image={show.ShowImage}
      headerText={show.ShowName}
      descriptiveText={hostNames}
      descriptiveText2={truncateText(description, 120)}
      footerLink={{
        text: 'see episodes →'
      }}
      onMouseEnter={handleMouseEnter}
    />
  );
}
