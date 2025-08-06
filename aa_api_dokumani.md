# ANADOLU AJANSI - HABER AKIŞ SİSTEMİ (HAS) API DOKÜMANI

## Genel Bilgiler

- API Protokolü: HTTPS
- HTTP Metodu: GET & POST (fonksiyona göre değişir)
- Authentication: `HTTP_BASIC_AUTH` (Kullanıcı Adı + Şifre)
- Yanıt Formatı: JSON
- Zaman Aralığı: Her istekte minimum 500ms beklenmelidir

---

## API FONKSİYONLARI

### 1. `discover` - Filtre Değerlerini Listele

Belirli parametrelerin (kategori, öncelik, dil, tür, sağlayıcı vb.) sayısal karşılıklarını döner.

#### Endpoint:
```
GET /abone/discover/{language_iso}
```

- `tr_TR`, `en_US`, `ar_AR` desteklenir.
- Dönen veri:
  - `provider`
  - `category`
  - `priority`
  - `package`
  - `type`
  - `language`

---

### 2. `search` - Haber Arama

Yetkili olunan aboneliklere ait haberleri filtreleyerek veya tümüyle listeler.

#### Endpoint:
```
POST /abone/search/
```

#### Parametre Grupları:
- **Tarih Filtreleri**
  - `start_date` (ör: `2016-08-30T10:45:00Z`)
  - `end_date` (ör: `NOW`)

- **İçerik Filtreleri (discover ile gelen değerlere göre):**
  - `filter_provider`
  - `filter_category`
  - `filter_priority`
  - `filter_package`
  - `filter_type`
  - `filter_language`

- **Metin Filtreleri**
  - `search_string` (ör: `"Dolar,Enflasyon"`)

- **Kayıt Filtresi**
  - `offset`
  - `limit`

#### Dönen Veri:
- `data.result[]`: Haber dizisi (her biri: id, title, type, date, group_id)
- `data.total`: Toplam kayıt sayısı
- `response`: Başarı bilgisi

---

### 3. `subscription` - Abonelik Bilgileri

Abonelik kapsamında hangi verilere erişiminizin olduğunu döner.

#### Endpoint:
```
GET /abone/subscription/
```

#### Dönen Veri:
- `provider`: AA vb.
- `package`: Genel, Özel, Yerel bülten
- `category`: Ekonomi, Spor vb.
- `type`: Haber, Fotoğraf, Video, Grafik, Dosya
- `language`: TR, EN, AR
- `photo_size`, `video_size`, `graph_size`
- `archive_days`: Geriye dönük erişim süresi
- `download_limit`: Kota bilgisi

---

### 4. `document` - İçerik İndirme (Formatlı)

Belirli bir haberi ID’sine göre indirir. `GET` metodu ile çalışır.

#### Kullanım:
```
GET /abone/document/{haber_id}/{format}
```

#### Formatlar:
- **Haber (type: text)**: `newsml12`, `newsml29`
- **Fotoğraf (type: picture)**: `web`, `print`
- **Video (type: video)**: `sd`, `web`

> IP bazlı, 24 saat geçerli geçici bağlantı üretir.

---

### 5. `token` - İçerik İndirme (Yönlendirmeli)

Document fonksiyonuna benzer, yönlendirme (302) ile içerik linki döner.

#### Kullanım:
```
GET /abone/token/{haber_id}/{format}
```

> `newsml12`, `newsml29` desteklenmez.

---

### 6. `multitoken` - Grup ID ile Seri İçerik İndirme

Bir grup ID içerisindeki tüm fotoğraf/video içeriklerinin indirme linklerini topluca döner.

#### Kullanım:
```
GET /abone/multitoken/{group_id}/{format}
```

> Sadece `web`, `print`, `sd` boyutlarını destekler.

---

## Desteklenen İçerik Türleri

| Tür        | Açıklama              | Tip Değeri |
|------------|------------------------|------------|
| Haber      | Metin içerikli haber  | `1`        |
| Fotoğraf   | Görsel içerik         | `2`        |
| Video      | Görüntülü haber       | `3`        |
| Dosya      | Ekli belge            | `4`        |
| Grafik     | İnfografik vs.        | `5`        |

---

## Desteklenen Formatlar (İndirme)

| İçerik Türü | Formatlar             |
|-------------|------------------------|
| Metin       | `newsml12`, `newsml29` |
| Fotoğraf    | `web`, `print`         |
| Video       | `web`, `sd`            |
| Grafik      | `ai`, `eps`, `pdf`, `raster` (abonelik kapsamına göre) |

---

## Kullanım Örnekleri

### Örnek 1: Spor haberleri (TR) - Belirli Tarih Aralığı
```json
{
  "start_date": "2024-08-01T00:00:00Z",
  "end_date": "2024-08-02T00:00:00Z",
  "filter_category": "2",
  "filter_language": "1",
  "filter_type": "1"
}
```

### Örnek 2: Anahtar kelime ile arama
```json
{
  "search_string": "Deprem",
  "filter_type": "1",
  "filter_language": "1",
  "start_date": "*",
  "end_date": "NOW"
}
```

---
