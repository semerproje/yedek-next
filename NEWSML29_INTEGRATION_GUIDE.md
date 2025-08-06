# NewsML 2.9 Integration - NetNext News

## Genel Bakış

Bu entegrasyon, Anadolu Ajansı'ndan gelen haberleri **NewsML 2.9** standardı formatında Firestore veritabanında saklamaya olanak tanır. NewsML 2.9, uluslararası haber standartlarına uygun, gelişmiş metadata ve yapılandırılmış içerik desteği sunar.

## Özellikler

### 🏗️ NewsML 2.9 Yapısı
- **Standard-compliant XML**: IPTC NewsML-G2 2.9 standardına tam uyumluluk
- **Rich Metadata**: Başlık, özet, anahtar kelimeler, konular, lokasyon bilgileri
- **Content Structure**: HTML formatında yapılandırılmış içerik
- **Media Support**: İlişkili medya dosyaları (resim, video, ses)
- **Rights Management**: Telif hakkı ve kullanım koşulları
- **Versioning**: Belge versiyonlama ve güncelleme takibi

### 📊 Firestore Entegrasyonu
- **Optimized Schema**: Sorgulamaya uygun belge yapısı
- **Search Fields**: Hızlı arama için indekslenmiş alanlar
- **Subcollections**: Haber öğeleri ve medya varlıkları için alt koleksiyonlar
- **Processing Status**: Belge işleme durumu takibi
- **Analytics Support**: Detaylı analitik ve raporlama

### 🔄 Otomatik İşleme
- **AA Integration**: Anadolu Ajansı API'si ile entegrasyon
- **Auto-conversion**: Standart haber formatından NewsML 2.9'a dönüşüm
- **Batch Processing**: Toplu belge işleme
- **Real-time Sync**: Gerçek zamanlı senkronizasyon
- **Error Handling**: Kapsamlı hata yönetimi

## Teknik Detaylar

### Dosya Yapısı
```
src/
├── types/
│   └── newsml29.ts                    # TypeScript type definitions
├── services/
│   ├── newsml29.service.ts           # NewsML 2.9 Firestore service
│   └── ultraPremiumAAService.ts      # Enhanced AA service
├── components/admin/
│   └── NewsML29Dashboard.tsx         # Admin dashboard
├── app/
│   ├── admin/newsml29/
│   │   └── page.tsx                  # Admin page
│   └── api/newsml29/
│       ├── documents/route.ts        # Document API
│       ├── analytics/route.ts        # Analytics API
│       └── import-aa/route.ts        # AA import API
└── test-newsml29.js                  # Test script
```

### Firestore Koleksiyon Şeması

#### Ana Koleksiyon: `newsml29_documents`
```typescript
{
  id: string,
  createdAt: Date,
  updatedAt: Date,
  newsml: {
    metadata: NewsML29Metadata,
    header: NewsML29Header,
    newsItem: NewsML29NewsItem[]
  },
  processing: {
    status: 'raw' | 'parsed' | 'enhanced' | 'published' | 'error',
    errors?: string[],
    lastProcessedAt?: Date
  },
  searchFields: {
    headline: string,
    urgency: number,
    provider: string,
    // ... other indexed fields
  }
}
```

#### Alt Koleksiyonlar
- `news_items/`: Haber öğeleri
- `media_assets/`: Medya varlıkları
- `processing_logs/`: İşleme günlükleri

## Kullanım Kılavuzu

### 1. Servis Başlatma
```typescript
import { newsml29Service } from '@/services/newsml29.service';
import { ultraPremiumAAService } from '@/services/ultraPremiumAAService';
```

### 2. AA'dan NewsML 2.9 İçe Aktarma
```typescript
// Son 24 saatteki haberleri içe aktar
const result = await ultraPremiumAAService.syncRecentNewsToNewsML29(24);
console.log(`${result.processed} haber işlendi`);

// Tekil haber dönüştürme
const documentId = await ultraPremiumAAService.fetchAndSaveNewsML29('news-id');
```

### 3. Firestore'dan Sorgulama
```typescript
// Acil haberleri getir
const urgentNews = await newsml29Service.queryDocuments({
  urgency: [1, 2, 3],
  pubStatus: ['usable'],
  limit: 10
});

// Belirli tarih aralığı
const recentNews = await newsml29Service.queryDocuments({
  createdAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  provider: ['Anadolu Ajansı']
});
```

### 4. Belge İşleme
```typescript
// Belgeyi geliştir (AI enhancement)
await newsml29Service.enhanceDocument(documentId);

// Belgeyi yayınla
await newsml29Service.publishDocument(documentId);
```

### 5. Gerçek Zamanlı Takip
```typescript
// Belge değişikliklerini dinle
const unsubscribe = newsml29Service.subscribeToDocuments(
  { urgency: [1, 2] },
  (documents) => {
    console.log('Yeni acil haberler:', documents);
  }
);
```

## API Endpoints

### Belgeler
- `GET /api/newsml29/documents` - Belge listesi
- `POST /api/newsml29/documents` - Filtreli sorgulama
- `POST /api/newsml29/documents/[id]/enhance` - Belge geliştirme
- `POST /api/newsml29/documents/[id]/publish` - Belge yayınlama

### İçe Aktarma
- `POST /api/newsml29/import-aa` - AA'dan içe aktarma

### Analitik
- `GET /api/newsml29/analytics` - Sistem analitikleri

## Admin Dashboard

Admin panelinde NewsML 2.9 yönetimi için:
- `/admin/newsml29` - Ana yönetim sayfası
- Belge listesi ve filtreleme
- Gerçek zamanlı analitikler
- Toplu işleme araçları
- Hata takibi ve raporlama

## Test Etme

```bash
# Test scripti çalıştır
node test-newsml29.js
```

Test scripti şunları kontrol eder:
1. AA API bağlantısı
2. Haber arama
3. NewsML 2.9 dönüştürme
4. Firestore kaydetme
5. Belge geri alma
6. Analitik veriler

## NewsML 2.9 Avantajları

### Standartlara Uyumluluk
- IPTC NewsML-G2 2.9 tam uyumluluk
- Uluslararası haber organizasyonları ile uyumluluk
- Gelecekteki entegrasyonlar için hazır

### Gelişmiş Metadata
- Yapılandırılmış konu etiketleme
- Detaylı lokasyon bilgileri
- Telif hakkı ve kullanım koşulları
- Versiyonlama ve iz sürme

### Performans
- Optimize edilmiş Firestore şeması
- İndekslenmiş arama alanları
- Etkili sorgulama
- Ölçeklenebilir yapı

### Entegrasyon
- Mevcut AA servisi ile entegrasyon
- Admin dashboard desteği
- API endpoint'leri
- Real-time güncellemeler

## Geliştirme Notları

- **Rate Limiting**: AA API için 500ms minimum bekleme
- **Error Handling**: Kapsamlı hata yakalama ve raporlama
- **Batch Processing**: Büyük veri setleri için optimize edilmiş
- **Memory Management**: Büyük XML dosyaları için bellek yönetimi
- **Security**: Firebase Security Rules ile güvenlik

## Gelecek Geliştirmeler

1. **AI Enhancement**: İçerik analizi ve kategorilendirme
2. **Multi-language**: Çoklu dil desteği
3. **Media Processing**: Otomatik medya işleme
4. **Export Options**: Farklı format dışa aktarma
5. **Advanced Analytics**: Detaylı analitik ve raporlama

Bu entegrasyon, NetNext News platformunu uluslararası haber standartlarına uygun, ölçeklenebilir ve gelişmiş bir haber yönetim sistemine dönüştürür.
