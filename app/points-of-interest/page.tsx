'use client';

import Link from "next/link";
import { useState, useMemo } from "react";
import { pointsOfInterest, categoryLabels, categoryIcons, type PointOfInterest } from "@/app/data/pointsOfInterest";

export default function PointsOfInterestPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PointOfInterest['category'] | 'all'>('all');

  const filteredPOIs = useMemo(() => {
    return pointsOfInterest.filter(poi => {
      const matchesSearch = poi.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || poi.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

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
                  <p className="text-sm text-gray-600 mt-1">
                    {categoryLabels[poi.category]}
                  </p>
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
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
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