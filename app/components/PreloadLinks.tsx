"use client";

import { useEffect } from 'react';

const ACTIVITY_ROUTES = [
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

export default function PreloadLinks() {
  useEffect(() => {
    // Preload all activity pages after a short delay
    const timer = setTimeout(() => {
      ACTIVITY_ROUTES.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        link.as = 'document';
        document.head.appendChild(link);
      });
      console.log('[PreloadLinks] Prefetched all activity routes');
    }, 2000); // Wait 2 seconds after page load

    return () => clearTimeout(timer);
  }, []);

  return null;
}