# LA Trip Web Application - Project Instructions

## Project Overview
Build a mobile-first web application for managing family trip activities and information. The app will be used primarily on iPhone and must work offline. This will be a read-only application focused on displaying pre-loaded trip information.

## Technical Stack
- **Framework**: Next.js (latest stable version)
- **Styling**: Tailwind CSS with compound CSS classes
- **Deployment**: Optimized for offline capabilities using Service Workers
- **Target Device**: iPhone (mobile-first responsive design)

## Core Features

### 1. Day Navigation
- Menu system to switch between different days of the trip
- Easy navigation between consecutive days
- Clear visual indication of current selected day
- **Current day highlight**: Automatically highlight today's date when viewing

### 2. Daily Activity View
- Calendar/timeline view showing all activities for selected day
- Each activity should display:
  - Time
  - Activity name
  - Brief description
  - Location indicator
  - **Flight cards**: Special styling for flights showing duration

### 3. Activity Details Page
- Detailed view for each activity including:
  - Full description
  - Address with map link
  - Image(s) if available
  - Time and duration
  - Any special notes or requirements
  - Contact information if relevant
- **Flight Details Page** (special view for flight activities):
  - Flight number and airline
  - Departure and arrival times with terminals
  - Flight duration
  - **Live progress indicator showing**:
    - Current flight status (not started, in progress, completed)
    - Progress bar based on current time
    - Time remaining if in flight
    - Local times for both departure and arrival cities

### 4. Practical Information Section
- Dedicated menu item for essential trip information:
  - Hotel name and address
  - Emergency contacts
  - Transportation details
  - Restaurant reservations
  - Ticket confirmations
  - WiFi passwords
  - Local emergency numbers
  - Currency exchange info
  - Time zone information

## Design Requirements
- Clean, readable interface optimized for mobile viewing
- High contrast for outdoor readability
- Intuitive navigation that works with one hand
- Compound CSS classes built from Tailwind utilities
- Responsive but mobile-first approach
- **Color Palette**: Green-based theme (various shades of green for primary colors)

## Offline Capabilities
- Implement Service Worker for full offline functionality
- Cache all static assets and data
- No external API dependencies
- All trip data should be bundled with the application

## Data Structure Suggestion
```javascript
const tripData = {
  tripName: "LA Family Trip",
  startDate: "2024-XX-XX",
  endDate: "2024-XX-XX",
  days: [
    {
      date: "2024-XX-XX",
      dayNumber: 1,
      activities: [
        {
          id: "act-1",
          time: "09:00",
          duration: "2 hours",
          name: "Activity Name",
          shortDescription: "Brief description",
          fullDescription: "Detailed information...",
          location: {
            name: "Venue Name",
            address: "123 Street, LA",
            coordinates: { lat: 34.0522, lng: -118.2437 }
          },
          image: "/images/activity-1.jpg",
          notes: "Special instructions"
        }
      ]
    }
  ],
  practicalInfo: {
    hotel: {
      name: "Hotel Name",
      address: "456 Avenue, LA",
      phone: "+1-XXX-XXX-XXXX",
      checkIn: "3:00 PM",
      checkOut: "11:00 AM"
    },
    emergency: {
      localEmergency: "911",
      embassy: "+1-XXX-XXX-XXXX"
    }
  }
}
```

## Development Phases

### Phase 1: Project Setup & Basic Structure
1. Initialize Next.js project with TypeScript
2. Set up Tailwind CSS
3. Create basic routing structure
4. Implement offline capabilities with Service Worker

### Phase 2: Core Navigation
1. Build day selector/menu component
2. Create responsive navigation layout
3. Implement day switching logic

### Phase 3: Activity Views
1. Design and build daily activity timeline/calendar view
2. Create activity card components
3. Implement activity detail pages

### Phase 4: Practical Information
1. Design practical info layout
2. Add all essential trip information
3. Ensure easy access from any screen

### Phase 5: Polish & Optimization
1. Optimize for iPhone performance
2. Test offline functionality thoroughly
3. Add loading states and error handling
4. Final UI/UX refinements

## GitHub Project Management

### Initial Setup
1. Create repository with clear README
2. Set up GitHub Issues for tracking
3. Create a main tracking issue titled "LA Trip App - Master Tracking Issue"
4. Use issue labels: `feature`, `bug`, `enhancement`, `documentation`

