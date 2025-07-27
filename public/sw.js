const CACHE_VERSION = 'la-trip-v3';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;

// All routes that need to be cached
const ROUTES_TO_CACHE = [
  '/',
  '/day/1',
  '/day/2',
  '/day/3',
  '/day/4',
  '/day/5',
  '/day/6',
  '/day/7',
  '/practical-info',
  '/points-of-interest',
  // Activity pages
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
];

// Static assets that should be cached
const STATIC_ASSETS = [
  '/manifest.json',
  '/favicon.ico',
  '/api/icon?size=192',
  '/api/icon?size=512',
  '/offline',
];

// Install event - pre-cache essential assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Pre-caching routes and static assets');
        // Cache all routes and static assets
        return cache.addAll([...ROUTES_TO_CACHE, ...STATIC_ASSETS]);
      })
      .then(() => {
        console.log('Service Worker: Pre-caching complete');
        // Skip waiting to activate immediately
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Pre-caching failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Claiming clients');
        // Take control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP(S) requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Skip requests to external domains
  if (url.origin !== location.origin) {
    return;
  }

  // Skip webpack hot reload and dev server requests
  if (url.pathname.includes('webpack') && url.pathname.includes('hot')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response if found
          return cachedResponse;
        }

        // Clone the request because it can only be used once
        const fetchRequest = request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it can only be used once
            const responseToCache = response.clone();

            // Determine which cache to use
            const isStaticAsset = 
              request.url.includes('/_next/static/') ||
              request.url.includes('/api/icon') ||
              request.url.endsWith('.woff2') ||
              request.url.endsWith('.woff') ||
              request.url.endsWith('.css') ||
              request.url.endsWith('.js') ||
              request.url.endsWith('.json') ||
              request.url.endsWith('.svg') ||
              request.url.endsWith('.ico');

            const cacheName = isStaticAsset ? STATIC_CACHE : DYNAMIC_CACHE;

            // Cache the response
            caches.open(cacheName)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed:', error);
            
            // If it's a navigation request, try to return the offline page
            if (request.mode === 'navigate') {
              return caches.match('/offline').then((response) => {
                if (response) {
                  return response;
                }
                // If even the offline page isn't cached, try the home page
                return caches.match('/').then((homeResponse) => {
                  if (homeResponse) {
                    return homeResponse;
                  }
                  // Last resort: return a basic offline message
                  return new Response(
                    '<html><body><h1>Offline</h1><p>Siden er ikke tilgængelig offline.</p></body></html>',
                    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                  );
                });
              });
            }
            
            throw error;
          });
      })
  );
});

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});