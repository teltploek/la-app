// Service Worker for LA Trip App
const CACHE_NAME = 'la-trip-v8';

// Core routes to cache during install
const CORE_CACHE = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico'
];

// All app routes
const APP_ROUTES = [
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
  '/activity/day7-1'
];

// Icon sizes
const ICON_SIZES = [16, 32, 96, 152, 167, 180, 192, 512];

// Install event - cache core assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching core assets');
        return cache.addAll(CORE_CACHE);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[ServiceWorker] Install failed:', err);
      })
  );
});

// Activate event - claim clients and cache all routes
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Claim all clients
      self.clients.claim(),
      
      // Pre-cache all routes after activation
      caches.open(CACHE_NAME).then(cache => {
        console.log('[ServiceWorker] Pre-caching all routes');
        
        // Cache app routes
        APP_ROUTES.forEach(url => {
          fetch(url)
            .then(response => {
              if (response.ok) {
                cache.put(url, response);
                console.log('[ServiceWorker] Cached:', url);
              }
            })
            .catch(err => console.warn('[ServiceWorker] Failed to cache:', url, err));
        });
        
        // Cache icons
        ICON_SIZES.forEach(size => {
          const url = `/api/icon?size=${size}`;
          fetch(url)
            .then(response => {
              if (response.ok) {
                cache.put(url, response);
                console.log('[ServiceWorker] Cached icon:', size);
              }
            })
            .catch(err => console.warn('[ServiceWorker] Failed to cache icon:', size, err));
        });
      })
    ])
  );
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  // Skip webpack/development requests
  if (url.pathname.includes('webpack') || 
      url.pathname.includes('_next/static/development') ||
      url.pathname.includes('__nextjs')) {
    return;
  }

  // For navigation requests (HTML pages)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      // Try network first
      fetch(request)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response not ok');
          }
          // Cache successful responses
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse) {
                console.log('[ServiceWorker] Serving from cache:', request.url);
                return cachedResponse;
              }
              // Not in cache, return offline page
              return caches.match('/offline')
                .then(offlineResponse => {
                  if (offlineResponse) {
                    return offlineResponse;
                  }
                  // Last resort - return a basic offline message
                  return new Response(
                    '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body><h1>Offline</h1><p>Please check your connection.</p></body></html>',
                    { headers: { 'Content-Type': 'text/html' } }
                  );
                });
            });
        })
    );
    return;
  }

  // For all other requests (assets), use cache-first
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Return from cache and update in background
          fetch(request).then(response => {
            if (response.ok) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, response);
              });
            }
          }).catch(() => {
            // Ignore network errors for background update
          });
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request).then(response => {
          if (!response.ok) {
            throw new Error('Network response not ok');
          }
          
          // Cache successful responses
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          
          return response;
        });
      })
      .catch(() => {
        // Both cache and network failed
        console.error('[ServiceWorker] Request failed:', request.url);
        return new Response('Resource not available offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
  );
});

// Handle skip waiting message
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});