# LA Familietur 2025

En mobil-først webapplikation til at administrere familieturens aktiviteter og information for LA ferien (28. juli - 3. august 2025).

## Features

- **Day Navigation**: Easy switching between trip days with current day highlighting
- **Activity Timeline**: View all activities for each day with time, descriptions, and icons
- **Activity Details**: Detailed information for each activity including locations and special notes
- **Flight Tracking**: Live progress indicators for flights showing current status
- **Practical Information**: Quick access to hotel details, emergency contacts, and trip tips
- **Offline Support**: Full offline functionality using Service Workers
- **Mobile Optimized**: Designed specifically for iPhone usage

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies

- Next.js 15.4
- TypeScript
- Tailwind CSS
- Service Workers for offline capability
- PWA support

## Structure

- `/app` - Main application code
  - `/data` - Trip data and types
  - `/day/[dayNumber]` - Day detail pages
  - `/activity/[activityId]` - Activity detail pages
  - `/practical-info` - Practical information page
  - `/components` - Reusable components

## Key Features

### Offline Capability
The app uses Service Workers to cache all pages and assets, allowing full functionality without internet connection.

### Mobile-First Design
- Optimized for one-handed navigation
- High contrast for outdoor readability
- Touch-friendly interface elements
- Green-based color theme

### Trip Information
- 7-day itinerary (July 28 - August 3, 2025)
- Flight details with live tracking
- Theme park visits (Universal Studios, Disneyland, Warner Bros)
- Restaurant and shopping activities
- Emergency contacts and practical tips

## Hotel Information

**The Hollywood Franklin Hotel near Universal Studios**
- Address: 6141 Franklin Ave, Los Angeles, CA 90028, USA
- Phone: +1 323-464-5181
- Check-in: 3:00 PM
- Check-out: 11:00 AM

## Deployment

The app can be deployed to any static hosting service that supports Next.js (Vercel, Netlify, etc.).