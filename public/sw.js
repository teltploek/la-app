const CACHE_VERSION = 'la-trip-v6';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const NEXT_DATA_CACHE = `next-data-${CACHE_VERSION}`;

// Force update any existing service worker
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

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
  '/offline',
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
];

// API routes for icons
const API_ROUTES = [
  '/api/icon?size=96',
  '/api/icon?size=192',
  '/api/icon?size=512',
];

// Install event - pre-cache essential assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache HTML pages
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Pre-caching pages');
        // Cache routes in smaller batches
        const promises = [];
        const batchSize = 5;
        
        for (let i = 0; i < ROUTES_TO_CACHE.length; i += batchSize) {
          const batch = ROUTES_TO_CACHE.slice(i, i + batchSize);
          promises.push(
            cache.addAll(batch).catch(err => {
              console.warn('Failed to cache batch:', batch, err);
              // Continue with other batches
              return Promise.resolve();
            })
          );
        }
        
        // Also cache static assets
        promises.push(
          cache.addAll(STATIC_ASSETS).catch(err => {
            console.warn('Failed to cache static assets:', err);
            return Promise.resolve();
          })
        );
        
        // Cache API routes
        promises.push(
          cache.addAll(API_ROUTES).catch(err => {
            console.warn('Failed to cache API routes:', err);
            return Promise.resolve();
          })
        );
        
        return Promise.all(promises);
      }),
    ])
    .then(() => {
      console.log('Service Worker: Pre-caching complete');
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error('Service Worker: Installation failed:', error);
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
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== NEXT_DATA_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Claiming clients');
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

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip Next.js hot reloading and development paths
  if (url.pathname.includes('_next/webpack-hmr') || 
      url.pathname.includes('__nextjs') ||
      url.pathname.includes('_next/image') ||
      url.pathname.includes('_vercel')) {
    return;
  }
  
  // For root path, ensure we serve the cached version in standalone mode
  if (url.pathname === '/' || url.pathname === '') {
    event.respondWith(
      caches.match('/')
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request);
        })
        .catch(() => {
          // If both cache and network fail, show offline page
          return caches.match('/offline').then((offlineResponse) => {
            if (offlineResponse) {
              return offlineResponse;
            }
            return new Response(
              '<html><body><h1>Offline</h1><p>App ikke tilgængelig offline.</p></body></html>',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            );
          });
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true })
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response if found
          return cachedResponse;
        }

        // Clone the request
        const fetchRequest = request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Determine cache strategy
            const isStaticAsset = 
              url.pathname.includes('/_next/static/') ||
              url.pathname.includes('/api/icon') ||
              url.pathname.endsWith('.woff2') ||
              url.pathname.endsWith('.woff') ||
              url.pathname.endsWith('.css') ||
              url.pathname.endsWith('.js') ||
              url.pathname.endsWith('.json') ||
              url.pathname.endsWith('.svg') ||
              url.pathname.endsWith('.ico') ||
              url.pathname.endsWith('.png') ||
              url.pathname.endsWith('.jpg') ||
              url.pathname.endsWith('.jpeg');

            const isDataRequest = 
              url.pathname.includes('/_next/data/') ||
              url.pathname.endsWith('.json');

            let cacheName = DYNAMIC_CACHE;
            if (isStaticAsset) {
              cacheName = STATIC_CACHE;
            } else if (isDataRequest) {
              cacheName = NEXT_DATA_CACHE;
            }

            // Cache the response
            caches.open(cacheName)
              .then((cache) => {
                cache.put(request, responseToCache);
              })
              .catch((err) => {
                console.warn('Failed to cache response:', err);
              });

            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed:', error);
            
            // For navigation requests, return offline page
            if (request.mode === 'navigate') {
              return caches.match('/offline')
                .then((offlineResponse) => {
                  if (offlineResponse) {
                    return offlineResponse;
                  }
                  // Fallback to home page
                  return caches.match('/')
                    .then((homeResponse) => {
                      if (homeResponse) {
                        return homeResponse;
                      }
                      // Last resort
                      return new Response(
                        '<html><body><h1>Offline</h1><p>Please check your connection.</p></body></html>',
                        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                      );
                    });
                });
            }
            
            // For other requests, just reject
            throw error;
          });
      })
  );
});

// Listen for messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});