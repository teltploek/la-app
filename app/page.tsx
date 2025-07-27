import Link from "next/link";
import { tripData } from "./data/tripData";

export default function Home() {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-emerald-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <h1 className="text-2xl font-bold text-center font-display">{tripData.tripName}</h1>
        <p className="text-center text-sm mt-1 opacity-90">
          {new Date(tripData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(tripData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </header>
      
      <main className="p-4 max-w-4xl mx-auto pb-20">
        <div className="grid gap-4 mt-4">
          {tripData.days.map((day) => {
            const isToday = day.date === today;
            return (
              <Link
                key={day.dayNumber}
                href={`/day/${day.dayNumber}`}
                className={`block p-4 rounded-lg border-2 transition-all ${
                  isToday 
                    ? 'bg-emerald-50 border-emerald-500 shadow-md' 
                    : 'bg-white border-gray-200 hover:border-emerald-400 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 font-display">
                      Dag {day.dayNumber}: {day.dayName}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    </p>
                    {isToday && (
                      <span className="inline-block mt-2 px-2 py-1 bg-emerald-600 text-white text-xs font-medium rounded">
                        I DAG
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-3xl">{day.activities[0]?.icon || '📅'}</span>
                    <p className="text-sm text-gray-500 mt-1">
                      {day.activities.length} {day.activities.length === 1 ? 'aktivitet' : 'aktiviteter'}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-700 font-medium">
                    {day.activities[0]?.name || 'Ingen aktiviteter'}
                  </p>
                  {day.activities.length > 1 && (
                    <p className="text-xs text-gray-500 mt-1">
                      +{day.activities.length - 1} mere
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        
        <Link
          href="/practical-info"
          className="fixed bottom-4 left-4 right-4 max-w-md mx-auto block bg-emerald-700 text-white text-center py-4 px-6 rounded-lg shadow-lg hover:bg-emerald-800 transition-colors"
        >
          <span className="text-lg font-medium font-display">📋 Praktisk Information</span>
        </Link>
      </main>
    </div>
  );
}