const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to get all files in the .next/static directory
function getStaticAssets() {
  const buildDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(buildDir, 'static');
  
  if (!fs.existsSync(staticDir)) {
    console.error('Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Get all static assets
  const staticAssets = glob.sync('**/*', {
    cwd: staticDir,
    nodir: true,
  }).map(file => `/_next/static/${file}`);

  return staticAssets;
}

// Function to get all prerendered HTML pages
function getPrerenderedPages() {
  const serverDir = path.join(process.cwd(), '.next/server/app');
  const pages = [];

  if (!fs.existsSync(serverDir)) {
    return pages;
  }

  // Find all HTML files
  const htmlFiles = glob.sync('**/*.html', {
    cwd: serverDir,
    nodir: true,
  });

  // Convert file paths to routes
  htmlFiles.forEach(file => {
    let route = file.replace(/\.html$/, '');
    route = route.replace(/\/index$/, '');
    route = route.replace(/^index$/, '');
    if (route && !route.startsWith('/')) {
      route = '/' + route;
    }
    if (!route) {
      route = '/';
    }
    pages.push(route);
  });

  return pages;
}

// Generate the service worker with all assets
function generateServiceWorker() {
  const staticAssets = getStaticAssets();
  const pages = getPrerenderedPages();
  
  // All routes that need to be cached
  const routes = [
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

  const swContent = `// Auto-generated service worker
const CACHE_VERSION = 'la-trip-v4-${Date.now()}';
const STATIC_CACHE = \`static-\${CACHE_VERSION}\`;
const DYNAMIC_CACHE = \`dynamic-\${CACHE_VERSION}\`;

// All routes that need to be cached
const ROUTES_TO_CACHE = ${JSON.stringify(routes, null, 2)};

// Static assets that should be cached
const STATIC_ASSETS = [
  '/manifest.json',
  '/favicon.ico',
  '/api/icon?size=96',
  '/api/icon?size=192',
  '/api/icon?size=512',
];

// Next.js build assets
const BUILD_ASSETS = ${JSON.stringify(staticAssets, null, 2)};

// All assets to pre-cache
const ALL_ASSETS = [...ROUTES_TO_CACHE, ...STATIC_ASSETS, ...BUILD_ASSETS];

// Install event - pre-cache all assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Pre-caching all assets');
        // Cache in smaller batches to avoid overwhelming the browser
        const batchSize = 10;
        const promises = [];
        
        for (let i = 0; i < ALL_ASSETS.length; i += batchSize) {
          const batch = ALL_ASSETS.slice(i, i + batchSize);
          promises.push(
            cache.addAll(batch).catch(err => {
              console.error('Failed to cache batch:', batch, err);
              // Continue with other batches even if one fails
              return Promise.resolve();
            })
          );
        }
        
        return Promise.all(promises);
      })
      .then(() => {
        console.log('Service Worker: Pre-caching complete');
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

  // Skip webpack hot reload in development
  if (url.pathname.includes('webpack') && url.pathname.includes('hot')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        const fetchRequest = request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
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

            caches.open(cacheName)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed:', error);
            
            if (request.mode === 'navigate') {
              return caches.match('/offline').then((response) => {
                if (response) {
                  return response;
                }
                return caches.match('/').then((homeResponse) => {
                  if (homeResponse) {
                    return homeResponse;
                  }
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
`;

  // Write the service worker file
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  fs.writeFileSync(swPath, swContent);
  
  console.log('✅ Service worker generated successfully!');
  console.log(`📦 Pre-caching ${routes.length} routes and ${staticAssets.length} static assets`);
}

// Run the script
generateServiceWorker();