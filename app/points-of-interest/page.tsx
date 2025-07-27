'use client';

import Link from "next/link";
import { useState, useMemo } from "react";
import { pointsOfInterest, categoryLabels, categoryIcons, type PointOfInterest } from "@/app/data/pointsOfInterest";

// Hollywood Franklin Hotel coordinates
const HOTEL_COORDS = { lat: 34.1053561, lng: -118.3239266 };

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function PointsOfInterestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PointOfInterest['category'] | 'all'>('all');

  const poisWithDistance = useMemo(() => {
    return pointsOfInterest.map(poi => ({
      ...poi,
      distance: calculateDistance(HOTEL_COORDS.lat, HOTEL_COORDS.lng, poi.coordinates.lat, poi.coordinates.lng)
    })).sort((a, b) => a.distance - b.distance);
  }, []);

  const filteredPOIs = useMemo(() => {
    return poisWithDistance.filter(poi => {
      const matchesSearch = poi.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || poi.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, poisWithDistance]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(pointsOfInterest.map(poi => poi.category)));
    return uniqueCategories.sort();
  }, []);

  const openInGoogleMaps = (poi: PointOfInterest) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${poi.coordinates.lat},${poi.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-emerald-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Link href="/" className="text-white hover:text-emerald-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-xl font-bold font-display">Interessante Steder</h1>
            <p className="text-sm opacity-90">{filteredPOIs.length} steder</p>
          </div>
          <div className="w-6 h-6" />
        </div>
      </header>
      
      <main className="p-4 max-w-4xl mx-auto pb-20">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Søg efter steder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Category Filters */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alle
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{categoryIcons[category]}</span>
                <span>{categoryLabels[category]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* POI List */}
        <div className="space-y-3">
          {filteredPOIs.map(poi => (
            <div
              key={poi.id}
              className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-emerald-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">
                  {categoryIcons[poi.category]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 font-display">
                    {poi.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-600">
                      {categoryLabels[poi.category]}
                    </p>
                    {poi.id !== 'poi-1' && (
                      <>
                        <span className="text-gray-400">•</span>
                        <p className="text-sm text-gray-500">
                          {poi.distance < 1 
                            ? `${Math.round(poi.distance * 1000)} m fra hotellet`
                            : `${poi.distance.toFixed(1)} km fra hotellet`
                          }
                        </p>
                      </>
                    )}
                  </div>
                  {poi.description && (
                    <p className="text-sm text-gray-500 mt-2">
                      {poi.description}
                    </p>
                  )}
                </div>
                <div className="flex items-stretch gap-1">
                  {poi.website && (
                    <a
                      href={poi.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-2 text-emerald-600 hover:bg-emerald-50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </a>
                  )}
                  {poi.instagram && (
                    <a
                      href={`https://www.instagram.com/${poi.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-2 text-emerald-600 hover:bg-emerald-50 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                  )}
                  <button
                    onClick={() => openInGoogleMaps(poi)}
                    className="flex items-center px-2 text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPOIs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Ingen steder fundet</p>
          </div>
        )}
      </main>
    </div>
  );
}