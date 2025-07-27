export interface Location {
  name: string;
  address: string;
  coordinates?: { lat: number; lng: number };
}

export interface FlightDetails {
  flightNumber: string;
  airline: string;
  fareClass: string;
  departure: {
    airport: string;
    terminal: string;
    time: string;
    timezone: string;
  };
  arrival: {
    airport: string;
    terminal: string;
    time: string;
    date?: string;
    timezone: string;
  };
  duration: string;
  status: string;
}

export interface Activity {
  id: string;
  time: string;
  name: string;
  type: string;
  shortDescription: string;
  fullDescription?: string;
  icon: string;
  duration?: string;
  location?: Location | string;
  image?: string;
  notes?: string;
  flightDetails?: FlightDetails;
}

export interface Day {
  date: string;
  dayNumber: number;
  dayName: string;
  activities: Activity[];
}

export interface PracticalInfo {
  hotel: {
    name: string;
    address: string;
    phone: string;
    checkIn: string;
    checkOut: string;
  };
  transportation: {
    hopOnHopOff: string;
    parking: string;
  };
  parks: {
    universal: string;
    disney: string;
    warnerBros: string;
  };
  emergency: {
    localEmergency: string;
    denmarkEmbassy: string;
    spiesSupport: {
      regular: string;
      emergency24h: string;
      note: string;
    };
  };
}

export interface TripData {
  tripName: string;
  startDate: string;
  endDate: string;
  days: Day[];
  practicalInfo: PracticalInfo;
}

