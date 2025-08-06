import Image from 'next/image';
import Link from 'next/link';

interface News {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags?: string[];
  images?: Array<{
    url: string;
    caption?: string;
    alt?: string;
  }>;
  published_date: Date;
  author?: string;
  ai_enhanced?: boolean;
  status: 'draft' | 'published' | 'archived';
}

interface NewsCardProps {
  news: News;
  showCategory?: boolean;
  showAIBadge?: boolean;
  className?: string;
}

export default function NewsCard({ 
  news, 
  showCategory = true, 
  showAIBadge = true,
  className = ''
}: NewsCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const generateSlug = (title: string, id: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    return `${slug}-${id}`;
  };

  const newsUrl = `/haber/${generateSlug(news.title, news.id)}`;

  return (
    <article className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group ${className}`}>
      {/* Image */}
      {news.images && news.images.length > 0 && (
        <div className="relative h-48 overflow-hidden">
          <Link href={newsUrl}>
            <Image
              src={news.images[0].url}
              alt={news.images[0].alt || news.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </Link>
          
          {/* Category Badge */}
          {showCategory && news.category && (
            <div className="absolute top-3 left-3">
              <Link 
                href={`/kategori/${news.category}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors capitalize"
              >
                {news.category}
              </Link>
            </div>
          )}

          {/* AI Badge */}
          {showAIBadge && news.ai_enhanced && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                🤖 AI
              </span>
            </div>
          )}

          {/* Status Badge */}
          {news.status !== 'published' && (
            <div className="absolute bottom-3 right-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                news.status === 'draft' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-600 text-white'
              }`}>
                {news.status === 'draft' ? 'Taslak' : 'Arşiv'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Link href={newsUrl}>
            {news.title}
          </Link>
        </h3>

        {/* Summary */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
          {news.summary}
        </p>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {news.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
            {news.tags.length > 3 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{news.tags.length - 3} daha
              </span>
            )}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            {news.author && (
              <span className="flex items-center gap-1">
                👤 {news.author}
              </span>
            )}
          </div>
          
          <time dateTime={news.published_date.toISOString()}>
            {formatDate(news.published_date)}
          </time>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </article>
  );
}
