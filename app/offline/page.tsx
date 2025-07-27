"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <svg
          className="w-24 h-24 mx-auto mb-6 text-emerald-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Du er offline
        </h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Denne side er ikke tilgængelig offline. Tjek din internetforbindelse og prøv igen.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition-colors font-medium"
          >
            Prøv igen
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Gå tilbage
          </button>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          Tip: Besøg alle sider mens du har internetforbindelse for at gøre dem tilgængelige offline.
        </p>
      </div>
    </div>
  );
}