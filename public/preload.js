// Preload script to ensure all resources are cached
// This can be run in the browser console to force cache all assets

async function preloadAllAssets() {
  console.log('Starting preload of all assets...');
  
  // Routes to preload
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
  
  // Preload all routes
  for (const route of routes) {
    try {
      const response = await fetch(route);
      if (response.ok) {
        console.log(`✓ Preloaded: ${route}`);
      } else {
        console.error(`✗ Failed to preload: ${route} (${response.status})`);
      }
    } catch (error) {
      console.error(`✗ Failed to preload: ${route}`, error);
    }
  }
  
  // Also fetch the icons
  try {
    await fetch('/api/icon?size=96');
    await fetch('/api/icon?size=192');
    await fetch('/api/icon?size=512');
    console.log('✓ Preloaded: Icons');
  } catch (error) {
    console.error('✗ Failed to preload icons', error);
  }
  
  console.log('Preload complete! The app should now work offline.');
}

// Run the preload
preloadAllAssets();