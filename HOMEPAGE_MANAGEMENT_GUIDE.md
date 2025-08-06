# Homepage Yönetim Sistemi Kullanım Kılavuzu

## 🎯 Genel Bakış

Bu sistem, netnext projesinin anasayfa içeriklerini Firebase üzerinden dinamik olarak yönetmenizi sağlar. Admin paneli üzerinden modülleri, kategorileri, haber yapılandırmalarını ve yayın programını kontrol edebilirsiniz.

## 🚀 Sistemin Başlatılması

### 1. İlk Kurulum
```bash
# Admin paneline giriş yapın
http://localhost:3000/admin

# Dashboard'a geçin
http://localhost:3000/admin/dashboard

# Sistem Başlatma sayfasına gidin
http://localhost:3000/admin/dashboard/system-init
```

### 2. Varsayılan Verileri Oluşturma
- "Sistem Başlat" butonuna tıklayın
- Sistem otomatik olarak şunları oluşturacak:
  - 10 Homepage modülü
  - 10 Haber kategorisi  
  - 5 Haber yapılandırması

### 3. Firebase Güvenlik Kuralları
`firestore.rules` dosyasındaki kuralları Firebase Console'a kopyalayın.

## 📋 Modül Yönetimi

### Homepage Modülleri
Admin Dashboard > Homepage Yönetimi > Modüller

**Mevcut Modüller:**
- ✅ Son Dakika Haber Bandı (`breaking-news-bar`)
- ✅ Ana Manşet Bölümü (`main-headline`)
- ✅ Manşet Haber Grid'i (`headline-grid`)
- ✅ Editörün Seçimi (`editor-picks`)
- ✅ Popüler Haberler Yan Panel (`popular-sidebar`)
- ✅ Video Öne Çıkanlar (`video-highlights`)
- ✅ Hafta Sonu Okumaları (`weekend-reads`)
- ✅ Hava Durumu ve Döviz (`weather-currency`)
- ✅ Borsa ve Piyasalar (`money-markets`)
- ✅ AI Önerileri (`ai-recommendations`)

**Modül İşlemleri:**
- ✏️ Düzenle: Modül ayarlarını değiştir
- 👁️ Aktif/Pasif: Modülü göster/gizle
- ↕️ Sıralama: Modül sırasını değiştir
- 🗑️ Sil: Modülü tamamen kaldır

## 🏷️ Kategori Yönetimi

### Kategori İşlemleri
Admin Dashboard > Homepage Yönetimi > Kategoriler

**Varsayılan Kategoriler:**
- 🔴 Son Dakika (`son-dakika`)
- 🔵 Gündem (`gundem`)
- 🟢 Ekonomi (`ekonomi`)
- 🟠 Spor (`spor`)
- 🟣 Teknoloji (`teknoloji`)
- 🟢 Sağlık (`saglik`)
- 🟡 Kültür Sanat (`kultur-sanat`)
- 🔵 Eğitim (`egitim`)
- 🟣 Otomobil (`otomobil`)
- 🟡 Yaşam (`yasam`)

**Kategori Özellikleri:**
- 📝 Ad ve açıklama
- 🎨 Renk kodlaması
- 🔗 URL slug'ı
- 🔢 Sıralama
- ✅ Aktif/Pasif durumu

## ⚙️ Haber Yapılandırması

### Yapılandırma Türleri

#### 1. Otomatik Seçim
- 📅 Tarih aralığı (1-365 gün)
- 👀 Minimum görüntülenme sayısı
- 🌟 Sadece öne çıkan haberler
- 🏷️ Kategori filtreleri

#### 2. Manuel Seçim
- ✋ Elle seçilen haberler
- 📋 Haber ID listesi
- 🎯 Tam kontrol

### Görünüm Ayarları
- 📊 Düzen: Grid, Liste, Slider
- 🖼️ Resim gösterimi
- 📝 Özet gösterimi
- 🏷️ Kategori etiketi
- 📅 Tarih gösterimi
- ✍️ Yazar bilgisi

## 📅 Yayın Programı

### Program Özellikleri
- ⏰ Yayın tarihi ve saati
- ⏳ Otomatik kaldırma tarihi
- 🔥 Öncelik seviyeleri (Düşük/Normal/Yüksek/Kritik)
- 🎯 Modül hedeflemesi

