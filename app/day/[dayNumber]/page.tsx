import Link from "next/link";
import { tripData } from "@/app/data/tripData";
import { notFound } from "next/navigation";

// Generate static params for all days
export async function generateStaticParams() {
  return tripData.days.map((day) => ({
    dayNumber: day.dayNumber.toString(),
  }));
}

export default async function DayPage({ params }: { params: Promise<{ dayNumber: string }> }) {
  const { dayNumber: dayNumberStr } = await params;
  const dayNumber = parseInt(dayNumberStr);
  const day = tripData.days.find(d => d.dayNumber === dayNumber);
  
  if (!day) {
    notFound();
  }
  
  const prevDay = dayNumber > 1 ? dayNumber - 1 : null;
  const nextDay = dayNumber < tripData.days.length ? dayNumber + 1 : null;
  
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
            <h1 className="text-xl font-bold font-display">Dag {day.dayNumber}: {day.dayName}</h1>
            <p className="text-sm opacity-90">
              {new Date(day.date).toLocaleDateString('da-DK', { month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="w-6 h-6" />
        </div>
      </header>
      
      <main className="p-4 max-w-4xl mx-auto pb-20">
        <div className="space-y-4 mt-4">
          {day.activities.map((activity) => (
            <Link
              key={activity.id}
              href={`/activity/${activity.id}`}
              className="block bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-emerald-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0">{activity.icon}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 font-display">{activity.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{activity.shortDescription}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-medium text-emerald-700">{activity.time}</p>
                      {activity.duration && (
                        <p className="text-xs text-gray-500">{activity.duration}</p>
                      )}
                    </div>
                  </div>
                  {activity.type === 'flight' && activity.flightDetails && (
                    <div className="mt-2 bg-emerald-50 rounded p-2">
                      <p className="text-sm font-medium text-emerald-800">
                        ✈️ {activity.flightDetails.flightNumber} • {activity.flightDetails.duration}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto flex gap-2">
          {prevDay && (
            <Link
              href={`/day/${prevDay}`}
              className="flex-1 bg-gray-100 text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Dag {prevDay}
            </Link>
          )}
          {nextDay && (
            <Link
              href={`/day/${nextDay}`}
              className="flex-1 bg-emerald-700 text-white text-center py-3 px-4 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              Dag {nextDay} →
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}