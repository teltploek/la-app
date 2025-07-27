export default function IOSMetaTags() {
  return (
    <>
      {/* iOS Specific Meta Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="LA Tur" />
      
      {/* iOS Icons */}
      <link rel="apple-touch-icon" href="/api/icon?size=180" />
      <link rel="apple-touch-icon" sizes="152x152" href="/api/icon?size=152" />
      <link rel="apple-touch-icon" sizes="167x167" href="/api/icon?size=167" />
      <link rel="apple-touch-icon" sizes="180x180" href="/api/icon?size=180" />
      
      {/* iOS Splash Screens */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Prevent iOS Safari from changing phone numbers to links */}
      <meta name="format-detection" content="telephone=no" />
      
      {/* iOS Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
    </>
  );
}