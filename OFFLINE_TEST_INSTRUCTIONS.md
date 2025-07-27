# iOS PWA Offline Testing Instructions

## Setup Steps

1. **Deploy or Run Locally**
   - Run `npm run build && npm start` to test locally
   - Or deploy to your hosting service

2. **Install as PWA on iOS**
   - Open the app in Safari on your iPhone
   - Wait for the install prompt or tap the Share button
   - Select "Add to Home Screen"
   - Name it and tap "Add"

3. **Initial Cache Population**
   - Open the PWA from your home screen
   - Navigate through ALL pages at least once:
     - Each day (Day 1-7)
     - Each activity
     - Practical Info
     - Points of Interest
   - Wait for "Service Worker: All assets cached" in console

4. **Test Offline Mode**
   - Enable Airplane Mode on your iPhone
   - Force quit the app (swipe up and remove)
   - Open the app again from home screen
   - Navigate through all pages - they should load instantly

## What's Been Fixed

1. **iOS-Specific Service Worker**
   - Cache-first strategy for reliability
   - All routes cached during install
   - Proper request headers for iOS

2. **PWA Configuration**
   - iOS meta tags added
   - Apple touch icons configured
   - Standalone mode detection

3. **Install Prompt**
   - Shows instructions for iOS users
   - Dismissible prompt
   - Only shows in Safari, not in PWA

4. **Service Worker Registration**
   - Waits for page load
   - Handles first install properly
   - Reloads once after first install in PWA mode

## Troubleshooting

- If pages don't load offline, check Safari Developer Console for errors
- Ensure all pages were visited while online first
- Try uninstalling and reinstalling the PWA
- Check that service worker is registered: Settings > Safari > Advanced > Website Data