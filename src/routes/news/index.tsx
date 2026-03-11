import { createFileRoute } from '@tanstack/react-router';
import { useNews } from '../../hooks/useNews';
import { NewsList } from '../../components/news/NewsList';
import { PageHeader } from '../../components/shared/PageHeader';

export const Route = createFileRoute('/news/')({
  component: NewsListPage,
});

function NewsListPage() {
  const { news, isLoading, isLoadingMore, error, hasMore, fetchNextPage } = useNews();

  return (
    <div className="news-list-page">
      <PageHeader
        title="News"
        iconSrc="/Images/Cat_Dark.webp"
      />

      <NewsList
        news={news}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={fetchNextPage}
      />
    </div>
  );
}
