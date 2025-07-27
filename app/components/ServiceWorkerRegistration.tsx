"use client";

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegistration() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);

          // Check for updates periodically (every hour)
          setInterval(() => {
            registration.update();
          }, 1000 * 60 * 60);

          // Listen for new service worker waiting
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is waiting to activate
                  setWaitingWorker(newWorker);
                  setShowUpdatePrompt(true);
                }
              });
            }
          });
        },
        (err) => {
          console.error('ServiceWorker registration failed: ', err);
        }
      );

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload the page when the service worker controller changes
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Tell the waiting service worker to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 border border-emerald-500">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Ny version tilgængelig
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        En ny version af appen er klar. Opdater for at få de seneste funktioner og forbedringer.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleUpdate}
          className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          Opdater nu
        </button>
        <button
          onClick={handleDismiss}
          className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
        >
          Senere
        </button>
      </div>
    </div>
  );
}