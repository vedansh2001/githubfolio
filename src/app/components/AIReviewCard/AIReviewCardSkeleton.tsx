export default function AIReviewCardSkeleton() {
    return (
      <div className="w-full rounded-2xl border bg-white dark:bg-gray-950 p-5 shadow-sm animate-pulse">
        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border rounded-xl px-4 py-2 bg-gray-100 dark:bg-gray-900"
            >
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-4 w-10 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
  
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
  
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    );
  }
  