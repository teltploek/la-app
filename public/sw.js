// Service Worker for LA Trip App - Complete Offline Support v14
const CACHE_NAME = 'la-trip-v14';

// Assets to cache during install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  // Day pages
  '/day/1',
  '/day/2', 
  '/day/3',
  '/day/4',
  '/day/5',
  '/day/6',
  '/day/7',
  // Other pages
  '/practical-info',
  '/points-of-interest',
  // Activity pages - all of them
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

// Install - cache everything
self.addEventListener('install', event => {
  console.log('[SW v14] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW v14] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW v14] Install complete - cached', STATIC_ASSETS.length, 'routes');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[SW v14] Install failed:', err);
      })
  );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  console.log('[SW v14] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW v14] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW v14] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET and cross-origin
  if (request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }
  
  // Skip dev server requests
  if (url.pathname.includes('_next/static/development') ||
      url.pathname.includes('webpack') ||
      url.pathname.includes('hot-update')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(request).then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          console.log('[SW v14] Cache hit:', request.url);
          return cachedResponse;
        }

        // For navigation to our app routes, try pathname match
        if (request.mode === 'navigate' || request.destination === 'document') {
          // Try exact pathname match
          return cache.match(url.pathname).then(pathResponse => {
            if (pathResponse) {
              console.log('[SW v14] Pathname cache hit:', url.pathname);
              return pathResponse;
            }

            // Try without trailing slash
            const pathWithoutSlash = url.pathname.replace(/\/$/, '');
            return cache.match(pathWithoutSlash).then(noSlashResponse => {
              if (noSlashResponse) {
                console.log('[SW v14] Pathname (no slash) cache hit:', pathWithoutSlash);
                return noSlashResponse;
              }

              // Try with trailing slash
              const pathWithSlash = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
              return cache.match(pathWithSlash).then(slashResponse => {
                if (slashResponse) {
                  console.log('[SW v14] Pathname (with slash) cache hit:', pathWithSlash);
                  return slashResponse;
                }

                // Fallback to network
                return fetchAndCache(request, cache);
              });
            });
          });
        }

        // For other requests (JS, CSS, etc), fetch and cache
        return fetchAndCache(request, cache);
      });
    })
  );
});

// Fetch from network and update cache
function fetchAndCache(request, cache) {
  return fetch(request)
    .then(response => {
      // Check if valid response
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      // Clone the response
      const responseToCache = response.clone();

      // Cache everything that's successful
      cache.put(request, responseToCache).then(() => {
        console.log('[SW v14] Cached:', request.url);
        
        // Also cache by pathname for navigation requests
        if (request.mode === 'navigate' || request.destination === 'document') {
          const url = new URL(request.url);
          cache.put(url.pathname, responseToCache.clone());
        }
      });

      return response;
    })
    .catch(error => {
      console.error('[SW v14] Fetch failed:', request.url, error);
      
      // For navigation requests, show offline page
      if (request.mode === 'navigate' || request.destination === 'document') {
        return cache.match('/offline').then(offlineResponse => {
          if (offlineResponse) {
            return offlineResponse;
          }
          // Last resort offline page
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body style="font-family: -apple-system, sans-serif; text-align: center; padding: 20px;"><h1>Offline</h1><p>Denne side er ikke tilgængelig offline.</p><p>Sørg for at besøge alle sider mens du er online.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        });
      }
      
      // For other requests, return error
      return new Response('Network error', { status: 503 });
    });
}

// Handle skip waiting
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});