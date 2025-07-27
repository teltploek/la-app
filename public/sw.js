// Service Worker for LA Trip App - iOS PWA Optimized
const CACHE_NAME = 'la-trip-v11';

// Core assets to cache immediately
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

// Icon sizes to cache
const ICON_SIZES = [16, 32, 96, 152, 167, 180, 192, 512];

// Install event - cache everything needed for offline
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        console.log('[ServiceWorker] Caching core assets');
        
        // Cache core assets first
        await cache.addAll(CORE_CACHE);
        
        // Cache all routes - critical for offline
        console.log('[ServiceWorker] Caching all routes');
        const routePromises = APP_ROUTES.map(async (url) => {
          try {
            const response = await fetch(url, {
              headers: {
                'Accept': 'text/html,application/xhtml+xml'
              }
            });
            if (response.ok) {
              await cache.put(url, response);
              console.log('[ServiceWorker] Cached route:', url);
            }
          } catch (err) {
            console.warn('[ServiceWorker] Failed to cache route:', url, err);
          }
        });
        
        // Cache icons
        const iconPromises = ICON_SIZES.map(async (size) => {
          try {
            const url = `/api/icon?size=${size}`;
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response);
              console.log('[ServiceWorker] Cached icon:', size);
            }
          } catch (err) {
            console.warn('[ServiceWorker] Failed to cache icon:', size, err);
          }
        });
        
        // Wait for all caching to complete before finishing install
        await Promise.all([...routePromises, ...iconPromises]);
        
        console.log('[ServiceWorker] All assets cached, install complete');
      })
      .then(() => {
        // Don't skip waiting during install - let caching complete first
        console.log('[ServiceWorker] Install complete');
      })
      .catch(err => {
        console.error('[ServiceWorker] Install failed:', err);
      })
  );
});

// Activate event
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
      
      // Claim all clients immediately
      self.clients.claim()
    ])
  );
});

// Fetch event handler - iOS optimized
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (url.origin !== location.origin || request.method !== 'GET') {
    return;
  }

  // Skip development/webpack requests
  if (url.pathname.includes('webpack') || 
      url.pathname.includes('_next/static/development') ||
      url.pathname.includes('__nextjs') ||
      url.pathname.includes('hot-update')) {
    return;
  }

  // Handle requests
  event.respondWith(
    (async () => {
      // Try cache first
      const cachedResponse = await caches.match(request, { 
        ignoreSearch: true, 
        ignoreVary: true 
      });

      if (cachedResponse) {
        console.log('[ServiceWorker] Serving from cache:', request.url);
        
        // Update cache in background for HTML pages
        if (request.mode === 'navigate' || 
            request.headers.get('accept')?.includes('text/html') ||
            APP_ROUTES.includes(url.pathname)) {
          
          // iOS fix: Create proper request with headers
          const fetchRequest = new Request(request, {
            cache: 'no-cache',
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
          });
          
          fetch(fetchRequest)
            .then(response => {
              if (response && response.ok) {
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(request, response);
                });
              }
            })
            .catch(() => {
              // Ignore background update errors
            });
        }
        
        return cachedResponse;
      }

      // No cache, try network
      console.log('[ServiceWorker] Fetching from network:', request.url);
      
      try {
        // Create proper request for iOS
        const fetchRequest = request.mode === 'navigate' || APP_ROUTES.includes(url.pathname)
          ? new Request(request, {
              headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
              }
            })
          : request;

        const response = await fetch(fetchRequest);
        
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          // For 404s on HTML pages, still cache them
          if (response.status === 404 && request.mode === 'navigate') {
            return response;
          }
          return response;
        }

        // Clone and cache the response
        const responseToCache = response.clone();
        
        // Cache all successful responses including Next.js assets
        if (url.pathname.includes('_next/static') || 
            url.pathname.includes('_next/') ||
            url.pathname.endsWith('.js') ||
            url.pathname.endsWith('.css') ||
            url.pathname.endsWith('.json') ||
            request.mode === 'navigate' ||
            APP_ROUTES.includes(url.pathname)) {
          
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
            console.log('[ServiceWorker] Cached from network:', request.url);
          });
        }

        return response;
      } catch (error) {
        console.error('[ServiceWorker] Network request failed:', request.url, error);
        
        // For navigation, return offline page
        if (request.mode === 'navigate') {
          const offlineResponse = await caches.match('/offline');
          if (offlineResponse) {
            return offlineResponse;
          }
          // Fallback HTML
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Offline</title></head><body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; text-align: center;"><h1>Offline</h1><p>Denne side er ikke tilgængelig offline.</p><p>Prøv at genindlæse siden når du har forbindelse igen.</p></body></html>',
            { 
              headers: { 
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-store'
              } 
            }
          );
        }
        
        // For other requests, return error
        return new Response('Network error', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});

// Handle skip waiting message
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[ServiceWorker] Skip waiting requested');
    self.skipWaiting();
  }
  
  // Handle cache request
  if (event.data && event.data.type === 'CACHE_ASSETS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(event.data.assets);
      })
    );
  }
});

// iOS specific: Handle errors gracefully
self.addEventListener('error', event => {
  console.error('[ServiceWorker] Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('[ServiceWorker] Unhandled rejection:', event.reason);
  event.preventDefault();
});