import { HomepageModuleService, CategoryService, NewsModuleService } from '@/lib/services/homepageService'
import { HomepageModule, CategoryManagement, NewsModuleConfig } from '@/types/admin'

// Default homepage modules configuration
const defaultModules: Omit<HomepageModule, 'id' | 'createdAt' | 'lastModified'>[] = [
  {
    key: 'breaking-news-bar',
    name: 'Son Dakika Haber Bandı',
    description: 'Sayfanın üst kısmında akan son dakika haberleri',
    component: 'BreakingNewsBar',
    active: true,
    order: 0,
    settings: {
      itemCount: 5,
      scrollSpeed: 'normal',
      showImages: false,
      autoUpdate: true,
      refreshInterval: 300000 // 5 minutes
    }
  },
  {
    key: 'main-headline',
    name: 'Ana Manşet Bölümü',
    description: 'Sayfanın en üst kısmındaki büyük manşet haberi',
    component: 'MainHeadlineSection',
    active: true,
    order: 1,
    settings: {
      itemCount: 1,
      showImage: true,
      showSummary: true,
      layout: 'banner'
    }
  },
  {
    key: 'headline-grid',
    name: 'Manşet Haber Grid\'i',
    description: 'Ana manşetin altındaki haber grid yapısı',
    component: 'HeadlineNewsGrid',
    active: true,
    order: 2,
    settings: {
      itemCount: 12,
      layout: 'grid',
      showImages: true,
      showSummary: true,
      showCategory: true,
      showDate: true
    }
  },
  {
    key: 'editor-picks',
    name: 'Editörün Seçimi',
    description: 'Editör tarafından seçilen öne çıkan haberler',
    component: 'EditorPicks',
    active: true,
    order: 3,
    settings: {
      itemCount: 3,
      layout: 'grid',
      showImages: true,
      showSummary: false
    }
  },
  {
    key: 'popular-sidebar',
    name: 'Popüler Haberler Yan Panel',
    description: 'Sayfanın sağ tarafındaki popüler haberler',
    component: 'PopularNewsSidebar',
    active: true,
    order: 4,
    settings: {
      itemCount: 10,
      layout: 'list',
      showImages: true,
      showViews: true,
      timeRange: 24 // hours
    }
  },
  {
    key: 'video-highlights',
    name: 'Video Öne Çıkanlar',
    description: 'Video içerikli haberlerin gösterildiği bölüm',
    component: 'VideoHighlights',
    active: true,
    order: 5,
    settings: {
      itemCount: 6,
      layout: 'grid',
      showThumbnails: true,
      showDuration: true
    }
  },
  {
    key: 'weekend-reads',
    name: 'Hafta Sonu Okumaları',
    description: 'Uzun form makaleler ve hafta sonu özel içerikleri',
    component: 'WeekendReadsSection',
    active: true,
    order: 6,
    settings: {
      itemCount: 4,
      layout: 'grid',
      showImages: true,
      showAuthor: true,
      showReadingTime: true
    }
  },
  {
    key: 'weather-currency',
    name: 'Hava Durumu ve Döviz',
    description: 'Anlık hava durumu ve döviz kurları',
    component: 'WeatherCurrencyPanel',
    active: true,
    order: 7,
    settings: {
      showWeather: true,
      showCurrency: true,
      updateInterval: 600000 // 10 minutes
    }
  },
  {
    key: 'money-markets',
    name: 'Borsa ve Piyasalar',
    description: 'Canlı borsa verileri ve piyasa göstergeleri',
    component: 'MoneyMarketsTicker',
    active: true,
    order: 8,
    settings: {
      showIndices: true,
      showCommodities: true,
      showCurrencies: true,
      tickerSpeed: 'normal'
    }
  },
  {
    key: 'ai-recommendations',
    name: 'AI Önerileri',
    description: 'Yapay zeka destekli haber önerileri',
    component: 'AiRecommendationPanel',
    active: false,
    order: 9,
    settings: {
      itemCount: 8,
      enablePersonalization: true,
      updateFrequency: 'hourly'
    }
  }
]

// Default categories
const defaultCategories: Omit<CategoryManagement, 'id' | 'createdAt' | 'lastModified' | 'newsCount'>[] = [
  {
    name: 'Son Dakika',
    slug: 'son-dakika',
    description: 'Gündemdeki son dakika haberleri',
    color: '#DC2626',
    icon: 'AlertCircle',
    active: true,
    order: 0
  },
  {
    name: 'Gündem',
    slug: 'gundem',
    description: 'Türkiye ve dünya gündem haberleri',
    color: '#2563EB',
    icon: 'Globe',
    active: true,
    order: 1
  },
  {
    name: 'Ekonomi',
    slug: 'ekonomi',
    description: 'Ekonomi, finans ve borsa haberleri',
    color: '#16A34A',
    icon: 'TrendingUp',
    active: true,
    order: 2
  },
  {
    name: 'Spor',
    slug: 'spor',
    description: 'Futbol, basketbol ve diğer spor haberleri',
    color: '#EA580C',
    icon: 'Trophy',
    active: true,
    order: 3
  },
  {
    name: 'Teknoloji',
    slug: 'teknoloji',
    description: 'Teknoloji, bilim ve inovasyon haberleri',
    color: '#7C3AED',
    icon: 'Smartphone',
    active: true,
    order: 4
  },
  {
    name: 'Sağlık',
    slug: 'saglik',
    description: 'Sağlık, tıp ve yaşam haberleri',
    color: '#059669',
    icon: 'Heart',
    active: true,
    order: 5
  },
  {
    name: 'Kültür Sanat',
    slug: 'kultur-sanat',
    description: 'Kültür, sanat ve etkinlik haberleri',
    color: '#DB2777',
    icon: 'Palette',
    active: true,
    order: 6
  },
  {
    name: 'Eğitim',
    slug: 'egitim',
    description: 'Eğitim sistemi ve öğrenci haberleri',
    color: '#0891B2',
    icon: 'GraduationCap',
    active: true,
    order: 7
  },
  {
    name: 'Otomobil',
    slug: 'otomobil',
    description: 'Otomobil sektörü ve ulaşım haberleri',
    color: '#4338CA',
    icon: 'Car',
    active: true,
    order: 8
  },
  {
    name: 'Yaşam',
    slug: 'yasam',
    description: 'Yaşam tarzı, moda ve seyahat haberleri',
    color: '#EC4899',
    icon: 'Coffee',
    active: true,
    order: 9
  }
]

