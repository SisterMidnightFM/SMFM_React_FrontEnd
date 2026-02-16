import { Card } from '../shared/Card';
import './NewsCard.css';
import type { News } from '../../types/news';
import { extractRichText, truncateText, formatDate } from '../../utils/cardHelpers';

interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  // Handle both object and array formats for CoverImage
  const coverImage = Array.isArray(news.CoverImage) && news.CoverImage.length > 0
    ? news.CoverImage[0]
    : Array.isArray(news.CoverImage)
    ? null
    : news.CoverImage;

  // Extract and truncate preview text
  const previewText = extractRichText(news.News_Text);

  return (
    <Card
      to="/news/$slug"
      params={{ slug: news.News_Slug }}
      image={coverImage}
      headerText={news.News_Title}
      descriptiveText={formatDate(news.createdAt)}
      descriptiveText2={truncateText(previewText, 120)}
      className="news-card"
    />
  );
}
