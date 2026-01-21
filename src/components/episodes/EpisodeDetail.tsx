import { Link } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import type { Episode } from '../../types/episode';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { useEpisodePlayer } from '../../contexts/EpisodePlayerContext';
import { fetchShowBySlug } from '../../services/shows';
import { fetchArtistBySlug } from '../../services/artists';
import './EpisodeDetail.css';

interface EpisodeDetailProps {
  episode: Episode;
}

export function EpisodeDetail({ episode }: EpisodeDetailProps) {
  const { pause, isPlaying } = useAudioPlayer();
  const { openPlayer } = useEpisodePlayer();
  const queryClient = useQueryClient();

  // Get episode image URL (from show or episode)
  const showImage = episode.link_episode_to_show?.ShowImage;
  const episodeImage = episode.EpisodeImage;
  const imageUrl = episodeImage?.formats?.large?.url || episodeImage?.url || showImage?.formats?.large?.url || showImage?.url;

  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
  const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;

  // Format broadcast date
  const broadcastDate = new Date(episode.BroadcastDateTime);
  const formattedDate = broadcastDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Get all hosts from show and combine with guest artists
  const hosts = episode.link_episode_to_show?.Main_Host || [];
  const guests = episode.guest_artists || [];
  const allArtists = [...hosts, ...guests];

  // Handle play button clicks
  const handlePlayClick = (type: 'soundcloud' | 'mixcloud', url: string) => {
    // Pause radio if playing
    if (isPlaying) {
      pause();
    }

    // Open global player
    openPlayer(type, url, episode.EpisodeTitle, episode.link_episode_to_show?.ShowName);
  };

  // Prefetch show on hover
  const prefetchShow = (showSlug: string) => {
    queryClient.prefetchQuery({
      queryKey: ['shows', showSlug],
      queryFn: () => fetchShowBySlug(showSlug),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Prefetch artist on hover
  const prefetchArtist = (artistSlug: string) => {
    queryClient.prefetchQuery({
      queryKey: ['artists', artistSlug],
      queryFn: () => fetchArtistBySlug(artistSlug),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  return (
    <div className="episode-detail">
      {/* Hero Section */}
      <div className="episode-detail__hero">
        {/* Episode/Show Image */}
        <div className="episode-detail__image">
          {fullImageUrl ? (
            <img
              src={fullImageUrl}
              alt={episodeImage?.alternativeText || episode.EpisodeTitle}
            />
          ) : (
            <div className="episode-detail__placeholder episode-detail__placeholder--logo">
              <img
                src="/Images/SMFM LOGO SVG.svg"
                alt="SMFM Logo"
                className="episode-detail__placeholder-logo"
              />
            </div>
          )}
        </div>

        {/* Episode Info */}
        <div className="episode-detail__info">


          <h1 className="episode-detail__title">{episode.EpisodeTitle}</h1>

          {/* Staff Pick Badge */}
          {episode.StaffPick && (
            <div className="episode-detail__staff-pick">
              <div className="episode-detail__staff-pick-header">
                <img
                  src="/Images/Hand1_Light.webp"
                  alt="Hand icon"
                  className="episode-detail__staff-pick-icon"
                />
                <span className="episode-detail__staff-pick-text">Staff Pick</span>
              </div>
              {episode.StaffPickComments && (
                <div className="episode-detail__staff-pick-comments">
                  {episode.StaffPickComments}
                </div>
              )}
            </div>
          )}

          {/* Broadcast Date */}
          <div className="episode-detail__broadcast">
            <div className="episode-detail__date">{formattedDate}</div>
          </div>

          {/* View Show Page Button */}
          {episode.link_episode_to_show && (
            <Link
              to="/shows/$slug"
              params={{ slug: episode.link_episode_to_show.ShowSlug }}
              className="episode-detail__show-button"
              onMouseEnter={() => prefetchShow(episode.link_episode_to_show!.ShowSlug)}
            >
              View {episode.link_episode_to_show.ShowName} show page
            </Link>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="episode-detail__tags">
        {episode.tag_genres?.map((genre) => (
          <Link
            key={genre.id}
            to="/tags/$type/$value"
            params={{ type: 'genre', value: encodeURIComponent(genre.Genre) }}
            className="episode-detail__tag episode-detail__tag--genre"
          >
            {genre.Genre}
          </Link>
        ))}
        {episode.tag_themes?.map((theme) => (
          <Link
            key={theme.id}
            to="/tags/$type/$value"
            params={{ type: 'theme', value: encodeURIComponent(theme.Theme) }}
            className="episode-detail__tag episode-detail__tag--theme"
          >
            {theme.Theme}
          </Link>
        ))}
      </div>

      {/* Action Buttons */}
      {(episode.SoundcloudLink || episode.MixCloudLink) && (
        <div className="episode-detail__actions-section">
          <div className="episode-detail__actions-label">Listen back on:</div>
          <div className="episode-detail__actions">
            {episode.SoundcloudLink && (
              <button
                onClick={() => handlePlayClick('soundcloud', episode.SoundcloudLink!)}
                className="episode-detail__play-button episode-detail__play-button--soundcloud"
                aria-label="Play on SoundCloud"
              >
                SoundCloud
              </button>
            )}
            {episode.MixCloudLink && (
              <button
                onClick={() => handlePlayClick('mixcloud', episode.MixCloudLink!)}
                className="episode-detail__play-button episode-detail__play-button--mixcloud"
                aria-label="Play on MixCloud"
              >
                MixCloud
              </button>
            )}
          </div>
        </div>
      )}

      {/* Artists Section */}
      {allArtists.length > 0 && (
        <section className="episode-detail__section">
          <h2 className="episode-detail__section-title">Artists</h2>
          <div className="episode-detail__guests">
            {allArtists.map((artist) => (
              <Link
                key={artist.id}
                to="/artists/$slug"
                params={{ slug: artist.Artist_Slug }}
                className="episode-detail__guest-link"
                onMouseEnter={() => prefetchArtist(artist.Artist_Slug)}
              >
                <div className="episode-detail__guest-card">
                  <div className="episode-detail__guest-image">
                    {artist.ArtistImage ? (
                      <img
                        src={`${STRAPI_URL}${artist.ArtistImage.formats?.small?.url || artist.ArtistImage.url}`}
                        alt={artist.ArtistImage.alternativeText || artist.ArtistName}
                      />
                    ) : (
                      <div className="episode-detail__guest-placeholder">
                        {artist.ArtistName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="episode-detail__guest-name">{artist.ArtistName}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Episode Description Section */}
      {episode.EpisodeDescription && (
        <section className="episode-detail__section">
          <h2 className="episode-detail__section-title">Description</h2>
          <div className="episode-detail__description">{episode.EpisodeDescription}</div>
        </section>
      )}

      {/* Tracklist Section */}
      {episode.Tracklist && episode.Tracklist.length > 0 && (
        <section className="episode-detail__section">
          <h2 className="episode-detail__section-title">Tracklist</h2>
          <div className="episode-detail__tracklist">
            {episode.Tracklist.map((track) => (
              <div key={track.id}>
                {track.Artist} - {track.Track_Title}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
