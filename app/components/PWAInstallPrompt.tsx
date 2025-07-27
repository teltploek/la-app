"use client";

import { useEffect, useState } from 'react';

export default function PWAInstallPrompt() {
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone) || 
                      false;
    
    setIsStandalone(standalone);

    // Check if iOS and not in standalone
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
    
    if (isIOS && !standalone && !localStorage.getItem('ios-install-dismissed')) {
      setShowIOSPrompt(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('ios-install-dismissed', 'true');
    setShowIOSPrompt(false);
  };

  if (!showIOSPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-50">
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Installer app for offline brug
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          Tilføj denne app til din hjemmeskærm for at bruge den offline under flyvningen.
        </p>
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>1. Tryk på del-knappen <span className="inline-block w-4 h-4 align-text-bottom">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </span> i Safari</p>
            <p>2. Vælg &ldquo;Føj til hjemmeskærm&rdquo;</p>
            <p>3. Tryk &ldquo;Tilføj&rdquo;</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Luk
          </button>
        </div>
      </div>
    </div>
  );
}