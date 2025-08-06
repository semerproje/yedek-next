# Anadolu Ajansı API Veri Analizi ve Kategori Eşleştirmesi

## 📊 AA API'dan Çekebileceğimiz Veriler

### 1. Temel Haber Verileri
- **id**: Haber ID'si
- **type**: Haber tipi (text, image, video, gallery)
- **title**: Haber başlığı
- **content/text/body**: Haber içeriği (farklı alan adları)
- **description/summary**: Haber özeti
- **date**: Yayın tarihi
- **category**: Kategori ID'si (sayısal)
- **categoryName**: Kategori adı
- **priority**: Öncelik seviyesi (high, medium, low)
- **package**: Paket tipi (standard, premium)
- **language**: Dil kodu (tr, en)
- **groupId**: Grup ID'si

### 2. Medya Verileri
- **imageUrls[]**: Görsel URL'leri
- **videos[]**: Video bilgileri
- **gallery[]**: Galeri görselleri
- **media[]**: Çoklu medya dosyaları

### 3. Metadata
- **author**: Muhabir/yazar
- **location**: Konum
- **keywords[]**: Anahtar kelimeler
- **source**: Kaynak bilgisi

## 🎯 Kategori Eşleştirmesi

### Bizim Sistem Kategorileri (Header'dan)
```typescript
const categories = [
  { key: "gundem",    label: "Gündem" },
  { key: "ekonomi",   label: "Ekonomi" },
  { key: "dunya",     label: "Dünya" },
  { key: "teknoloji", label: "Teknoloji" },
  { key: "spor",      label: "Spor" },
  { key: "saglik",    label: "Sağlık" },
  { key: "kultur",    label: "Kültür" },
  { key: "magazin",   label: "Magazin" },
  { key: "cevre",     label: "Çevre" },
  { key: "politika",  label: "Politika" },
  { key: "egitim",    label: "Eğitim" },
  { key: "din",       label: "Din" }
];
```

### AA API Kategori Mapping
```typescript
const AA_ENHANCED_CATEGORY_MAPPING = {
  // Sayısal ID'ler
  '1': 'Gündem',
  '2': 'Politika', 
  '3': 'Ekonomi',
  '4': 'Spor',
  '5': 'Dünya',
  '6': 'Teknoloji',
  '7': 'Sağlık',
  '8': 'Eğitim',
  '9': 'Kültür',
  '10': 'Gündem', // Yerel -> Gündem
  
  // Metin bazlı kategoriler
  'politik': 'Politika',
  'siyaset': 'Politika',
  'government': 'Politika',
  
  'ekonomi': 'Ekonomi',
  'finans': 'Ekonomi',
  'borsa': 'Ekonomi',
  'para': 'Ekonomi',
  'business': 'Ekonomi',
  
  'spor': 'Spor',
  'futbol': 'Spor',
  'basketbol': 'Spor',
  'olimpiyat': 'Spor',
  'sports': 'Spor',
  
  'teknoloji': 'Teknoloji',
  'bilim': 'Teknoloji',
  'innovation': 'Teknoloji',
  'digital': 'Teknoloji',
  'AI': 'Teknoloji',
  
  'saglik': 'Sağlık',
  'tıp': 'Sağlık',
  'hastane': 'Sağlık',
  'health': 'Sağlık',
  'covid': 'Sağlık',
  
  'egitim': 'Eğitim',
  'okul': 'Eğitim',
  'universite': 'Eğitim',
  'education': 'Eğitim',
  
  'kultur': 'Kültür',
  'sanat': 'Kültür',
  'müze': 'Kültür',
  'culture': 'Kültür',
  'art': 'Kültür',
  
  'dunya': 'Dünya',
  'uluslararası': 'Dünya',
  'world': 'Dünya',
  'international': 'Dünya',
  
  'cevre': 'Çevre',
  'çevre': 'Çevre',
  'environment': 'Çevre',
  'iklim': 'Çevre',
  'climate': 'Çevre',
  
  'magazin': 'Magazin',
  'celebrity': 'Magazin',
  'entertainment': 'Magazin',
  
  'din': 'Din',
  'religion': 'Din',
  'ibadet': 'Din',
  
  'gundem': 'Gündem',
  'genel': 'Gündem',
  'news': 'Gündem',
  'default': 'Gündem'
};
```

## 🤖 AI Kategori Tespiti

### Yapay Zeka ile Kategori Belirleme
1. **Başlık Analizi**: Haber başlığındaki anahtar kelimeler
2. **İçerik Analizi**: Haber içeriğindeki önemli terimler
3. **Keyword Matching**: Metadata'daki anahtar kelimeler
4. **Context Analysis**: Bağlamsal analiz

### AI Prompt Template
```typescript
const AI_CATEGORY_PROMPT = `
Aşağıdaki haber için en uygun kategoriyi belirle:

Kategoriler: Gündem, Ekonomi, Dünya, Teknoloji, Spor, Sağlık, Kültür, Magazin, Çevre, Politika, Eğitim, Din

Haber Başlığı: {title}
Haber İçeriği: {content}
AA Kategorisi: {originalCategory}
Anahtar Kelimeler: {keywords}

Sadece kategori adını döndür, açıklama yapma.
`;
```

## 📋 Geliştirilmiş AA News Service Özellikleri

### 1. Gelişmiş Veri İşleme
- Çoklu content alanı desteği (content, text, body, description)
- Metadata temizleme ve standardizasyon
- Görsel URL optimizasyonu
- Fallback görsel sistemi

### 2. AI Kategori Eşleştirme
- GPT-4 ile akıllı kategori tespiti
- Çoklu faktör analizi (başlık + içerik + keywords)
- Confidence scoring
- Manual override seçeneği

### 3. Kalite Kontrolleri
- Duplicate detection
- Content quality checks
- Image validation
- Language detection

### 4. Firebase Entegrasyonu
- Real-time data sync
- Batch operations
- Error handling
- Retry mechanisms

## 🎯 Uygulama Planı

1. **AA News Service Update**: Gelişmiş kategori mapping
2. **AI Integration**: OpenAI API entegrasyonu
3. **Dashboard Enhancement**: Kategori yönetimi UI
4. **Testing**: Comprehensive test suite
5. **Monitoring**: Performance ve accuracy metrics
