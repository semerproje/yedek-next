// AA News Types - Anadolu Ajansı API Types

// Raw AA News Item (API'den gelen)
export interface AANewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  type: number;
  date: string;
  group_id?: string;
  category_id: number;
  priority_id: number;
  language_id: number;
  provider_id: number;
  images?: string[];
  videos?: string[];
  tags?: string[];
  keywords?: string[];         // SEO anahtar kelimeleri
  seo_url?: string;           // SEO URL
  seo_title?: string;         // SEO başlık
  meta_description?: string;  // Meta açıklama
  processed?: boolean;        // İşlenmiş mi
}

// AA API Response
export interface AASearchResponse {
  data: {
    result: AANewsItem[];
    total: number;
  };
  response: boolean;
}

export interface AANewsDocument {
  // Temel Bilgiler
  id: string;                    // Eşsiz haber ID'si
  title: string;                 // Haber başlığı
  type: AAContentType;           // Haber türü (1-5)
  date: string;                  // Yayın tarihi (ISO string)
  category: string;              // Kategori adı
  priority: AAPriority;          // Öncelik seviyesi (1-4)
  language: AALanguage;          // Dil (1-3)
  provider: string;              // Kaynak (AA)
  
  // İçerik
  content: string;               // Haber metni
  summary: string;               // Haber özeti
  keywords: string[];            // Anahtar kelimeler
  
  // Medya
  photos: string[];              // Fotoğraf URL'leri
  videos: string[];              // Video URL'leri
  documents: string[];           // Ek belge URL'leri
  
  // AA Spesifik
  aa_id: string;                 // Orijinal AA ID
  group_id?: string;             // Medya grup ID
  category_id: number;           // AA kategori ID
  priority_id: number;           // AA öncelik ID
  language_id: number;           // AA dil ID
  provider_id: number;           // AA sağlayıcı ID
  
  // İşleme Bilgileri
  processed: boolean;            // İşlenmiş mi?
  ai_enhanced: boolean;          // AI ile geliştirilmiş mi?
  seo_url?: string;             // SEO URL
  seo_title?: string;           // SEO başlık
  meta_description?: string;     // Meta açıklama
  
  // Sistem Bilgileri
  created_at: string;            // Oluşturulma tarihi
  updated_at: string;            // Güncellenme tarihi
  fetched_at: string;            // AA'dan çekilme tarihi
  published_at?: string;         // Yayınlanma tarihi
  status: NewsStatus;            // Durum
  
  // NewsML 2.9 Desteği
  newsml_format?: boolean;       // NewsML formatında mı?
  newsml_document_id?: string;   // NewsML doküman ID
  
  // Analitik
  views: number;                 // Görüntülenme
  likes: number;                 // Beğeni
  shares: number;                // Paylaşım
  
  // Kategorileme
  local_category?: string;       // Yerel kategori eşleşmesi
  tags: string[];               // Etiketler
  featured: boolean;            // Öne çıkan haber
  breaking_news: boolean;       // Son dakika
  urgent: boolean;              // Acil
}

// AA İçerik Türleri
export enum AAContentType {
  HABER = 1,      // Metin tabanlı haber içeriği
  FOTOGRAF = 2,   // Görsel içerik
  VIDEO = 3,      // Video içerik
  DOSYA = 4,      // PDF, belgeler
  GRAFIK = 5      // İnfografik, çizelgeler
}

// AA Öncelik Seviyeleri
export enum AAPriority {
  FLAS = 1,       // Flaş - Acil haberler
  MANSET = 2,     // Manşet - Önemli haberler
  NORMAL = 3,     // Normal - Standart haberler
  RUTIN = 4       // Rutin - Düzenli haberler
}

// AA Dil Desteği
export enum AALanguage {
  TURKCE = 1,     // tr_TR - Türkçe
  INGILIZCE = 2,  // en_US - İngilizce
  ARAPCA = 3      // ar_AR - Arapça
}

// Haber Durumu
export enum NewsStatus {
  DRAFT = 'draft',           // Taslak
  PUBLISHED = 'published',   // Yayında
  ARCHIVED = 'archived',     // Arşiv
  PENDING = 'pending',       // Beklemede
  PROCESSING = 'processing', // İşleniyor
  FAILED = 'failed'          // Başarısız
}

