import Link from "next/link";
import { tripData } from "@/app/data/tripData";

export default function PracticalInfoPage() {
  const info = tripData.practicalInfo;
  
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-emerald-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Link href="/" className="text-white hover:text-emerald-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold flex-1 text-center font-display">Praktisk Information</h1>
          <div className="w-6 h-6" />
        </div>
      </header>
      
      <main className="p-4 max-w-4xl mx-auto pb-20">
        <div className="space-y-6 mt-4">
          <section className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center font-display">
              <span className="mr-2">🏨</span> Hotelinformation
            </h2>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">{info.hotel.name}</p>
              <p className="text-sm">{info.hotel.address}</p>
              <a href={`tel:${info.hotel.phone}`} className="text-emerald-700 hover:underline text-sm">
                {info.hotel.phone}
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.hotel.address)}`}
                className="inline-block text-emerald-700 font-medium text-sm hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                📍 Åbn i Google Maps
              </a>
              <div className="grid grid-cols-2 gap-4 mt-4 bg-emerald-50 rounded p-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Indtjekning</p>
                  <p className="font-semibold">{info.hotel.checkIn}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Udtjekning</p>
                  <p className="font-semibold">{info.hotel.checkOut}</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center font-display">
              <span className="mr-2">🚆</span> Transport
            </h2>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded p-3">
                <p className="font-medium text-gray-700">Hop on Hop off Bus</p>
                <p className="text-sm text-gray-600 mt-1">{info.transportation.hopOnHopOff}</p>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <p className="font-medium text-gray-700">Parkering</p>
                <p className="text-sm text-gray-600 mt-1">{info.transportation.parking}</p>
              </div>
            </div>
          </section>
          
          <section className="bg-white border-2 border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center font-display">
              <span className="mr-2">🎢</span> Forlystelsespark-tips
            </h2>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded p-3">
                <p className="font-medium text-gray-700">Universal Studios</p>
                <p className="text-sm text-gray-600 mt-1">{info.parks.universal}</p>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <p className="font-medium text-gray-700">Disney parker</p>
                <p className="text-sm text-gray-600 mt-1">{info.parks.disney}</p>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <p className="font-medium text-gray-700">Warner Bros.</p>
                <p className="text-sm text-gray-600 mt-1">{info.parks.warnerBros}</p>
              </div>
            </div>
          </section>
          
          <section className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center font-display">
              <span className="mr-2">🚨</span> Nødkontakter
            </h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-700">Lokal nødhjælp</p>
                <a href={`tel:${info.emergency.localEmergency}`} className="text-2xl font-bold text-red-600 hover:underline">
                  {info.emergency.localEmergency}
                </a>
              </div>
              <div>
                <p className="font-medium text-gray-700">Dansk ambassade (Washington DC)</p>
                <a href={`tel:${info.emergency.denmarkEmbassy}`} className="text-emerald-700 hover:underline">
                  {info.emergency.denmarkEmbassy}
                </a>
              </div>
              <div className="bg-white rounded p-4">
                <p className="font-medium text-gray-700 mb-2">Spies rejsesupport</p>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Almindelig åbningstid (man-fre 10-15 CET)</p>
                    <a href={`tel:${info.emergency.spiesSupport.regular}`} className="text-emerald-700 hover:underline">
                      {info.emergency.spiesSupport.regular}
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-600">24/7 Nødhjælp</p>
                    <a href={`tel:${info.emergency.spiesSupport.emergency24h}`} className="text-emerald-700 hover:underline">
                      {info.emergency.spiesSupport.emergency24h}
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">{info.emergency.spiesSupport.note}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}