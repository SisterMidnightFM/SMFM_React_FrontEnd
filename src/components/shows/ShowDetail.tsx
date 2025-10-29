import { Link } from '@tanstack/react-router';
import type { Show } from '../../types/show';
import './ShowDetail.css';

interface ShowDetailProps {
  show: Show;
}

export function ShowDetail({ show }: ShowDetailProps) {
  // Get show image URL
  const imageUrl = show.ShowImage?.formats?.large?.url || show.ShowImage?.url;
  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
  const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;

  // Extract description text from StrapiRichText
  const descriptionText = show.ShowDescription?.map(paragraph =>
    paragraph.children.map(child => child.text).join('')
  ).join('\n\n');

  // Format broadcast schedule
  const broadcastSchedule = show.Broadcast_Day && show.Broadcast_Time && show.Broadcast_AmPm
    ? `${show.Broadcast_Day}s at ${show.Broadcast_Time}${show.Broadcast_AmPm}`
    : null;

  // Main_Host is an array of hosts
  const mainHosts = show.Main_Host && show.Main_Host.length > 0 ? show.Main_Host : [];

  return (
    <div className="show-detail">
      {/* Hero Section */}
      <div className="show-detail__hero">
        {/* Show Image */}
        <div className="show-detail__image">
          {fullImageUrl ? (
            <img
              src={fullImageUrl}
              alt={show.ShowImage?.alternativeText || show.ShowName}
            />
          ) : (
            <div className="show-detail__placeholder">
              <span>SHOW IMAGE</span>
            </div>
          )}
        </div>

        {/* Show Info */}
        <div className="show-detail__info">
          <h1 className="show-detail__name">{show.ShowName}</h1>

          {/* Broadcast Schedule */}
          {broadcastSchedule && (
            <div className="show-detail__schedule">
              <img src="/icons/calendar.svg" alt="" className="show-detail__schedule-icon" />
              {broadcastSchedule}
            </div>
          )}

          {/* Main Hosts */}
          {mainHosts.length > 0 && (
            <div className="show-detail__host-section">
              <span className="show-detail__host-label">
                Hosted by
              </span>
              <div className="show-detail__hosts-grid">
                {mainHosts.map((host) => (
                  <Link
                    key={host.id}
                    to="/artists/$slug"
                    params={{ slug: host.Artist_Slug }}
                    className="show-detail__host-link"
                  >
                    <div className="show-detail__host-card">
                      {host.ArtistImage && (
                        <div className="show-detail__host-image">
                          <img
                            src={`${STRAPI_URL}${host.ArtistImage.formats?.small?.url || host.ArtistImage.url}`}
                            alt={host.ArtistImage.alternativeText || host.ArtistName}
                          />
                        </div>
                      )}
                      <span className="show-detail__host-name">{host.ArtistName}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description Section */}
      {descriptionText && (
        <section className="show-detail__section">
          <h2 className="show-detail__section-title">About</h2>
          <div className="show-detail__description">{descriptionText}</div>
        </section>
      )}

      {/* Episodes Section */}
      {show.Show_Episodes && show.Show_Episodes.length > 0 && (
        <section className="show-detail__section">
          <h2 className="show-detail__section-title">Recent Episodes</h2>
          <div className="show-detail__episodes">
            {show.Show_Episodes.slice(0, 12).map((episode) => (
              <Link
                key={episode.id}
                to="/episodes/$slug"
                params={{ slug: episode.EpisodeSlug }}
                className="show-detail__episode-card"
              >
                <div className="show-detail__episode-title">{episode.EpisodeTitle}</div>
                {episode.BroadcastDateTime && (
                  <div className="show-detail__episode-date">
                    {new Date(episode.BroadcastDateTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                )}
                {episode.guest_artists && episode.guest_artists.length > 0 && (
                  <div className="show-detail__episode-guests">
                    Guests: {episode.guest_artists.map(a => a.ArtistName).join(', ')}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
