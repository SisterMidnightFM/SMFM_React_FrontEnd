import { useQueryClient } from '@tanstack/react-query';
import { Card } from '../shared/Card';
import './NewsCard.css';
import type { News } from '../../types/news';
import { extractRichText, truncateText, formatDate } from '../../utils/cardHelpers';
import { fetchNewsBySlug } from '../../services/news';

interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  const queryClient = useQueryClient();

  const handleMouseEnter = () => {
    queryClient.prefetchQuery({
      queryKey: ['news', news.News_Slug],
      queryFn: () => fetchNewsBySlug(news.News_Slug),
      staleTime: 5 * 60 * 1000,
    });
  };
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
      onMouseEnter={handleMouseEnter}
    />
  );
}