### Program Durumları
- 🕐 Programlı: Yayın bekliyor
- ✅ Yayında: Aktif olarak gösteriliyor
- ❌ Süresi Doldu: Otomatik kaldırıldı

## 🔧 Teknik Detaylar

### Firebase Koleksiyonları
```
📁 homepage_modules/
  ├── 🆔 moduleId
  ├── 🔑 key
  ├── 📝 name, description
  ├── 🎛️ settings
  └── 📊 order, active

📁 categories/
  ├── 🆔 categoryId
  ├── 📝 name, slug
  ├── 🎨 color, icon
  └── 📊 order, active

📁 news_module_configs/
  ├── 🆔 configId
  ├── 🔑 moduleKey
  ├── ⚙️ autoSelection/manualSelection
  └── 🎨 displaySettings

📁 publishing_schedule/
  ├── 🆔 scheduleId
  ├── 📰 newsId
  ├── ⏰ publishAt, unpublishAt
  └── 🔥 priority, status
```

### API Kullanımı

#### Modül Verilerini Çekme
```typescript
import { EnhancedNewsService } from '@/hooks/useHomepageData'

// Editörün seçimi haberlerini çek
const editorPicks = await EnhancedNewsService.getNewsWithFallback(
  'editor-picks', 
  fallbackData
)
```

#### Homepage Verilerini Çekme
```typescript
import { useHomepageData } from '@/hooks/useHomepageData'

function HomePage() {
  const { data, loading, error, refetch } = useHomepageData()
  
  if (loading) return <Loading />
  if (error) return <Error />
  
  return (
    <div>
      <BreakingNews news={data.breakingNews} />
      <Headlines news={data.headlines} />
      <EditorPicks news={data.editorPicks} />
    </div>
  )
}
```

## 🔐 Güvenlik ve İzinler

### Rol Bazlı Erişim
- 👤 **Admin**: Tüm yetkilere sahip
- ✏️ **Editor**: Haber ve program yönetimi
- 👁️ **Public**: Sadece aktif içerikleri görme

### Güvenlik Kuralları
- 🔒 Sadece admin modül/kategori değişikliği yapabilir
- ✏️ Editor sadece kendi programlarını düzenleyebilir
- 👁️ Frontend sadece aktif içerikleri çekebilir

## 📈 Performans Optimizasyonları

### Önbelleğe Alma
- ⚡ Firebase'den çekilen veriler önbelleğe alınır
- 🔄 5 dakikada bir otomatik yenileme
- 📱 Client-side fallback verileri

### Lazy Loading
- 📦 Modüller ihtiyaç halinde yüklenir
- 🖼️ Resimler lazy loading ile yüklenir
- ⚡ Sayfa performansı optimize edilir

## 🚨 Sorun Giderme

### Yaygın Hatalar

#### 1. Modüller Görünmüyor
```
✅ Kontrol listesi:
□ Modül aktif mi?
□ Firebase bağlantısı var mı?
□ Güvenlik kuralları doğru mu?
□ Component doğru key kullanıyor mu?
```

#### 2. Kategoriler Yüklenmiyor
```
✅ Çözüm adımları:
1. Admin panelinden kategori durumunu kontrol et
2. Firebase Console'dan veri varlığını kontrol et
3. Browser console'dan hata mesajlarını incele
4. Güvenlik kurallarını kontrol et
```

#### 3. Yayın Programı Çalışmıyor
```
✅ Kontrol noktaları:
□ Tarih formatı doğru mu?
□ Timezone ayarları uyumlu mu?
□ Haber ID'si geçerli mi?
□ Öncelik değeri doğru mu?
```

## 📞 Destek

Sistem ile ilgili sorunlar için:
1. 📋 Browser console loglarını kontrol edin
2. 🔥 Firebase Console'dan veri durumunu kontrol edin
3. 📝 Admin panel > Sistem Başlatma'dan logları inceleyin
4. 🔄 Gerekirse sistemi sıfırlayıp yeniden başlatın

---

## 📚 Ek Kaynaklar

- [Firebase Firestore Dokümantasyonu](https://firebase.google.com/docs/firestore)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Best Practices](https://typescript-eslint.io/docs/)

Bu sistem sayesinde netnext projesi tamamen dinamik bir homepage yönetimine sahip olacak ve içerik editörleri kod değişikliği yapmadan anasayfa içeriklerini yönetebilecek! 🎉