### Issue Structure
- **Master Tracking Issue**: Links to all phase-specific issues
- **Phase Issues**: One issue per development phase
- **Feature Issues**: Specific features within each phase

### Session Protocol
After each development session:
1. Update relevant issues with progress
2. Close completed issues
3. Create new issues for discovered tasks
4. Update the master tracking issue
5. Commit with meaningful messages referencing issue numbers

## Getting Started Commands
```bash
# Create Next.js project
npx create-next-app@latest la-trip-app --typescript --tailwind --app

# Navigate to project
cd la-trip-app

# Install additional dependencies
npm install --save-dev @types/node

# Initialize git and connect to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin [your-github-repo-url]
git push -u origin main

# Start development
npm run dev
```

## Development Approach
Since this is a family-only application:
- Keep it simple and focused on core functionality
- No user authentication needed
- No analytics or tracking
- No need for complex state management
- Focus on reliable offline functionality
- Straightforward deployment (can use Vercel/Netlify free tier)

## Trip Details
- **Departure**: July 28, 2025 from Denmark
- **Return**: August 3, 2025 from Los Angeles
- **Duration**: 7 days (July 28 - August 3)
- **Design**: Green color palette
- **Scope**: Family-only application (no analytics, no completion tracking, no multi-language)

## Trip Data Structure
```javascript
const tripData = {
  tripName: "LA Family Trip 2025",
  startDate: "2025-07-28",
  endDate: "2025-08-03",
  days: [
    {
      date: "2025-07-28",
      dayNumber: 1,
      dayName: "Monday",
      activities: [
        {
          id: "day1-1",
          time: "14:15",
          name: "Departure from Copenhagen",
          type: "flight",
          shortDescription: "SAS SK 931 to Los Angeles",
          fullDescription: "SAS Go Smart - Direct flight",
          icon: "✈️",
          flightDetails: {
            flightNumber: "SK 931",
            airline: "SAS",
            fareClass: "Go Smart",
            departure: {
              airport: "Copenhagen (CPH)",
              terminal: "3",
              time: "14:15",
              timezone: "Europe/Copenhagen"
            },
            arrival: {
              airport: "Los Angeles (LAX)",
              terminal: "B",
              time: "16:20",
              timezone: "America/Los_Angeles"
            },
            duration: "11h 5m",
            status: "Confirmed"
          }
        }
      ]
    },
    {
      date: "2025-07-29",
      dayNumber: 2,
      dayName: "Tuesday",
      activities: [
        {
          id: "day2-1",
          time: "12:00",
          name: "Hop on Hop off",
          type: "tour",
          shortDescription: "City sightseeing bus tour",
          icon: "🚌"
        },
        {
          id: "day2-2",
          time: "12:00",
          name: "Angels Flight Railway",
          type: "attraction",
          shortDescription: "Historic funicular railway",
          icon: "🚡"
        },
        {
          id: "day2-3",
          time: "12:00",
          name: "Santa Monica Pier & Venice Beach",
          type: "attraction",
          shortDescription: "Beach day with Venice Canals",
          fullDescription: "Visit the iconic Santa Monica Pier and Venice Beach, including the Venice Canals",
          icon: "🏖️"
        },
        {
          id: "day2-4",
          time: "16:00",
          name: "Shopping: The Grove",
          type: "shopping",
          shortDescription: "Outdoor shopping and dining",
          icon: "🛍️"
        },
        {
          id: "day2-5",
          time: "18:00",
          name: "Dinner at Farmers Market",
          type: "dining",
          shortDescription: "Historic market with food stalls",
          icon: "🍽️"
        }
      ]
    },
    {
      date: "2025-07-30",
      dayNumber: 3,
      dayName: "Wednesday",
      activities: [
        {
          id: "day3-1",
          time: "09:00",
          name: "Universal Studios Hollywood",
          type: "theme-park",
          shortDescription: "Full day at the theme park",
          icon: "🎢"
        },
        {
          id: "day3-2",
          time: "18:00",
          name: "Dinner at CityWalk",
          type: "dining",
          shortDescription: "Evening meal at Universal CityWalk",
          icon: "🍽️"
        }
      ]
    },
    {
      date: "2025-07-31",
      dayNumber: 4,
      dayName: "Thursday",
      activities: [
        {
          id: "day4-1",
          time: "10:30",
          name: "Warner Bros. Studio Tour",
          type: "tour",
          shortDescription: "Behind-the-scenes studio experience",
          icon: "🎬"
        },
        {
          id: "day4-2",
          time: "12:00",
          name: "Hollywood Walk of Fame",
          type: "attraction",
          shortDescription: "See the stars on Hollywood Boulevard",
          location: "Rodeo Dr.",
          icon: "⭐"
        },
        {
          id: "day4-3",
          time: "12:00",
          name: "Melrose Avenue + Beverly Hills",
          type: "shopping",
          shortDescription: "Shopping and sightseeing",
          icon: "🛍️"
        },
        {
          id: "day4-4",
          time: "16:00",
          name: "Griffith Observatory Sunset Hike",
          type: "attraction",
          shortDescription: "Hiking trail with city views",
          icon: "🌄"
        },
        {
          id: "day4-5",
          time: "18:00",
          name: "Dinner at Hard Rock",
          type: "dining",
          shortDescription: "Rock 'n' roll themed restaurant",
          icon: "🍽️"
        }
      ]
    },
    {
      date: "2025-08-01",
      dayNumber: 5,
      dayName: "Friday",
      activities: [
        {
          id: "day5-1",
          time: "09:00",
          name: "Disneyland Park Anaheim",
          type: "theme-park",
          shortDescription: "The original Magic Kingdom",
          icon: "🏰"
        },
        {
          id: "day5-2",
          time: "18:30",
          name: "Fireworks Show at Disney",
          type: "entertainment",
          shortDescription: "Evening spectacular",
          icon: "🎆"
        }
      ]
    },
    {
      date: "2025-08-02",
      dayNumber: 6,
      dayName: "Saturday",
      activities: [
        {
          id: "day6-1",
          time: "09:00",
          name: "Disneyland California Adventure Park",
          type: "theme-park",
          shortDescription: "Second Disney park",
          icon: "🎡"
        },
        {
          id: "day6-2",
          time: "18:00",
          name: "Relaxing Dinner",
          type: "dining",
          shortDescription: "Anaheim area restaurant",
          location: "Anaheim area",
          icon: "🍽️"
        }
      ]
    },
    {
      date: "2025-08-03",
      dayNumber: 7,
      dayName: "Sunday",
      activities: [
        {
          id: "day7-1",
          time: "19:30",
          name: "Return Flight to Copenhagen",
          type: "flight",
          shortDescription: "SAS SK 932 to Copenhagen",
          fullDescription: "SAS Go Smart - Direct flight (arrives next day)",
          icon: "✈️",
          flightDetails: {
            flightNumber: "SK 932",
            airline: "SAS",
            fareClass: "Go Smart",
            departure: {
              airport: "Los Angeles (LAX)",
              terminal: "B",
              time: "19:30",
              timezone: "America/Los_Angeles"
            },
            arrival: {
              airport: "Copenhagen (CPH)",
              terminal: "3",
              time: "15:10",
              date: "2025-08-04",
              timezone: "Europe/Copenhagen"
            },
            duration: "10h 40m",
            status: "Confirmed"
          }
        }
      ]
    }
  ],
  practicalInfo: {
    hotel: {
      name: "The Hollywood Franklin Hotel near Universal Studios",
      address: "1830 N. Highland Ave, Hollywood, CA 90028",
      phone: "+1 (323) 874-2300",
      checkIn: "3:00 PM",
      checkOut: "11:00 AM"
    },
    transportation: {
      hopOnHopOff: "Valid for Day 2 - Keep tickets handy",
      parking: "Check theme park parking rates in advance"
    },
    parks: {
      universal: "Download Universal Studios app for wait times",
      disney: "Disney Genie+ recommended for busy days",
      warnerBros: "Book studio tour in advance"
    },
    emergency: {
      localEmergency: "911",
      denmarkEmbassy: "+1 (202) 234-4300 (Washington DC)",
      spiesSupport: {
        regular: "+45 33488414 (Mon-Fri 10-15 CET)",
        emergency24h: "+46 8 593 610 17 (24/7)",
        note: "Contact hotel reception or service provider first. If unresolved, call Spies."
      }
    }
  }
}