// AA API Search Parameters
export interface AASearchParams {
  // Tarih Filtreleri
  start_date?: string;           // Başlangıç tarihi
  end_date?: string;             // Bitiş tarihi ("NOW" için gerçek zamanlı)
  
  // İçerik Filtreleri
  filter_provider?: number[];    // Sağlayıcı filtreleri
  filter_category?: number[];    // Kategori filtreleri
  filter_priority?: number[];    // Öncelik filtreleri
  filter_package?: number[];     // Paket filtreleri
  filter_type?: number[];        // Tür filtreleri (1-5)
  filter_language?: number[];    // Dil filtreleri (1-3)
  
  // Arama
  search_string?: string;        // Arama metni (örn: "Dolar,Enflasyon,Borsa")
  
  // Sayfalama
  offset?: number;               // Başlangıç indeksi
  limit?: number;                // Sonuç limiti (max 100)
}

// AA Discover Data
export interface AADiscoverData {
  provider: { [key: string]: string };   // Sağlayıcılar
  category: { [key: string]: string };   // Kategoriler
  priority: { [key: string]: string };   // Öncelikler
  package: { [key: string]: string };    // Paketler
  type: { [key: string]: string };       // Türler
  language: { [key: string]: string };   // Diller
}

// İndirme Formatları
export interface AADownloadFormats {
  // Haber Metni
  newsml12: string;    // NewsML 1.2 formatı
  newsml29: string;    // NewsML 2.9 formatı
  
  // Fotoğraf
  web: string;         // Web boyutu
  print: string;       // Baskı kalitesi
  
  // Video
  streaming: string;   // Web streaming
  sd: string;          // Standart çözünürlük
}

// Kota ve Limit Bilgileri
export interface AAQuotaInfo {
  daily_limit: number;           // Günlük limit
  used_today: number;            // Bugün kullanılan
  remaining: number;             // Kalan
  concurrent_limit: number;      // Eş zamanlı limit
  rate_limit_ms: number;         // Minimum istek aralığı (500ms)
  archive_days: number;          // Arşiv erişim günü
  last_reset: string;            // Son sıfırlama tarihi
}

// Firebase Koleksiyon Şeması
export interface AANewsCollection {
  // Ana koleksiyon: 'aa_news'
  [docId: string]: AANewsDocument;
}

// Alt koleksiyonlar
export interface AANewsSubCollections {
  // aa_news/{docId}/media - Medya dosyaları
  media: {
    [mediaId: string]: {
      type: 'photo' | 'video' | 'document';
      url: string;
      thumbnail_url?: string;
      title?: string;
      description?: string;
      size?: number;
      format?: string;
      duration?: number; // video için
      photographer?: string; // fotoğraf için
    };
  };
  
  // aa_news/{docId}/versions - Sürüm geçmişi
  versions: {
    [versionId: string]: {
      title: string;
      content: string;
      summary: string;
      version_number: number;
      created_at: string;
      created_by: string;
      changes: string[];
    };
  };
  
  // aa_news/{docId}/analytics - Analitik veriler
  analytics: {
    [date: string]: {
      views: number;
      likes: number;
      shares: number;
      reading_time: number;
      bounce_rate: number;
    };
  };
}

// İndexleme için alanlar
export const FIRESTORE_INDEXES = [
  // Compound indexes
  ['status', 'created_at'],
  ['category', 'priority', 'date'],
  ['type', 'language', 'status'],
  ['breaking_news', 'urgent', 'date'],
  ['aa_id', 'status'],
  ['local_category', 'featured', 'date'],
  
  // Array indexes
  ['keywords'],
  ['tags'],
  
  // Single field indexes
  ['aa_id'],
  ['group_id'],
  ['category_id'],
  ['priority_id'],
  ['language_id'],
  ['published_at'],
  ['fetched_at']
];

// Progress callback type for async operations
export type ProgressCallback = (progress: number, message: string) => void;

// Enhancement options for AI processing
export interface EnhancementOptions {
  enhanceTitle: boolean;
  enhanceContent: boolean;
  generateSummary: boolean;
  generateKeywords: boolean;
  seoOptimize: boolean;
  autoTranslate: boolean;
  targetLanguage?: AALanguage;
  maxContentLength?: number;
}