export const tripData: TripData = {
  tripName: "LA Familietur 2025",
  startDate: "2025-07-28",
  endDate: "2025-08-03",
  days: [
    {
      date: "2025-07-28",
      dayNumber: 1,
      dayName: "Mandag",
      activities: [
        {
          id: "day1-1",
          time: "14:15",
          name: "Afgang fra København",
          type: "flight",
          shortDescription: "SAS SK 931 til Los Angeles",
          fullDescription: "SAS Go Smart - Direkte fly",
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
      dayName: "Tirsdag",
      activities: [
        {
          id: "day2-1",
          time: "12:00",
          name: "Hop on Hop off",
          type: "tour",
          shortDescription: "Sightseeing bustur i byen",
          icon: "🚌"
        },
        {
          id: "day2-2",
          time: "12:00",
          name: "Angels Flight Railway",
          type: "attraction",
          shortDescription: "Historisk kabelbane",
          icon: "🚡",
          location: {
            name: "Angels Flight Railway",
            address: "351 S Hill St, Los Angeles, CA 90013",
            coordinates: { lat: 34.0517, lng: -118.2500 }
          }
        },
        {
          id: "day2-3",
          time: "12:00",
          name: "Santa Monica Pier & Venice Beach",
          type: "attraction",
          shortDescription: "Stranddag med Venice-kanalerne",
          fullDescription: "Besøg den ikoniske Santa Monica Pier og Venice Beach, inklusiv Venice-kanalerne",
          icon: "🏖️",
          location: {
            name: "Santa Monica Pier",
            address: "200 Santa Monica Pier, Santa Monica, CA 90401",
            coordinates: { lat: 34.0094, lng: -118.4973 }
          }
        },
        {
          id: "day2-4",
          time: "16:00",
          name: "Shopping: The Grove",
          type: "shopping",
          shortDescription: "Udendørs shopping og spisning",
          icon: "🛍️",
          location: {
            name: "The Grove",
            address: "189 The Grove Dr, Los Angeles, CA 90036",
            coordinates: { lat: 34.0722, lng: -118.3576 }
          }
        },
        {
          id: "day2-5",
          time: "18:00",
          name: "Middag ved Farmers Market",
          type: "dining",
          shortDescription: "Historisk marked med madboder",
          icon: "🍽️",
          location: {
            name: "The Original Farmers Market",
            address: "6333 W 3rd St, Los Angeles, CA 90036",
            coordinates: { lat: 34.0719, lng: -118.3601 }
          }
        }
      ]
    },
    {
      date: "2025-07-30",
      dayNumber: 3,
      dayName: "Onsdag",
      activities: [
        {
          id: "day3-1",
          time: "09:00",
          name: "Universal Studios Hollywood",
          type: "theme-park",
          shortDescription: "Hel dag i forlystelsesparken",
          icon: "🎢",
          location: {
            name: "Universal Studios Hollywood",
            address: "100 Universal City Plaza, Universal City, CA 91608",
            coordinates: { lat: 34.1381, lng: -118.3534 }
          }
        },
        {
          id: "day3-2",
          time: "18:00",
          name: "Middag ved CityWalk",
          type: "dining",
          shortDescription: "Aftensmad ved Universal CityWalk",
          icon: "🍽️",
          location: {
            name: "Universal CityWalk Hollywood",
            address: "100 Universal City Plaza, Universal City, CA 91608",
            coordinates: { lat: 34.1366, lng: -118.3524 }
          }
        }
      ]
    },
    {
      date: "2025-07-31",
      dayNumber: 4,
      dayName: "Torsdag",
      activities: [
        {
          id: "day4-1",
          time: "10:30",
          name: "Warner Bros. Studio Tour",
          type: "tour",
          shortDescription: "Bag kulisserne studio-oplevelse",
          icon: "🎬",
          location: {
            name: "Warner Bros. Studio Tour Hollywood",
            address: "3400 W Riverside Dr, Burbank, CA 91505",
            coordinates: { lat: 34.1507, lng: -118.3381 }
          }
        },
        {
          id: "day4-2",
          time: "12:00",
          name: "Hollywood Walk of Fame",
          type: "attraction",
          shortDescription: "Se stjernerne på Hollywood Boulevard",
          icon: "⭐",
          location: {
            name: "Hollywood Walk of Fame",
            address: "Hollywood Blvd & Vine St, Hollywood, CA 90028",
            coordinates: { lat: 34.1016, lng: -118.3267 }
          }
        },
        {
          id: "day4-3",
          time: "12:00",
          name: "Melrose Avenue + Beverly Hills",
          type: "shopping",
          shortDescription: "Shopping og sightseeing",
          icon: "🛍️",
          location: {
            name: "Rodeo Drive",
            address: "Rodeo Dr, Beverly Hills, CA 90210",
            coordinates: { lat: 34.0670, lng: -118.4014 }
          }
        },
        {
          id: "day4-4",
          time: "16:00",
          name: "Griffith Observatory solnedgangstur",
          type: "attraction",
          shortDescription: "Vandresti med udsigt over byen",
          icon: "🌄",
          location: {
            name: "Griffith Observatory",
            address: "2800 E Observatory Rd, Los Angeles, CA 90027",
            coordinates: { lat: 34.1184, lng: -118.3004 }
          }
        },
        {
          id: "day4-5",
          time: "18:00",
          name: "Middag på Hard Rock",
          type: "dining",
          shortDescription: "Rock 'n' roll tema-restaurant",
          icon: "🍽️",
          location: {
            name: "Hard Rock Cafe Hollywood",
            address: "6801 Hollywood Blvd Suite 105, Hollywood, CA 90028",
            coordinates: { lat: 34.1025, lng: -118.3408 }
          }
        }
      ]
    },
    {
      date: "2025-08-01",
      dayNumber: 5,
      dayName: "Fredag",
      activities: [
        {
          id: "day5-1",
          time: "09:00",
          name: "Disneyland Park Anaheim",
          type: "theme-park",
          shortDescription: "Det originale Magic Kingdom",
          icon: "🏰",
          location: {
            name: "Disneyland Park",
            address: "1313 Disneyland Dr, Anaheim, CA 92802",
            coordinates: { lat: 33.8121, lng: -117.9190 }
          }
        },
        {
          id: "day5-2",
          time: "18:30",
          name: "Fyrværkerishow hos Disney",
          type: "entertainment",
          shortDescription: "Aftenens spektakulære show",
          icon: "🎆",
          location: {
            name: "Disneyland Park",
            address: "1313 Disneyland Dr, Anaheim, CA 92802",
            coordinates: { lat: 33.8121, lng: -117.9190 }
          }
        }
      ]
    },
    {
      date: "2025-08-02",
      dayNumber: 6,
      dayName: "Lørdag",
      activities: [
        {
          id: "day6-1",
          time: "09:00",
          name: "Disneyland California Adventure Park",
          type: "theme-park",
          shortDescription: "Anden Disney park",
          icon: "🎡",
          location: {
            name: "Disney California Adventure Park",
            address: "1313 Disneyland Dr, Anaheim, CA 92802",
            coordinates: { lat: 33.8067, lng: -117.9229 }
          }
        },
        {
          id: "day6-2",
          time: "18:00",
          name: "Afslappende middag",
          type: "dining",
          shortDescription: "Restaurant i Anaheim-området",
          icon: "🍽️",
          location: {
            name: "Downtown Disney District",
            address: "1580 Disneyland Dr, Anaheim, CA 92802",
            coordinates: { lat: 33.8092, lng: -117.9235 }
          }
        }
      ]
    },
    {
      date: "2025-08-03",
      dayNumber: 7,
      dayName: "Søndag",
      activities: [
        {
          id: "day7-1",
          time: "19:30",
          name: "Returfly til København",
          type: "flight",
          shortDescription: "SAS SK 932 til København",
          fullDescription: "SAS Go Smart - Direkte fly (ankommer næste dag)",
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
      address: "6141 Franklin Ave, Los Angeles, CA 90028, USA",
      phone: "+1 323-464-5181",
      checkIn: "15:00",
      checkOut: "11:00"
    },
    transportation: {
      hopOnHopOff: "Gældende for dag 2 - Hav billetterne klar",
      parking: "Tjek parkeringspriser ved forlystelsesparkerne på forhånd"
    },
    parks: {
      universal: "Download Universal Studios app for ventetider",
      disney: "Disney Genie+ anbefales på travle dage",
      warnerBros: "Book studieture på forhånd"
    },
    emergency: {
      localEmergency: "911",
      denmarkEmbassy: "+1 (202) 234-4300 (Washington DC)",
      spiesSupport: {
        regular: "+45 33488414 (Mon-Fri 10-15 CET)",
        emergency24h: "+46 8 593 610 17 (24/7)",
        note: "Kontakt først hotellets reception eller tjenesteudbyder. Ring til Spies hvis problemet ikke løses."
      }
    }
  }
};