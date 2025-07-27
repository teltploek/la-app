// Service Worker for LA Trip App
const CACHE_NAME = 'la-trip-v9';

// Core routes to cache during install
const CORE_CACHE = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico'
];

// All app routes - both HTML and data
const APP_ROUTES = [
  // HTML pages
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
      
      // Pre-cache all routes and data after activation
      caches.open(CACHE_NAME).then(cache => {
        console.log('[ServiceWorker] Pre-caching all routes');
        
        // Cache HTML pages
        APP_ROUTES.forEach(url => {
          fetch(url, {
            headers: {
              'Accept': 'text/html'
            }
          })
            .then(response => {
              if (response.ok) {
                cache.put(url, response.clone());
                console.log('[ServiceWorker] Cached HTML:', url);
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

// Fetch event handler
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

  // Clone the request for potential modifications
  let modifiedRequest = request;

  // For app routes, ensure we request HTML
  if (APP_ROUTES.includes(url.pathname)) {
    modifiedRequest = new Request(request, {
      headers: new Headers({
        ...request.headers,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      })
    });
  }

  // Handle all requests
  event.respondWith(
    caches.match(request, { ignoreVary: true })
      .then(cachedResponse => {
        // If we have a cache hit, return it
        if (cachedResponse) {
          console.log('[ServiceWorker] Cache hit:', request.url);
          
          // For HTML pages, also update cache in background
          if (request.mode === 'navigate' || 
              request.headers.get('accept')?.includes('text/html') ||
              APP_ROUTES.includes(url.pathname)) {
            fetch(modifiedRequest).then(response => {
              if (response.ok) {
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(request, response);
                });
              }
            }).catch(() => {
              // Ignore errors in background update
            });
          }
          
          return cachedResponse;
        }

        // No cache hit, fetch from network
        console.log('[ServiceWorker] Cache miss, fetching:', request.url);
        return fetch(modifiedRequest)
          .then(response => {
            // Don't cache non-ok responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response before caching
            const responseToCache = response.clone();

            // Cache everything useful
            caches.open(CACHE_NAME).then(cache => {
              // Cache all successful responses
              cache.put(request, responseToCache);
              console.log('[ServiceWorker] Cached new:', request.url);
            });

            return response;
          })
          .catch(error => {
            console.error('[ServiceWorker] Fetch failed:', request.url, error);
            
            // For navigation requests, try offline page
            if (request.mode === 'navigate') {
              return caches.match('/offline').then(response => {
                if (response) {
                  return response;
                }
                // Last resort
                return new Response(
                  '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body><h1>Offline</h1><p>Denne side er ikke tilgængelig offline.</p></body></html>',
                  { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                );
              });
            }
            
            // For other requests, return error
            return new Response('Network error', {
              status: 503,
              statusText: 'Service Unavailable'
            });
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

// Catch any unhandled errors
self.addEventListener('error', event => {
  console.error('[ServiceWorker] Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('[ServiceWorker] Unhandled rejection:', event.reason);
});