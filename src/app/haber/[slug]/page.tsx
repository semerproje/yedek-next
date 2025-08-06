import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ultraPremiumAAService } from '@/services/ultraPremiumAAService';
import Image from 'next/image';
import Link from 'next/link';

interface NewsDetailPageProps {
  params: {
    slug: string;
  };
}

interface News {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  images: Array<{
    url: string;
    caption?: string;
    alt?: string;
  }>;
  published_date: Date;
  aa_news_id?: string;
  seo_title?: string;
  seo_description?: string;
  keywords?: string[];
  author?: string;
  location?: string;
  source?: string;
  ai_enhanced?: boolean;
  enhanced_content?: string;
  enhanced_summary?: string;
  status: 'draft' | 'published' | 'archived';
}

async function getNews(slug: string): Promise<News | null> {
  try {
    // Try to get news by slug from Firebase
    const newsRef = doc(db, 'news', slug);
    const newsSnap = await getDoc(newsRef);
    
    if (newsSnap.exists()) {
      const data = newsSnap.data();
      return {
        id: newsSnap.id,
        ...data,
        published_date: data.published_date?.toDate() || new Date(),
      } as News;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
}

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
  const news = await getNews(params.slug);
  
  if (!news) {
    return {
      title: 'Haber Bulunamadı',
      description: 'Aradığınız haber bulunamadı.',
    };
  }

  const title = news.seo_title || news.title;
  const description = news.seo_description || news.summary;
  const keywords = news.keywords || news.tags;
  
  return {
    title,
    description,
    keywords: keywords?.join(', '),
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: news.published_date.toISOString(),
      authors: news.author ? [news.author] : undefined,
      images: news.images?.map(img => ({
        url: img.url,
        alt: img.alt || news.title,
      })),
      siteName: 'Haber Sitesi',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: news.images?.[0]?.url,
    },
    robots: {
      index: news.status === 'published',
      follow: news.status === 'published',
    },
    alternates: {
      canonical: `/haber/${params.slug}`,
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const news = await getNews(params.slug);

  if (!news) {
    notFound();
  }

  // Use AI enhanced content if available
  const displayContent = news.ai_enhanced && news.enhanced_content 
    ? news.enhanced_content 
    : news.content;
    
  const displaySummary = news.ai_enhanced && news.enhanced_summary 
    ? news.enhanced_summary 
    : news.summary;

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Article Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Ana Sayfa
                </Link>
              </li>
              <li>→</li>
              <li>
                <Link 
                  href={`/kategori/${news.category}`}
                  className="hover:text-blue-600 dark:hover:text-blue-400 capitalize"
                >
                  {news.category}
                </Link>
              </li>
              <li>→</li>
              <li className="text-gray-700 dark:text-gray-300">Haber Detayı</li>
            </ol>
          </nav>

          {/* Category Badge */}
          {news.category && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 capitalize">
                {news.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {news.title}
          </h1>

          {/* Summary */}
          {displaySummary && (
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              {displaySummary}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            {news.author && (
              <div className="flex items-center gap-1">
                <span>👤</span>
                <span>{news.author}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <span>📅</span>
              <time dateTime={news.published_date.toISOString()}>
                {formatDate(news.published_date)}
              </time>
            </div>

            {news.location && (
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span>{news.location}</span>
              </div>
            )}

            {news.source && (
              <div className="flex items-center gap-1">
                <span>📰</span>
                <span>{news.source}</span>
              </div>
            )}

            {news.ai_enhanced && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <span>🤖</span>
                <span>AI Geliştirilmiş</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {news.tags && news.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {news.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Image */}
        {news.images && news.images.length > 0 && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={news.images[0].url}
              alt={news.images[0].alt || news.title}
              width={800}
              height={450}
              className="w-full h-auto object-cover"
              priority
            />
            {news.images[0].caption && (
              <div className="bg-gray-100 dark:bg-gray-800 p-3">
                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                  {news.images[0].caption}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />
        </div>

        {/* Additional Images */}
        {news.images && news.images.length > 1 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Diğer Görseller
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.images.slice(1).map((image, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={image.url}
                    alt={image.alt || `${news.title} - Görsel ${index + 2}`}
                    width={400}
                    height={250}
                    className="w-full h-auto object-cover"
                  />
                  {image.caption && (
                    <div className="bg-gray-100 dark:bg-gray-800 p-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related News */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            İlgili Haberler
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            İlgili haberler yakında eklenecek...
          </p>
        </div>
      </main>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            "headline": news.title,
            "description": displaySummary,
            "author": {
              "@type": "Person",
              "name": news.author || "Editör"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Haber Sitesi"
            },
            "datePublished": news.published_date.toISOString(),
            "dateModified": news.published_date.toISOString(),
            "image": news.images?.[0]?.url,
            "articleSection": news.category,
            "keywords": news.tags?.join(', '),
            "url": `https://example.com/haber/${params.slug}`
          })
        }}
      />
    </article>
  );
}
