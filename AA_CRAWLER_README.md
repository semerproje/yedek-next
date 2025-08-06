# AA Haber Crawler Sistemi

## 🚀 Özellikler

### ✨ Otomatik Haber Çekimi
- **Süre Ayarlanabilir**: 5 dakika - 24 saat arası interval ayarları
- **Kategori Seçimi**: 11 farklı kategori desteği (Genel, Politika, Ekonomi, Spor vb.)
- **Çoklu Dil**: Türkçe, İngilizce, Arapça dil desteği
- **Akıllı Duplicate Control**: Tekrar eden haberleri otomatik engelleme

### 🤖 AI Destekli İçerik Optimizasyonu
- **Başlık Geliştirme**: SEO uyumlu ve çekici başlık oluşturma
- **İçerik Zenginleştirme**: Yapay zeka ile içerik yapılandırma
- **Otomatik Özet**: Akıllı özetleme algoritması
- **Tag Extraction**: Otomatik etiket çıkarma
- **SEO Optimizasyonu**: Meta title ve description oluşturma

### 📸 Otomatik Medya Yönetimi
- **AA Fotoğraf Entegrasyonu**: Orijinal AA fotoğraflarını çekme
- **Unsplash Backup**: Fotoğrafı olmayan haberler için otomatik fotoğraf ekleme
- **Video Galeri**: Video içeriklerinin otomatik organize edilmesi
- **Fotoğraf Galerisi**: Çoklu fotoğraf desteği ve otomatik galeri oluşturma

### 🔧 Gelişmiş Yönetim
- **Real-time Status**: Canlı crawler durumu takibi
- **İstatistik Dashboard**: Detaylı performans metrikleri
- **Manuel Arama**: İsteğe bağlı haber arama ve çekme
- **Firebase Entegrasyonu**: Otomatik veritabanı kaydı

## 🛠 Kurulum

### 1. Bağımlılıkları Yükleyin
```bash
npm install
```

### 2. Environment Variables
`.env.example` dosyasını `.env.local` olarak kopyalayın ve değerlerinizi girin:

```bash
# AA News API Credentials
AA_USERNAME=your_aa_username
AA_PASSWORD=your_aa_password

# Unsplash API
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
```

### 3. Development Server
```bash
npm run dev
```

## 📋 Kullanım

### Otomatik Crawler Başlatma
1. `http://localhost:3000/admin/dashboard/aa-crawler` adresine gidin
2. "Crawler Ayarları" bölümünden konfigürasyonu yapın:
   - **Interval**: Çalışma aralığı (dakika)
   - **Kategoriler**: Takip edilecek haber kategorileri
   - **AI Enhancement**: Yapay zeka geliştirmesi
   - **Unsplash**: Otomatik fotoğraf ekleme
   - **Auto Publish**: Otomatik yayınlama
   - **Duplicate Check**: Tekrar kontrolü
3. "Crawler Başlat" butonuna tıklayın

### Manuel Haber Arama
1. "Manuel Haber Arama" bölümünü kullanın
2. Kategori, anahtar kelime ve tip filtrelerini seçin
3. "Ara" butonuna tıklayın
4. Sonuçları görüntüleyin ve Firebase'e kaydedin

## 🔧 API Endpoints

### AA News API
- `POST /api/aa-news/search` - Haber arama
- `GET /api/aa-news/detail/[id]` - Haber detayı
- `GET /api/aa-news/media/[id]` - Medya galerisi

### Crawler Management
- `POST /api/aa-news/crawler/start` - Crawler başlat
- `POST /api/aa-news/crawler/stop` - Crawler durdur
- `GET /api/aa-news/crawler/status` - Crawler durumu

### AI & Media Services
- `POST /api/ai/enhance-content` - AI içerik geliştirme
- `GET /api/unsplash/search` - Unsplash fotoğraf arama

## 📊 Özellik Detayları

### Duplicate Prevention
- Başlık benzerlik algoritması
- Firestore'da otomatik kontrol
- Performans optimized sorguları

### AI Content Enhancement
- Türkçe dil optimizasyonu
- SEO uyumlu başlık oluşturma
- Otomatik paragraph yapılandırma
- Geçiş cümleleri ekleme
- Reading time hesaplama

### Media Management
- AA API'den otomatik fotoğraf çekme
- Unsplash entegrasyonu
- Image optimization
- Responsive gallery layouts

### Performance Features
- Batch processing
- Rate limiting protection
- Error handling & recovery
- Background processing
- Real-time status updates

## 🚦 Crawler States

### Status Indicators
- **🟢 Aktif**: Crawler çalışıyor
- **🔴 Durdu**: Crawler durduruldu
- **🟡 Hata**: Hata durumu

### Metrics
- **İşlenen**: Toplam işlenen haber sayısı
- **Başarılı**: Başarıyla kaydedilen haberler
- **Hata**: Hata ile karşılaşılan işlemler
- **Tekrar**: Duplicate olarak tespit edilen haberler

## 🔐 Security Features

- Environment variable validation
- API key encryption
- Rate limiting
- Input sanitization
- Firebase security rules

## 📈 Performance Optimizations

- Batch database operations
- Image lazy loading
- API response caching
- Background processing
- Memory management

## 🐛 Troubleshooting

### Common Issues
1. **AA API Connection**: Credentials kontrolü yapın
2. **Firebase Errors**: Firestore rules kontrolü
3. **Unsplash Limits**: API quota kontrolü
4. **Performance Issues**: Interval ayarlarını artırın

### Debug Mode
```bash
DEBUG_PERFORMANCE=true npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

---

## 🔧 Technical Architecture

### Frontend (Next.js 15.4.4)
- **App Router**: Modern routing sistemi
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Modern icon set

### Backend Services
- **Next.js API Routes**: Server-side logic
- **Firebase Firestore**: Document database
- **AA News API**: Content source
- **Unsplash API**: Photo service

### AI & Automation
- **Content Enhancement**: Proprietary AI algorithms
- **Duplicate Detection**: Advanced similarity matching
- **Auto Categorization**: Smart category assignment
- **SEO Optimization**: Automated meta generation

Bu sistem ile tam otomatik, AI destekli ve medya zenginleştirilmiş haber platformu oluşturabilirsiniz! 🚀
