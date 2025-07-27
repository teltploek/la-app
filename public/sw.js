// Service Worker for LA Trip App
const CACHE_NAME = 'la-trip-v7';
const urlsToCache = [
  '/',
  '/offline',
  '/day/1',
  '/day/2',
  '/day/3',
  '/day/4',
  '/day/5',
  '/day/6',
  '/day/7',
  '/practical-info',
  '/points-of-interest',
  '/activity/day1-1',
  '/activity/day2-1',
  '/activity/day2-2',
  '/activity/day2-3',
  '/activity/day2-4',
  '/activity/day2-5',
  '/activity/day3-1',
  '/activity/day3-2',
  '/activity/day4-1',
  '/activity/day4-2',
  '/activity/day4-3',
  '/activity/day4-4',
  '/activity/day4-5',
  '/activity/day5-1',
  '/activity/day5-2',
  '/activity/day6-1',
  '/activity/day6-2',
  '/activity/day7-1',
  '/manifest.json',
  '/favicon.ico',
  '/api/icon?size=32',
  '/api/icon?size=16',
  '/api/icon?size=96',
  '/api/icon?size=152',
  '/api/icon?size=167',
  '/api/icon?size=180',
  '/api/icon?size=192',
  '/api/icon?size=512'
];

// Install event
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        // Cache one by one to handle failures gracefully
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.error(`[ServiceWorker] Failed to cache ${url}:`, err);
            });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Cache First Strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle requests
  event.respondWith(
    caches.match(request, { ignoreSearch: true })
      .then(response => {
        if (response) {
          console.log('[ServiceWorker] Found in cache:', request.url);
          return response;
        }

        console.log('[ServiceWorker] Not in cache, fetching:', request.url);
        return fetch(request).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache valid responses
          caches.open(CACHE_NAME).then(cache => {
            // Cache everything that's not a hot reload or dev resource
            if (!request.url.includes('_next/webpack') && 
                !request.url.includes('__nextjs') &&
                !request.url.includes('hot-update')) {
              cache.put(request, responseToCache);
            }
          });

          return response;
        });
      })
      .catch(() => {
        // Offline fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/offline');
        }
        // For other requests, just return an error
        return new Response('Network error', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});

// Handle messages
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});