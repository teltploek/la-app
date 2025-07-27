export interface PointOfInterest {
  id: string;
  name: string;
  description?: string;
  category: 'hotel' | 'lufthavn' | 'forlystelsespark' | 'seværdighed' | 'shopping' | 'restaurant' | 'cafe' | 'donut' | 'is' | 'transport';
  coordinates: {
    lat: number;
    lng: number;
  };
  website?: string;
  instagram?: string;
}

export const pointsOfInterest: PointOfInterest[] = [
  // Overnatning & Transport
  {
    id: 'poi-1',
    name: 'The Hollywood Franklin Hotel near Universal Studios',
    category: 'hotel',
    coordinates: { lat: 34.1053561, lng: -118.3239266 }
  },
  {
    id: 'poi-2',
    name: 'Los Angeles International Airport',
    category: 'lufthavn',
    coordinates: { lat: 33.942153, lng: -118.4036052 },
    website: 'https://www.flylax.com',
    instagram: 'flylaxairport'
  },
  {
    id: 'poi-23',
    name: 'Hollywood/Vine Metro Station',
    category: 'transport',
    coordinates: { lat: 34.101444, lng: -118.325472 },
    website: 'https://www.metro.net'
  },
  
  // Forlystelsesparker
  {
    id: 'poi-3',
    name: 'Universal Studios Hollywood',
    category: 'forlystelsespark',
    coordinates: { lat: 34.1370713, lng: -118.3533061 },
    website: 'https://www.universalstudioshollywood.com',
    instagram: 'unistudioshollywood'
  },
  {
    id: 'poi-4',
    name: 'Disneyland Park Californien',
    category: 'forlystelsespark',
    coordinates: { lat: 33.8120918, lng: -117.9189742 },
    website: 'https://disneyland.disney.go.com',
    instagram: 'disneyland'
  },
  
  // Seværdigheder
  {
    id: 'poi-5',
    name: 'Warner Bros.-studierne',
    category: 'seværdighed',
    coordinates: { lat: 34.1485458, lng: -118.3359672 },
    website: 'https://www.wbstudiotour.com'
  },
  {
    id: 'poi-6',
    name: 'Santa Monica Pier',
    category: 'seværdighed',
    coordinates: { lat: 34.0082821, lng: -118.4987585 },
    website: 'https://www.santamonicapier.org',
    instagram: 'santamonicapier'
  },
  {
    id: 'poi-7',
    name: 'Hollywood Walk of Fame',
    category: 'seværdighed',
    coordinates: { lat: 34.1016059, lng: -118.3295694 },
    website: 'https://walkoffame.com'
  },
  {
    id: 'poi-8',
    name: 'Griffith Observatory',
    category: 'seværdighed',
    coordinates: { lat: 34.1184341, lng: -118.3003935 },
    website: 'https://griffithobservatory.org',
    instagram: 'griffithobservatory'
  },
  {
    id: 'poi-9',
    name: 'Beverly Hills',
    category: 'seværdighed',
    coordinates: { lat: 34.0730715, lng: -118.4016265 },
    website: 'https://www.beverlyhills.org'
  },
  {
    id: 'poi-10',
    name: 'Angels Flight Railway',
    category: 'seværdighed',
    coordinates: { lat: 34.05161739999999, lng: -118.2506142 },
    website: 'https://angelsflight.org'
  },
  
  // Shopping
  {
    id: 'poi-11',
    name: 'Rodeo Drive',
    category: 'shopping',
    coordinates: { lat: 34.0703368, lng: -118.4041526 },
    website: 'https://www.rodeodrive-bh.com'
  },
  {
    id: 'poi-12',
    name: 'The Grove',
    category: 'shopping',
    coordinates: { lat: 34.0719407, lng: -118.3575164 },
    website: 'https://thegrovela.com',
    instagram: 'thegrovela'
  },
  {
    id: 'poi-13',
    name: 'Farmers Market Place',
    category: 'shopping',
    coordinates: { lat: 34.0729878, lng: -118.3599175 },
    website: 'https://www.farmersmarketla.com',
    instagram: 'farmersmarketla'
  },
  
  // Donuts & Bageri
  {
    id: 'poi-14',
    name: "Dad's Donuts & Bakery",
    category: 'donut',
    coordinates: { lat: 34.1848861, lng: -118.338886 }
  },
  {
    id: 'poi-15',
    name: 'The Donut Man',
    category: 'donut',
    coordinates: { lat: 34.0505267, lng: -118.2487006 },
    website: 'https://thedonutmanca.com'
  },
  
  // Kaffe
  {
    id: 'poi-16',
    name: 'Kreation Juicery & Avoholic Bar - Melrose Place',
    category: 'cafe',
    coordinates: { lat: 34.0839483, lng: -118.3754843 },
    website: 'https://kreationjuice.com',
    instagram: 'kreationjuice'
  },
  {
    id: 'poi-17',
    name: 'Alfred Coffee',
    category: 'cafe',
    coordinates: { lat: 34.0728575, lng: -118.3835065 },
    website: 'https://alfred.la',
    instagram: 'alfred'
  },
  {
    id: 'poi-18',
    name: 'Alfred Coffee, Melrose Pl.',
    category: 'cafe',
    coordinates: { lat: 34.08337, lng: -118.374326 },
    website: 'https://alfred.la',
    instagram: 'alfred'
  },
  {
    id: 'poi-19',
    name: 'Verve Coffee Roasters',
    category: 'cafe',
    coordinates: { lat: 34.07235809999999, lng: -118.3649846 },
    website: 'https://vervecoffee.com',
    instagram: 'vervecoffee'
  },
  
  // Restauranter
  {
    id: 'poi-20',
    name: 'In-N-Out Burger',
    category: 'restaurant',
    coordinates: { lat: 34.09822870000001, lng: -118.3416747 },
    website: 'https://www.in-n-out.com',
    instagram: 'innout'
  },
  {
    id: 'poi-21',
    name: 'Guisados',
    category: 'restaurant',
    coordinates: { lat: 34.0843958, lng: -118.385235 },
    website: 'https://www.guisados.co',
    instagram: 'guisados'
  },
  {
    id: 'poi-24',
    name: 'Hard Rock Cafe Hollywood',
    category: 'restaurant',
    coordinates: { lat: 34.1017382, lng: -118.3385285 },
    website: 'https://www.hardrockcafe.com/location/hollywood/',
    instagram: 'hardrockholly'
  },
  {
    id: 'poi-25',
    name: "Langer's Delicatessen",
    category: 'restaurant',
    coordinates: { lat: 34.0600653, lng: -118.2763476 },
    website: 'https://www.langersdeli.com'
  },
  {
    id: 'poi-26',
    name: 'Cousins Maine Lobster Los Angeles (Food Truck)',
    category: 'restaurant',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    website: 'https://www.cousinsmainelobster.com',
    instagram: 'cousinsmainelobster'
  },
  {
    id: 'poi-22',
    name: 'Salt & Straw',
    category: 'is',
    coordinates: { lat: 34.0841673, lng: -118.3855776 },
    website: 'https://saltandstraw.com',
    instagram: 'saltandstraw'
  }
];

export const categoryLabels: Record<PointOfInterest['category'], string> = {
  hotel: 'Hotel',
  lufthavn: 'Lufthavn',
  forlystelsespark: 'Forlystelsespark',
  seværdighed: 'Seværdighed',
  shopping: 'Shopping',
  restaurant: 'Restaurant',
  cafe: 'Kaffe',
  donut: 'Donut & Bageri',
  is: 'Is',
  transport: 'Transport'
};

export const categoryIcons: Record<PointOfInterest['category'], string> = {
  hotel: '🏨',
  lufthavn: '✈️',
  forlystelsespark: '🎢',
  seværdighed: '📍',
  shopping: '🛍️',
  restaurant: '🌮',
  cafe: '☕',
  donut: '🍩',
  is: '🍦',
  transport: '🚇'
};