# 🔥 AA API CORS Sorunu Çözümü ve Test Rehberi

## 🐛 Sorun
AA API'si client-side'dan doğrudan çağrıldığında CORS hatası veriyordu:
```
Access to fetch at 'https://api.aa.com.tr/abone/search/' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

## ✅ Çözüm
Next.js API Route ile backend proxy oluşturduk (`/api/aa-proxy`)

## 📁 Oluşturulan/Güncellenen Dosyalar

### 1. **Backend Proxy API**
- `src/app/api/aa-proxy/route.ts` - Next.js API route
- Rate limiting (500ms)
- HTTP Basic Auth
- Error handling

### 2. **Enhanced AA Service**  
- `src/lib/aa-api-enhanced.ts` - Server/Client hybrid
- Server-side: Direkt AA API çağrısı
- Client-side: Proxy üzerinden çağrı

### 3. **Test Arayüzleri**
- `public/aa-enhanced-api-test.html` - Browser test interface
- `public/aa-test-console.js` - Console test script

## 🚀 Test Etme

### Yöntem 1: Browser Arayüzü
```bash
http://localhost:3000/aa-enhanced-api-test.html
```

### Yöntem 2: Browser Console
```javascript
// Console'da çalıştır:
testAAProxy()
```

### Yöntem 3: Direct API Test
```javascript
// Discover API
fetch('/api/aa-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'discover',
    params: { language: 'tr_TR' }
  })
})

// Search API  
fetch('/api/aa-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'search',
    params: {
      start_date: new Date(Date.now() - 24*60*60*1000).toISOString(),
      end_date: 'NOW',
      filter_type: '1',
      limit: 5
    }
  })
})
```

## 📊 Desteklenen API Endpoints

| Action | Method | AA Endpoint | Açıklama |
|--------|--------|-------------|----------|
| `discover` | GET | `/discover/{lang}` | Kategori/öncelik kodları |
| `subscription` | GET | `/subscription/` | Abonelik bilgileri |
| `search` | POST | `/search/` | Haber araması |
| `document` | GET | `/document/{id}/{format}` | İçerik indirme |
| `token` | GET | `/token/{id}/{format}` | Geçici bağlantı |
| `multitoken` | GET | `/multitoken/{id}/{format}` | Seri indirme |

## 🔧 Proxy Request Format

```typescript
{
  action: 'discover' | 'subscription' | 'search' | 'document' | 'token' | 'multitoken',
  params?: {
    // Action'a göre değişir
    language?: string,
    typeId?: string,
    format?: string,
    // Search için:
    start_date?: string,
    end_date?: string,
    filter_type?: string,
    // vs...
  }
}
```

## 📈 Success Response
```typescript
{
  success: true,
  data: any,           // AA API response
  action: string,      // Hangi action çalıştırıldı
  timestamp: string    // İstek zamanı
}
```

## ❌ Error Response
```typescript
{
  success: false,
  error: string,       // Hata mesajı
  details?: string,    // Detay bilgi
  stack?: string       // Dev mode'da stack trace
}
```

## 🎯 Rate Limiting
- Minimum 500ms gecikme (AA API gereksinimi)
- Automatic retry yok (manuel implement edilebilir)

## 🔐 Authentication
- Username: `3010229`
- Password: `8vWhT6Vt` 
- HTTP Basic Auth (Base64 encoded)

## 🚨 Önemli Notlar

1. **CORS Bypass**: Proxy sayesinde client-side CORS sorunu yok
2. **Rate Limiting**: Her istekte 500ms bekleme
3. **Error Handling**: Detaylı hata mesajları
4. **Security**: Credentials backend'de saklı
5. **Flexibility**: Hem server hem client kullanımı

## 🏃‍♂️ Hızlı Test

Development server başlatıp:
```bash
npm run dev
```

Browser'da:
```
http://localhost:3000/aa-enhanced-api-test.html
```

Console'da `testAAProxy()` çalıştır!

---

**✨ Artık AA API kılavuzundaki tüm endpoint'ler CORS sorunu olmadan kullanılabilir!**
