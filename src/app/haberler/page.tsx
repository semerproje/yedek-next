import { Metadata } from 'next';
import { ultraPremiumAANewsManager } from '@/services/ultraPremiumAANewsManager';
import { categoryMappingService } from '@/services/categoryMappingService';
import NewsCard from '@/components/NewsCard';
import Pagination from '@/components/Pagination';
import CategoryFilter from '@/components/CategoryFilter';
import { Suspense } from 'react';

interface NewsListPageProps {
  searchParams?: {
    page?: string;
    category?: string;
    search?: string;
    status?: string;
  };
}

export const metadata: Metadata = {
  title: 'Tüm Haberler | Ultra Premium Haber Sistemi',
  description: 'En son haberler, AA ajansından anlık haber güncellemeleri ve AI ile geliştirilmiş içerikler',
  keywords: 'haberler, aa ajansı, güncel haberler, son dakika, haber sistemi',
  openGraph: {
    title: 'Tüm Haberler | Ultra Premium Haber Sistemi',
    description: 'En son haberler, AA ajansından anlık haber güncellemeleri ve AI ile geliştirilmiş içerikler',
    type: 'website',
  },
};

async function getNews(searchParams: NewsListPageProps['searchParams']) {
  try {
    const page = parseInt(searchParams?.page || '1');
    const limit = 20;
    const offset = (page - 1) * limit;

    const filters: any = {
      limit,
      offset,
      status: searchParams?.status || 'published',
    };

    if (searchParams?.category) {
      filters.category = searchParams.category;
    }

    if (searchParams?.search) {
      filters.search = searchParams.search;
    }

    const news = await ultraPremiumAANewsManager.getAllNews(filters);
    
    // Get total count for pagination
    const totalNews = await ultraPremiumAANewsManager.getAllNews({ 
      ...filters, 
      limit: 1000 // Get all for count
    });

    return {
      news: news.slice(0, limit),
      total: totalNews.length,
      currentPage: page,
      totalPages: Math.ceil(totalNews.length / limit),
      hasMore: totalNews.length > page * limit
    };
  } catch (error) {
    console.error('Error fetching news:', error);
    return {
      news: [],
      total: 0,
      currentPage: 1,
      totalPages: 1,
      hasMore: false
    };
  }
}

async function getCategories() {
  try {
    const mappings = await categoryMappingService.getActiveMappings();
    return mappings.map(mapping => ({
      id: mapping.site_slug,
      name: mapping.site_name,
      count: 0 // You can implement count logic if needed
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Loading component
function NewsListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

async function NewsContent({ searchParams }: { searchParams: NewsListPageProps['searchParams'] }) {
  const [newsData, categories] = await Promise.all([
    getNews(searchParams),
    getCategories()
  ]);

  const { news, total, currentPage, totalPages, hasMore } = newsData;

  return (
    <>
      {/* Stats Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{total}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Toplam Haber</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{categories.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Kategori</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{currentPage}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sayfa</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Canlı Güncelleme
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <CategoryFilter 
        categories={categories} 
        selectedCategory={searchParams?.category}
        currentSearch={searchParams?.search}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {searchParams?.category ? `${searchParams.category} Haberleri` : 'Tüm Haberler'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {total} haber bulundu
            {searchParams?.search && ` - "${searchParams.search}" için arama sonuçları`}
          </p>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="newest">En Yeni</option>
            <option value="oldest">En Eski</option>
            <option value="popular">En Popüler</option>
          </select>
        </div>
      </div>

      {/* News Grid */}
      {news.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {news.map((newsItem) => (
              <NewsCard 
                key={newsItem.id} 
                news={newsItem}
                showCategory={!searchParams?.category}
                showAIBadge={true}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasMore={hasMore}
            baseUrl="/haberler"
            searchParams={searchParams}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Henüz haber bulunmuyor
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchParams?.search 
              ? `"${searchParams.search}" için arama sonucu bulunamadı.`
              : 'Bu kategoride henüz haber bulunmuyor.'
            }
          </p>
          
          {searchParams?.search && (
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p>Arama ipuçları:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Farklı anahtar kelimeler deneyin</li>
                <li>Daha genel terimler kullanın</li>
                <li>Yazım hatalarını kontrol edin</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Auto Refresh Indicator */}
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-600 dark:text-gray-400">Otomatik güncelleme aktif</span>
        </div>
      </div>
    </>
  );
}

export default async function NewsListPage({ searchParams }: NewsListPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Ultra Premium Haberler
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AA ajansından anlık haberler, AI ile geliştirilmiş içerikler
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Box */}
              <form method="GET" className="flex items-center gap-2">
                <input
                  type="text"
                  name="search"
                  placeholder="Haber ara..."
                  defaultValue={searchParams?.search}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔍
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Content */}
        <Suspense fallback={<NewsListSkeleton />}>
          <NewsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
