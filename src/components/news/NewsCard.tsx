import { Card } from '../shared/Card';
import type { News } from '../../types/news';
import { extractRichText, truncateText } from '../../utils/cardHelpers';

interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  // Handle both object and array formats for CoverImage
  const coverImage = Array.isArray(news.CoverImage) && news.CoverImage.length > 0
    ? news.CoverImage[0]
    : news.CoverImage;

  // Format creation date
  const createdDate = new Date(news.createdAt);
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Extract and truncate preview text
  const previewText = extractRichText(news.News_Text);

  return (
    <Card
      to="/news/$slug"
      params={{ slug: news.News_Slug }}
      image={coverImage}
      headerText={news.News_Title}
      descriptiveText={formattedDate}
      descriptiveText2={truncateText(previewText, 120)}
      className="news-card"
    />
  );
}
