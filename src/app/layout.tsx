import type { Metadata } from 'next';
import './globals.css';
import { WebVitals } from '@/components/analytics/WebVitals';
import { Toaster } from 'sonner';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: {
    default: 'NetNext - Son Dakika Haberler',
    template: '%s | NetNext'
  },
  description: 'Son dakika haberleri, güncel haberler ve köşe yazıları. Türkiye ve dünyadan en güncel haberler NetNext\'te.',
  keywords: 'haber, son dakika, güncel, Türkiye, dünya, spor, ekonomi, teknoloji',
  authors: [{ name: 'NetNext' }],
  creator: 'NetNext',
  publisher: 'NetNext',
  robots: 'index, follow',
  metadataBase: new URL('https://netnext.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://netnext.vercel.app',
    siteName: 'NetNext',
    title: 'NetNext - Son Dakika Haberler',
    description: 'Son dakika haberleri, güncel haberler ve köşe yazıları. Türkiye ve dünyadan en güncel haberler NetNext\'te.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NetNext - Son Dakika Haberler'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NetNext - Son Dakika Haberler',
    description: 'Son dakika haberleri, güncel haberler ve köşe yazıları.',
    images: ['/og-image.jpg'],
    creator: '@netnext'
  },
  verification: {
    google: 'google-site-verification-code',
    yahoo: 'yahoo-site-verification-code'
  },
  alternates: {
    canonical: 'https://netnext.vercel.app',
    languages: {
      'tr-TR': 'https://netnext.vercel.app'
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#0070f3" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://firebaseapp.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//googletagmanager.com" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsMediaOrganization",
              "name": "NetNext",
              "url": "https://netnext.vercel.app",
              "logo": {
                "@type": "ImageObject",
                "url": "https://netnext.vercel.app/logo.png"
              },
              "sameAs": [
                "https://twitter.com/netnext",
                "https://facebook.com/netnext"
              ]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ToastProvider>
          {children}
          <WebVitals />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
            }}
          />
          <ToastViewport />
        </ToastProvider>
        
        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
