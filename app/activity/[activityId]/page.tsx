"use client";

import Link from "next/link";
import { tripData } from "@/app/data/tripData";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ActivityPage() {
  const params = useParams();
  const activityId = params.activityId as string;
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);
  
  let activity = null;
  let dayNumber = 0;
  
  for (const day of tripData.days) {
    const found = day.activities.find(a => a.id === activityId);
    if (found) {
      activity = found;
      dayNumber = day.dayNumber;
      break;
    }
  }
  
  if (!activity) {
    notFound();
  }
  
  const getFlightProgress = () => {
    if (!activity.flightDetails) return null;
    
    const departure = activity.flightDetails.departure;
    const arrival = activity.flightDetails.arrival;
    
    const depDate = tripData.days.find(d => d.dayNumber === dayNumber)?.date;
    const arrDate = arrival.date || depDate;
    
    const depTime = new Date(`${depDate}T${departure.time}:00`);
    const arrTime = new Date(`${arrDate}T${arrival.time}:00`);
    
    const now = currentTime;
    
    if (now < depTime) {
      return { status: 'not-started', progress: 0, timeRemaining: null };
    } else if (now > arrTime) {
      return { status: 'completed', progress: 100, timeRemaining: null };
    } else {
      const totalDuration = arrTime.getTime() - depTime.getTime();
      const elapsed = now.getTime() - depTime.getTime();
      const progress = (elapsed / totalDuration) * 100;
      const timeRemaining = Math.ceil((arrTime.getTime() - now.getTime()) / 60000); // minutes
      
      return { status: 'in-progress', progress, timeRemaining };
    }
  };
  
  const flightProgress = activity.type === 'flight' ? getFlightProgress() : null;
  
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-emerald-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Link href={`/day/${dayNumber}`} className="text-white hover:text-emerald-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold flex-1 text-center px-4 truncate font-display">{activity.name}</h1>
          <div className="w-6 h-6" />
        </div>
      </header>
      
      <main className="p-4 max-w-4xl mx-auto pb-20">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mt-4">
          <div className="text-center mb-6">
            <span className="text-5xl">{activity.icon}</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-display">{activity.name}</h2>
              <p className="text-gray-600 mt-2">{activity.fullDescription || activity.shortDescription}</p>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Tid</span>
                <span className="text-emerald-700 font-semibold">{activity.time}</span>
              </div>
              {activity.duration && (
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium text-gray-700">Varighed</span>
                  <span className="text-gray-600">{activity.duration}</span>
                </div>
              )}
            </div>
            
            {activity.flightDetails && (
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3 font-display">Flydetaljer</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Fly</span>
                      <span>{activity.flightDetails.airline} {activity.flightDetails.flightNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Klasse</span>
                      <span>{activity.flightDetails.fareClass}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2 font-display">Afgang</h4>
                    <p className="font-semibold">{activity.flightDetails.departure.airport}</p>
                    <p className="text-sm text-gray-600">Terminal {activity.flightDetails.departure.terminal}</p>
                    <p className="text-emerald-700 font-medium mt-1">{activity.flightDetails.departure.time}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2 font-display">Ankomst</h4>
                    <p className="font-semibold">{activity.flightDetails.arrival.airport}</p>
                    <p className="text-sm text-gray-600">Terminal {activity.flightDetails.arrival.terminal}</p>
                    <p className="text-emerald-700 font-medium mt-1">{activity.flightDetails.arrival.time}</p>
                    {activity.flightDetails.arrival.date && (
                      <p className="text-xs text-gray-500">Næste dag</p>
                    )}
                  </div>
                </div>
                
                {flightProgress && (
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3 font-display">Flystatus</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {flightProgress.status === 'not-started' && '🕐 Ikke startet'}
                          {flightProgress.status === 'in-progress' && '✈️ I luften'}
                          {flightProgress.status === 'completed' && '✅ Færdig'}
                        </span>
                        {flightProgress.timeRemaining && (
                          <span className="text-sm text-gray-600">
                            {Math.floor(flightProgress.timeRemaining / 60)}t {flightProgress.timeRemaining % 60}m tilbage
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-emerald-600 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${flightProgress.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {typeof activity.location === 'string' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Lokation</span>
                  <span className="text-gray-600">{activity.location}</span>
                </div>
              </div>
            )}
            
            {typeof activity.location === 'object' && activity.location && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2 font-display">Lokation</h3>
                <p className="font-semibold">{activity.location.name}</p>
                <p className="text-sm text-gray-600 mt-1">{activity.location.address}</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location.address)}`}
                  className="inline-block mt-3 text-emerald-700 font-medium text-sm hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📍 Åbn i Google Maps
                </a>
              </div>
            )}
            
            {activity.notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2 font-display">Noter</h3>
                <p className="text-sm text-gray-600">{activity.notes}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}