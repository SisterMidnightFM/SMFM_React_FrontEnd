/**
 * Badge helper functions for determining when to show "New" badges
 */

import type { Episode } from '../types/episode';
import type { Show } from '../types/show';
import type { Artist } from '../types/artist';
import { isWithinLastWeek } from './cardHelpers';

/**
 * Determine if an episode should show the "New" badge
 * Shows badge if episode was broadcast within the last 7 days
 */
export function shouldShowEpisodeBadge(episode: Episode): boolean {
  if (!episode.BroadcastDateTime) return false;
  return isWithinLastWeek(episode.BroadcastDateTime);
}

/**
 * Determine if a show should show the "New" badge
 * Shows badge if ANY episode from this show was broadcast within the last 7 days
 */
export function shouldShowShowBadge(show: Show): boolean {
  if (!show.Show_Episodes || show.Show_Episodes.length === 0) return false;

  return show.Show_Episodes.some((episode) => {
    if (!episode.BroadcastDateTime) return false;
    return isWithinLastWeek(episode.BroadcastDateTime);
  });
}

/**
 * Determine if an artist should show the "New" badge
 * Shows badge if the artist has:
 * - Hosted a show that had an episode within the last 7 days, OR
 * - Been a guest on an episode within the last 7 days
 */
export function shouldShowArtistBadge(artist: Artist): boolean {
  // Check shows where artist is main host
  if (artist.Main_host && artist.Main_host.length > 0) {
    const hasRecentHostedEpisode = artist.Main_host.some((show) => {
      if (!show.Show_Episodes || show.Show_Episodes.length === 0) return false;
      return show.Show_Episodes.some((episode) => {
        if (!episode.BroadcastDateTime) return false;
        return isWithinLastWeek(episode.BroadcastDateTime);
      });
    });

    if (hasRecentHostedEpisode) return true;
  }

  // Check episodes where artist was a guest
  if (artist.episodes_guest_featured && artist.episodes_guest_featured.length > 0) {
    const hasRecentGuestEpisode = artist.episodes_guest_featured.some((episode) => {
      if (!episode.BroadcastDateTime) return false;
      return isWithinLastWeek(episode.BroadcastDateTime);
    });

    if (hasRecentGuestEpisode) return true;
  }

  return false;
}
