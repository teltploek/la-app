"use client";

import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simple timeout-based loading
    // Don't wait for service worker as it might cause issues
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
          <span className="text-white text-5xl font-bold">LA</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">LA Familietur 2025</h1>
        <p className="text-gray-600">Indlæser app...</p>
      </div>
    </div>
  );
}