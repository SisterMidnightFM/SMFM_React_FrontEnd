import { Link } from '@tanstack/react-router';
import type { Artist } from '../../types/artist';
import type { TagLocation } from '../../types/tag';
import './ArtistDetail.css';

interface ArtistDetailProps {
  artist: Artist;
}

// Helper function to convert Instagram handle to URL
const getInstagramUrl = (handle: string): string => {
  // Remove @ symbol if present and any whitespace
  const cleanHandle = handle.replace(/^@/, '').trim();

  // If it's already a full URL, return as is
  if (cleanHandle.startsWith('http://') || cleanHandle.startsWith('https://')) {
    return cleanHandle;
  }

  // Otherwise, construct Instagram URL
  return `https://www.instagram.com/${cleanHandle}/`;
};

export function ArtistDetail({ artist }: ArtistDetailProps) {
  // Get artist image URL
  const imageUrl = artist.ArtistImage?.formats?.large?.url || artist.ArtistImage?.url;
  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
  const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;

  return (
    <div className="artist-detail">
        {/* Hero Section */}
        <div className="artist-detail__hero">
        {/* Artist Image */}
        <div className="artist-detail__image">
          {fullImageUrl ? (
            <img
              src={fullImageUrl}
              alt={artist.ArtistImage?.alternativeText || artist.ArtistName}
            />
          ) : (
            <div className="artist-detail__placeholder">
              <span>ARTIST IMAGE</span>
            </div>
          )}
        </div>

        {/* Artist Info */}
        <div className="artist-detail__info">
          <h1 className="artist-detail__name">{artist.ArtistName}</h1>

          {/* Location Tags */}
          {artist.tag_locations && artist.tag_locations.length > 0 && (
            <div className="artist-detail__locations">
              {artist.tag_locations.map((location: TagLocation) => (
                <span key={location.id} className="artist-detail__location-tag">
                  <img src="/icons/location.svg" width="12" height="12" alt="" className="artist-detail__location-icon" />
                  {location.Location}
                </span>
              ))}
            </div>
          )}

          {/* Social Links */}
          {(artist.ArtistInstagram || artist.ArtistWebsite) && (
            <div className="artist-detail__social">
              {artist.ArtistInstagram && (
                <a
                  href={getInstagramUrl(artist.ArtistInstagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artist-detail__social-link artist-detail__social-link--instagram"
                >
                  <img src="/icons/instagram.svg" width="16" height="16" alt="" className="artist-detail__social-icon" />
                  {artist.ArtistInstagram}
                </a>
              )}
              {artist.ArtistWebsite && (
                <a
                  href={artist.ArtistWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artist-detail__social-link"
                >
                  <img src="/icons/website.svg" width="16" height="16" alt="" className="artist-detail__social-icon" />
                  Website
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bio Section */}
      {artist.ArtistBio && (
        <section className="artist-detail__section">
          <h2 className="artist-detail__section-title">Bio</h2>
          <div className="artist-detail__bio">{artist.ArtistBio}</div>
        </section>
      )}

      {/* Shows Section */}
      {artist.Main_host && artist.Main_host.length > 0 && (
        <section className="artist-detail__section">
          <h2 className="artist-detail__section-title">Hosted Shows</h2>
          <div className="artist-detail__shows">
            {artist.Main_host.map((show) => (
              <Link
                key={show.id}
                to="/shows/$slug"
                params={{ slug: show.ShowSlug }}
                className="artist-detail__show-card"
              >
                {show.ShowImage && (
                  <div className="artist-detail__show-image">
                    <img
                      src={`${STRAPI_URL}${show.ShowImage.formats?.small?.url || show.ShowImage.url}`}
                      alt={show.ShowImage.alternativeText || show.ShowName}
                    />
                  </div>
                )}
                <div className="artist-detail__show-info">
                  <div className="artist-detail__show-name">{show.ShowName}</div>
                  {show.Broadcast_Day && show.Broadcast_Time && (
                    <div className="artist-detail__show-schedule">
                      {show.Broadcast_Day}s at {show.Broadcast_Time}{show.Broadcast_AmPm}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Guest Appearances Section */}
      {artist.episodes_guest_featured && artist.episodes_guest_featured.length > 0 && (
        <section className="artist-detail__section">
          <h2 className="artist-detail__section-title">Guest Appearances</h2>
          <div className="artist-detail__episodes">
            {artist.episodes_guest_featured.map((episode) => (
              <Link
                key={episode.id}
                to="/episodes/$slug"
                params={{ slug: episode.EpisodeSlug }}
                className="artist-detail__episode-card"
              >
                <div className="artist-detail__episode-info">
                  <div className="artist-detail__episode-show">
                    {episode.link_episode_to_show?.ShowName}
                  </div>
                  <div className="artist-detail__episode-title">
                    {episode.EpisodeTitle}
                  </div>
                  {episode.BroadcastDateTime && (
                    <div className="artist-detail__episode-date">
                      {new Date(episode.BroadcastDateTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Written Articles Section */}
      {artist.blogs_written && artist.blogs_written.length > 0 && (
        <section className="artist-detail__section">
          <h2 className="artist-detail__section-title">Blogs</h2>
          <div className="artist-detail__blogs">
            {artist.blogs_written.map((blog) => (
              <Link
                key={blog.id}
                to="/news/$slug"
                params={{ slug: blog.News_Slug }}
                className="artist-detail__blog-card"
              >
                {blog.CoverImage && (
                  <div className="artist-detail__blog-image">
                    <img
                      src={`${STRAPI_URL}${
                        Array.isArray(blog.CoverImage)
                          ? blog.CoverImage[0]?.formats?.small?.url || blog.CoverImage[0]?.url
                          : blog.CoverImage.formats?.small?.url || blog.CoverImage.url
                      }`}
                      alt={
                        Array.isArray(blog.CoverImage)
                          ? blog.CoverImage[0]?.alternativeText || blog.News_Title
                          : blog.CoverImage.alternativeText || blog.News_Title
                      }
                    />
                  </div>
                )}
                <div className="artist-detail__blog-info">
                  <div className="artist-detail__blog-title">{blog.News_Title}</div>
                  <div className="artist-detail__blog-date">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