// Default news module configurations
const defaultNewsConfigs: Omit<NewsModuleConfig, 'id' | 'lastModified'>[] = [
  {
    moduleKey: 'breaking-news-bar',
    title: 'Son Dakika Haberleri',
    categories: ['son-dakika', 'gundem'],
    newsIds: [],
    manualSelection: false,
    autoSelection: {
      enabled: true,
      criteria: {
        category: ['son-dakika', 'gundem'],
        dateRange: 1,
        minViews: 0,
        featured: true
      }
    },
    displaySettings: {
      count: 5,
      layout: 'list',
      showImage: false,
      showSummary: false,
      showCategory: false,
      showDate: true,
      showAuthor: false
    },
    active: true,
    order: 0
  },
  {
    moduleKey: 'main-headline',
    title: 'Ana Manşet',
    categories: ['gundem', 'ekonomi', 'spor'],
    newsIds: [],
    manualSelection: false,
    autoSelection: {
      enabled: true,
      criteria: {
        category: ['gundem', 'ekonomi', 'spor'],
        dateRange: 1,
        minViews: 1000,
        featured: true
      }
    },
    displaySettings: {
      count: 1,
      layout: 'grid',
      showImage: true,
      showSummary: true,
      showCategory: true,
      showDate: true,
      showAuthor: true
    },
    active: true,
    order: 1
  },
  {
    moduleKey: 'headline-grid',
    title: 'Manşet Haberleri',
    categories: ['gundem', 'ekonomi', 'spor', 'teknoloji'],
    newsIds: [],
    manualSelection: false,
    autoSelection: {
      enabled: true,
      criteria: {
        category: ['gundem', 'ekonomi', 'spor', 'teknoloji'],
        dateRange: 2,
        minViews: 100,
        featured: false
      }
    },
    displaySettings: {
      count: 12,
      layout: 'grid',
      showImage: true,
      showSummary: true,
      showCategory: true,
      showDate: true,
      showAuthor: false
    },
    active: true,
    order: 2
  },
  {
    moduleKey: 'editor-picks',
    title: 'Editörün Seçimi',
    categories: [],
    newsIds: [],
    manualSelection: true,
    autoSelection: {
      enabled: false,
      criteria: {}
    },
    displaySettings: {
      count: 3,
      layout: 'grid',
      showImage: true,
      showSummary: false,
      showCategory: true,
      showDate: false,
      showAuthor: false
    },
    active: true,
    order: 3
  },
  {
    moduleKey: 'popular-sidebar',
    title: 'Popüler Haberler',
    categories: [],
    newsIds: [],
    manualSelection: false,
    autoSelection: {
      enabled: true,
      criteria: {
        dateRange: 7,
        minViews: 500,
        featured: false
      }
    },
    displaySettings: {
      count: 10,
      layout: 'list',
      showImage: true,
      showSummary: false,
      showCategory: true,
      showDate: true,
      showAuthor: false
    },
    active: true,
    order: 4
  }
]

// Initialize homepage system with default data
export async function initializeHomepageSystem(): Promise<void> {
  try {
    console.log('Homepage sistemi başlatılıyor...')

    // Initialize modules
    console.log('Varsayılan modüller ekleniyor...')
    for (const moduleItem of defaultModules) {
      try {
        await HomepageModuleService.createModule(moduleItem)
        console.log(`✓ Modül eklendi: ${moduleItem.name}`)
      } catch (error) {
        console.warn(`Modül zaten mevcut olabilir: ${moduleItem.name}`, error)
      }
    }

    // Initialize categories
    console.log('Varsayılan kategoriler ekleniyor...')
    for (const category of defaultCategories) {
      try {
        await CategoryService.createCategory(category)
        console.log(`✓ Kategori eklendi: ${category.name}`)
      } catch (error) {
        console.warn(`Kategori zaten mevcut olabilir: ${category.name}`, error)
      }
    }

    // Initialize news configurations
    console.log('Varsayılan haber yapılandırmaları ekleniyor...')
    for (const config of defaultNewsConfigs) {
      try {
        await NewsModuleService.createModuleConfig(config)
        console.log(`✓ Yapılandırma eklendi: ${config.title}`)
      } catch (error) {
        console.warn(`Yapılandırma zaten mevcut olabilir: ${config.title}`, error)
      }
    }

    console.log('✅ Homepage sistemi başarıyla başlatıldı!')
  } catch (error) {
    console.error('❌ Homepage sistemi başlatma hatası:', error)
    throw error
  }
}

// Reset homepage system (for development)
export async function resetHomepageSystem(): Promise<void> {
  try {
    console.log('⚠️ Homepage sistemi sıfırlanıyor...')
    
    // Note: In a real implementation, you would add delete methods to services
    // and clean up existing data before reinitializing
    
    await initializeHomepageSystem()
    console.log('✅ Homepage sistemi sıfırlandı ve yeniden başlatıldı!')
  } catch (error) {
    console.error('❌ Homepage sistemi sıfırlama hatası:', error)
    throw error
  }
}
