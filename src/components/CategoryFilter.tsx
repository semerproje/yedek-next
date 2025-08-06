import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  count?: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory?: string;
  currentSearch?: string;
  className?: string;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  currentSearch,
  className = ''
}: CategoryFilterProps) {
  // Helper function to build URL with search params
  const buildUrl = (category?: string) => {
    const params = new URLSearchParams();
    
    if (category) {
      params.set('category', category);
    }
    
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    
    const queryString = params.toString();
    return queryString ? `/haberler?${queryString}` : '/haberler';
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6 ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        {/* All Categories */}
        <Link
          href={buildUrl()}
          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedCategory
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <span className="mr-1">📰</span>
          Tüm Haberler
        </Link>

        {/* Category Buttons */}
        {categories.map((category) => (
          <Link
            key={category.id}
            href={buildUrl(category.id)}
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {/* Category icon based on name */}
            <span className="mr-1">
              {getCategoryIcon(category.id)}
            </span>
            
            {category.name}
            
            {/* Count badge */}
            {category.count !== undefined && category.count > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
              }`}>
                {category.count}
              </span>
            )}
          </Link>
        ))}

        {/* Mobile Dropdown for many categories */}
        {categories.length > 6 && (
          <div className="md:hidden relative">
            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                const category = e.target.value || undefined;
                window.location.href = buildUrl(category);
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="">Kategori Seç</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                  {category.count !== undefined && ` (${category.count})`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(selectedCategory || currentSearch) && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Aktif filtreler:</span>
            
            {selectedCategory && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm">
                <span>Kategori: {categories.find(c => c.id === selectedCategory)?.name || selectedCategory}</span>
                <Link 
                  href={buildUrl()}
                  className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  ×
                </Link>
              </div>
            )}
            
            {currentSearch && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-sm">
                <span>Arama: "{currentSearch}"</span>
                <Link 
                  href={buildUrl(selectedCategory)}
                  className="ml-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                >
                  ×
                </Link>
              </div>
            )}
            
            {/* Clear All */}
            <Link
              href="/haberler"
              className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 underline"
            >
              Tümünü Temizle
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get category icons
function getCategoryIcon(categoryId: string): string {
  const iconMap: Record<string, string> = {
    'politika': '🏛️',
    'ekonomi': '💰',
    'spor': '⚽',
    'teknoloji': '💻',
    'saglik': '🏥',
    'kultur': '🎭',
    'egitim': '📚',
    'cevre': '🌱',
    'gundem': '📢',
    'dunya': '🌍',
    'yasam': '🏠',
    'sanat': '🎨',
    'bilim': '🔬',
    'otomobil': '🚗',
    'magazin': '✨',
    'hukuk': '⚖️',
    'turizm': '✈️',
    'tarih': '📜',
    'din': '🕌',
    'askeri': '🪖',
  };

  return iconMap[categoryId.toLowerCase()] || '📰';
}
