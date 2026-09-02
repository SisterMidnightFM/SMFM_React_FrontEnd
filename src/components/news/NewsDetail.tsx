import { Link } from '@tanstack/react-router';
import type { News } from '../../types/news';
import type { StrapiImage } from '../../types/strapi';
import { renderRichText } from '../../utils/renderRichText';
import './NewsDetail.css';

interface NewsDetailProps {
  news: News;
}

export function NewsDetail({ news }: NewsDetailProps) {
  const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

  // Get cover image URL - handle both object and array formats
  const coverImage: StrapiImage | undefined = Array.isArray(news.CoverImage) && news.CoverImage.length > 0
    ? news.CoverImage[0]
    : !Array.isArray(news.CoverImage)
    ? news.CoverImage
    : undefined;

  const imageUrl = coverImage?.formats?.large?.url || coverImage?.formats?.medium?.url || coverImage?.url;
  const fullImageUrl = imageUrl ? `${STRAPI_URL}${imageUrl}` : null;

  // Format creation date
  const createdDate = new Date(news.createdAt);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Get writer(s) - artists array
  const writers = news.artists && news.artists.length > 0 ? news.artists : null;

  return (
    <div className="news-detail">
      {/* Title Section - Always on top */}
      <div className="news-detail__header">
        <h1 className="news-detail__title">{news.News_Title}</h1>
        <div className="news-detail__date">{formattedDate}</div>

        {/* Writer(s) Section */}
        {writers && (
          <div className="news-detail__writers">
            <span className="news-detail__writers-label">Written by</span>
            <div className="news-detail__writers-list">
              {writers.map((writer) => (
                <Link
                  key={writer.id}
                  to="/artists/$slug"
                  params={{ slug: writer.Artist_Slug }}
                  className="news-detail__writer-link"
                >
                  <div className="news-detail__writer-card">
                    {writer.ArtistImage && (
                      <div className="news-detail__writer-image">
                        <img
                          src={`${STRAPI_URL}${writer.ArtistImage.formats?.small?.url || writer.ArtistImage.url}`}
                          alt={writer.ArtistImage.alternativeText || writer.ArtistName}
                        />
                      </div>
                    )}
                    <span className="news-detail__writer-name">{writer.ArtistName}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area - Image and Text side by side on desktop */}
      <div className="news-detail__main">
        {/* Cover Image */}
        {fullImageUrl && (
          <div className="news-detail__cover-image">
            <img
              src={fullImageUrl}
              alt={coverImage?.alternativeText || news.News_Title}
              fetchPriority="high"
            />
          </div>
        )}

        {/* News Content - Render rich text */}
        {news.News_Text && (
          <div className="news-detail__content">
            {renderRichText(news.News_Text)}
          </div>
        )}
      </div>

      {/* Additional Images */}
      {news.Additional_Images && news.Additional_Images.length > 0 && (
        <section className="news-detail__section">
          <h2 className="news-detail__section-title">More Pics</h2>
          <div className="news-detail__gallery">
            {news.Additional_Images.map((image) => (
              <div key={image.id} className="news-detail__gallery-item">
                <img
                  src={`${STRAPI_URL}${image.formats?.medium?.url || image.url}`}
                  alt={image.alternativeText || ''}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
