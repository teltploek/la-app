'use client';

import { useState } from 'react';

interface AppLinkProps {
  appStoreUrl: string;
  appScheme?: string;
  appName: string;
}

export default function AppLink({ appStoreUrl, appScheme, appName }: AppLinkProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (appScheme) {
      setIsOpening(true);
      
      // Try to open the app first
      const timeout = setTimeout(() => {
        // If we're still here after 2.5 seconds, the app probably isn't installed
        window.open(appStoreUrl, '_blank');
        setIsOpening(false);
      }, 2500);

      try {
        // Attempt to open the app
        window.location.href = appScheme;
        
        // Clear the timeout if the app opens successfully
        setTimeout(() => {
          clearTimeout(timeout);
          setIsOpening(false);
        }, 100);
      } catch {
        // If error, open App Store
        clearTimeout(timeout);
        window.open(appStoreUrl, '_blank');
        setIsOpening(false);
      }
    } else {
      // No app scheme provided, just open App Store
      window.open(appStoreUrl, '_blank');
    }
  };

  return (
    <a 
      href={appStoreUrl}
      onClick={handleClick}
      className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
    >
      📱 {isOpening ? 'Åbner...' : `Download ${appName}`}
    </a>
  );
}