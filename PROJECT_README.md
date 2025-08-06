# NetNext - Modern News Portal

Bu proje Next.js 15 ile geliştirilmiş modern bir haber portalıdır.

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Firebase hesabı

### Adımlar

1. Bağımlılıkları yükleyin:
```bash
npm install --legacy-peer-deps
```

2. Environment variables dosyasını oluşturun:
```bash
cp .env.example .env.local
```

3. `.env.local` dosyasını kendi değerlerinizle doldurun

4. Development server'ı başlatın:
```bash
npm run dev
```

## 🛠️ Teknolojiler

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Rich Text**: React Quill

## 📂 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── (routes)/          # Route grupları
│   ├── api/               # API routes
│   ├── globals.css        # Global stiller
│   └── layout.tsx         # Root layout
├── components/            # React bileşenleri
│   ├── ui/               # Temel UI bileşenleri
│   ├── layout/           # Layout bileşenleri
│   └── features/         # Özellik-özel bileşenler
├── lib/                  # Utility fonksiyonları
│   ├── firebase.ts       # Firebase konfigürasyonu
│   └── utils.ts          # Genel utilities
├── services/             # API servis katmanı
├── types/                # TypeScript tip tanımları
└── hooks/                # Custom React hooks
```

## 🔧 Düzeltilen Sorunlar

### ✅ Tamamlanan Düzeltmeler:
- **Tailwind CSS konfigürasyonu** eklendi
- **Firebase import path'leri** düzeltildi (`../../../lib/firebase` → `@/lib/firebase`)
- **TypeScript any tipleri** uygun tiplerle değiştirildi
- **Environment variables** düzenlendi ve güvenlik artırıldı
- **AANewsService** servisi oluşturuldu
- **Build hatalarının** çoğu düzeltildi

### ⚠️ Dikkat Edilmesi Gerekenler:
- **Güvenlik açıkları**: `npm audit fix --force` komutu çalıştırılmalı
- **React Quill**: XSS güvenlik açığı var, alternatif editor değerlendirilebilir

## 🛡️ Güvenlik

Bu proje aşağıdaki güvenlik önlemlerini içerir:
- Environment variables ile API anahtarları
- Firebase Security Rules
- Content Security Policy headers
- XSS koruması (build-in Next.js)

## 📝 Scripter

```json
{
  "dev": "next dev --turbopack",      // Development server
  "build": "next build",               // Production build
  "start": "next start",               // Production server
  "lint": "next lint",                 // ESLint kontrolü
  "create-admin": "node scripts/create-admin-user.mjs"
}
```

## 🔗 Firebase Konfigürasyonu

1. Firebase Console'da yeni proje oluşturun
2. Firestore Database'i etkinleştirin
3. Authentication'ı etkinleştirin
4. Web uygulaması ekleyin
5. Konfigürasyon değerlerini `.env.local` dosyasına ekleyin

## 📱 Özellikler

- **Responsive tasarım** - Mobil, tablet ve desktop uyumlu
- **Dark/Light mode** - Kullanıcı tercihi ile tema değişimi
- **PWA desteği** - Progressive Web App özellikleri
- **SEO optimizasyonu** - Meta tags, sitemap, robots.txt
- **Performans optimizasyonu** - Image optimization, lazy loading
- **Real-time güncellemeler** - Firebase real-time database
- **Admin paneli** - İçerik yönetim sistemi

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🐛 Bilinen Sorunlar

- React Quill güvenlik açığı (çözüm: `npm audit fix --force`)
- Bazı bileşenlerde TypeScript strict mode uyarıları

## 📞 Destek

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.
