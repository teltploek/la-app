# Testing Offline Functionality

## How to Test the Offline Experience

### 1. Build and Run Production Version
```bash
npm run build
npm run start
```

### 2. Open the App
- Navigate to http://localhost:3000
- Open Chrome DevTools (F12)
- Check the Console for "Service Worker: Pre-caching complete"
- **All pages are now automatically cached during installation!**

### 3. Install the App (PWA)
- On desktop: Look for the install icon in the address bar
- On iPhone: 
  - Open in Safari
  - Tap the Share button
  - Select "Add to Home Screen"

### 4. Wait for Pre-caching to Complete
- The service worker automatically pre-caches all pages and assets
- Check DevTools > Application > Cache Storage to see cached items
- No need to visit each page first!

### 5. Test Offline Mode
- In DevTools: Go to Network tab → Set to "Offline"
- OR on iPhone: Enable Airplane Mode
- Try navigating through the app

### 6. What Should Work Offline
✅ All 7 day pages (/day/1 through /day/7)
✅ All activity detail pages
✅ Practical information page
✅ Points of interest page
✅ Navigation between pages
✅ All fonts and styling
✅ App icons

### 7. Service Worker Features
- **Automatic caching**: All visited pages are cached
- **Update notifications**: Users see a prompt when new version is available
- **Offline fallback**: Custom offline page when accessing uncached content
- **Smart caching**: Static assets cached separately from dynamic content

### 8. Debugging Tips
- Check Application tab in DevTools:
  - Service Workers section
  - Cache Storage section
- Console logs show caching activity
- Clear cache: Application → Storage → Clear site data

### 9. Known Limitations
- External maps links require internet
- First visit requires internet to cache content
- Updates require brief internet connection

### 10. iPhone-Specific Testing
1. Add to Home Screen first
2. Open from home screen icon (not Safari)
3. Navigate all pages while online
4. Enable Airplane Mode
5. Test navigation and functionality