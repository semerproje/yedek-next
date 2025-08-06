
# ANADOLU AJANSI  
## HABER AKIŞ SİSTEMİ API ERİŞİM ve KULLANIM KILAVUZU

### API Kullanıcısı Oluşturma
1. [https://haber.aa.com.tr](https://haber.aa.com.tr) adresine master kullanıcı bilgilerinizle giriş yapın.
2. “Yönetim” sekmesine tıklayın.
3. “Ekle” butonuna tıklayıp gerekli alanları doldurarak yeni bir API kullanıcısı oluşturun.

### Genel Bilgiler
- API, HTTPS üzerinden GET ve POST metodları ile çalışır.
- İstekler arasında **minimum 500 ms** gecikme olmalıdır.
- Tüm isteklerde `HTTP_BASIC_AUTH` ile kullanıcı adı ve şifre gönderilmelidir.
- API yanıtları JSON formatındadır.

---

## API Fonksiyonları

### 1. `discover`
- Kullanımı: `GET /abone/discover/{language}`
- Amaç: Kategori, öncelik, bülten, tür, dil, sağlayıcı gibi filtre parametrelerinin sayısal karşılıklarını verir.
- Örnek:
  - `GET /abone/discover/tr_TR`
  - `GET /abone/discover/en_US`
  - `GET /abone/discover/ar_AR`

### 2. `search`
- Kullanımı: `POST /abone/search/`
- Amaç: Parametrelerle filtrelenmiş haber listesi döndürür.
- Filtre Parametreleri:
  - `start_date`: Başlangıç tarihi (örnek: `2016-08-30T10:45:00Z`)
  - `end_date`: Bitiş tarihi (`NOW` olabilir)
  - `filter_category`: Haber kategorisi (`2` = Spor)
  - `filter_type`: İçerik türü (`1` = Metin)
  - `search_string`: Anahtar kelime araması
  - `offset` & `limit`: Sayfalama

#### Örnek 1:
```json
POST /abone/search/
{
  "start_date": "2016-08-29T21:00:00Z",
  "end_date": "2016-08-30T21:00:00Z",
  "filter_category": "2",
  "filter_type": "1",
  "filter_language": "1"
}
```

### 3. `subscription`
- Kullanımı: `GET /abone/subscription/`
- Amaç: Kullanıcının hangi içeriklere abone olduğunu gösterir.
- Dönen alanlar: `provider`, `package`, `category`, `type`, `language`, `photo_size`, `video_size`, `graph_size`, `archive_days`, `download_limit`

### 4. `document`
- Kullanımı: `GET /abone/document/{typeId}/{format}`
- Amaç: Haber, fotoğraf veya video içeriğini indirme.
- Örnek:
  - Haber: `GET /abone/document/aa:text:20161012:9258343/newsml29`
  - Fotoğraf: `GET /abone/document/aa:picture:20161012:9258465/print`
  - Video: `GET /abone/document/aa:video:20161012:9258512/sd`

### 5. `token`
- Kullanımı: `GET /abone/token/{typeId}/{format}`
- Amaç: İçerik indirmek için geçici bağlantı oluşturur (302 yönlendirme).
- Sadece `print`, `web`, `sd` formatları desteklenir.

### 6. `multitoken`
- Kullanımı: `GET /abone/multitoken/{group_id}/{format}`
- Amaç: Fotoğraf/video serisinin tüm içeriklerini indirme bağlantılarını getirir.

---

## Teknik Notlar

- İçerik indirme bağlantıları **1 gün** boyunca geçerlidir.
- İndirme işleminin yapıldığı sunucunun çıkış IP'si, API çağrısının yapıldığı IP ile aynı olmalıdır.
- 403 hatası alınırsa, IP uyuşmazlığı olabilir.
- 302 yönlendirmeleri için:
  - PHP: `curl_setopt($ch,CURLOPT_FOLLOWLOCATION,TRUE);`
  - .NET:
    ```csharp
    myHttpWebRequest.MaximumAutomaticRedirections = 5;
    myHttpWebRequest.AllowAutoRedirect = true;
    ```

---

## Kategori Kodları (Örnek)
- `category`:
  - 1: Genel
  - 2: Spor
  - 3: Ekonomi
  - 4: Sağlık
  - 5: Bilim-Teknoloji
  - 6: Politika
  - 7: Kültür-Sanat-Yaşam

- `priority`:
  - 1: Flaş
  - 2: Acil
  - 3: Önemli
  - 4: Rutin
  - 5: Özel
  - 6: Arşiv

- `type`: 1=Haber, 2=Fotoğraf, 3=Video, 4=Dosya, 5=Grafik

---

## Önerilen Geliştirme Adımları
1. API kullanıcı hesabını oluşturun.
2. `discover` fonksiyonu ile filtreleme parametrelerini alın.
3. `search` fonksiyonu ile içerikleri listeleyin.
4. `document`, `token` veya `multitoken` ile içerikleri indirin.
5. Abonelik yetkilerinizi `subscription` ile kontrol edin.

---

## 🎯 NetNext Projesi İçin Kullanılabilir Veriler

### Ana Sayfa İçin:
1. **Manşet Haberleri** (priority: Flaş, Acil)
2. **Kategori Haberleri** (Spor, Ekonomi, Politika, vs.)
3. **Son Dakika Haberleri** (breaking news)
4. **Fotoğraf Galerileri**
5. **Video Haberleri**

### Kategori Sayfaları İçin:
1. **Kategoriye Özel Haberler**
2. **Tarih Aralığına Göre Arşiv**
3. **Anahtar Kelime Araması**
4. **İlişkili Medya İçerikleri**

### Arama Özelliği İçin:
1. **Keyword Tabanlı Arama**
2. **Tarih Filtreli Arama**
3. **Kategori Filtreli Arama**
4. **İçerik Türü Filtreli Arama**

### ⚡ Önemli Teknik Kısıtlar

1. **Rate Limiting:** Minimum 500ms gecikme
2. **Authentication:** HTTP Basic Auth gerekli
3. **IP Restriction:** İndirme IP'si = API çağrı IP'si
4. **Geçerlilik:** İndirme linkleri 1 gün geçerli
5. **Format Desteği:** NewsML 2.9, JPEG, MP4, vs.

---
