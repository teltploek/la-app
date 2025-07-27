"use client";

import { useEffect, useState } from 'react';

export default function ServiceWorkerDebug() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Only show in development or with debug flag
    const urlParams = new URLSearchParams(window.location.search);
    if (process.env.NODE_ENV === 'development' || urlParams.get('debug') === 'true') {
      setShowDebug(true);
      
      // Check service worker status
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          setDebugInfo(prev => [...prev, `SW State: ${registration.active?.state || 'not active'}`]);
          
          // Check cache contents
          if ('caches' in window) {
            caches.keys().then(names => {
              setDebugInfo(prev => [...prev, `Caches: ${names.join(', ')}`]);
              
              // List cached URLs
              names.forEach(name => {
                caches.open(name).then(cache => {
                  cache.keys().then(requests => {
                    const urls = requests.map(r => r.url).filter(u => u.includes('/day/'));
                    if (urls.length > 0) {
                      setDebugInfo(prev => [...prev, `Cached day pages in ${name}: ${urls.length}`]);
                    }
                  });
                });
              });
            });
          }
        });
      }
    }
  }, []);

  if (!showDebug || debugInfo.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 bg-black bg-opacity-80 text-white text-xs p-2 rounded max-w-md">
      <div className="font-bold mb-1">SW Debug:</div>
      {debugInfo.map((info, i) => (
        <div key={i}>{info}</div>
      ))}
    </div>
  );
}