"use client";

import { useEffect } from 'react';

export default function CacheNextAssets() {
  useEffect(() => {
    // Only run if service worker is available and page is loaded
    if ('serviceWorker' in navigator && document.readyState === 'complete') {
      // Wait a bit to not interfere with initial page load
      setTimeout(async () => {
        try {
          // Get all script and link tags
          const scripts = Array.from(document.querySelectorAll('script[src]'));
          const links = Array.from(document.querySelectorAll('link[href]'));
          
          // Extract URLs
          const assets = [
            ...scripts.map(s => s.getAttribute('src')).filter(Boolean),
            ...links.map(l => l.getAttribute('href')).filter(Boolean)
          ].filter(url => {
            // Only cache Next.js assets and local resources
            return url && (
              url.includes('_next/') ||
              url.startsWith('/') ||
              url.includes('.js') ||
              url.includes('.css')
            );
          });

          // Send to service worker to cache
          if (navigator.serviceWorker.controller && assets.length > 0) {
            navigator.serviceWorker.controller.postMessage({
              type: 'CACHE_ASSETS',
              assets: assets
            });
            console.log('[CacheNextAssets] Requested caching of', assets.length, 'assets');
          }

          // Also pre-fetch all routes
          const routes = [
            '/day/1', '/day/2', '/day/3', '/day/4', '/day/5', '/day/6', '/day/7',
            '/practical-info', '/points-of-interest',
            '/activity/day1-1', '/activity/day2-1', '/activity/day2-2', '/activity/day2-3',
            '/activity/day2-4', '/activity/day2-5', '/activity/day3-1', '/activity/day3-2',
            '/activity/day4-1', '/activity/day4-2', '/activity/day4-3', '/activity/day4-4',
            '/activity/day4-5', '/activity/day5-1', '/activity/day5-2', '/activity/day6-1',
            '/activity/day6-2', '/activity/day7-1'
          ];

          // Pre-fetch routes in background
          routes.forEach(route => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = route;
            document.head.appendChild(link);
            
            // Also trigger a fetch to ensure caching
            fetch(route, {
              mode: 'no-cors',
              cache: 'force-cache'
            }).then(() => {
              console.log('[CacheNextAssets] Pre-fetched:', route);
            }).catch(err => {
              console.warn('[CacheNextAssets] Failed to pre-fetch:', route, err);
            });
          });

          console.log('[CacheNextAssets] Pre-fetching all routes');
        } catch (error) {
          console.error('[CacheNextAssets] Error:', error);
        }
      }, 1000);
    }
  }, []);

  return null;
}