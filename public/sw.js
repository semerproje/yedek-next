// Service Worker for Advanced Caching
const CACHE_NAME = 'netnext-v1';
const STATIC_CACHE_NAME = 'netnext-static-v1';
const DYNAMIC_CACHE_NAME = 'netnext-dynamic-v1';

// Cache strategies
const CACHE_STRATEGIES = {
  images: 'cache-first',
  api: 'network-first',
  static: 'cache-first',
  html: 'network-first'
};

// Files to cache immediately
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon.svg'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event with advanced caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other protocols
  if (!request.url.startsWith('http')) return;

  // API requests - Network First
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    return;
  }

  // Images - Cache First with WebP optimization
  if (request.destination === 'image') {
    event.respondWith(cacheFirstWithWebP(request));
    return;
  }

  // Static assets - Cache First
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    return;
  }

  // HTML pages - Network First with fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }

  // Default strategy
  event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
});

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    // Update cache in background
    fetch(request).then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {});
    
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return offline fallback if available
    return await cache.match('/offline') || new Response('Offline', { status: 503 });
  }
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Cache successful responses
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Fall back to cache
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // Ultimate fallback
    if (request.mode === 'navigate') {
      return await cache.match('/offline') || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

// Cache First with WebP optimization
async function cacheFirstWithWebP(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  
  // Try WebP version first (for modern browsers)
  if (self.registration && 'format' in new URL(request.url).searchParams === false) {
    const webpUrl = new URL(request.url);
    webpUrl.searchParams.set('format', 'webp');
    
    const webpCached = await cache.match(webpUrl.toString());
    if (webpCached) {
      return webpCached;
    }
  }
  
  // Try original cached version
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Return placeholder image
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em">Resim Yüklenemedi</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Network First with Offline fallback
async function networkFirstWithOffline(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Try cache first
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // Show offline page
    return await cache.match('/offline') || new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Çevrimdışı - NetNext</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .offline { color: #666; }
          </style>
        </head>
        <body>
          <div class="offline">
            <h1>Çevrimdışısınız</h1>
            <p>İnternet bağlantınızı kontrol edin ve tekrar deneyin.</p>
            <button onclick="window.location.reload()">Yeniden Dene</button>
          </div>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Sync pending analytics data when online
  const cache = await caches.open('analytics-queue');
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      await fetch(request);
      await cache.delete(request);
    } catch (error) {
      console.log('Analytics sync failed, will retry later');
    }
  }
}
