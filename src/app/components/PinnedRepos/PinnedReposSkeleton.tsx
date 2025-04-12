import React from "react";

const PinnedReposSkeleton = () => {
  return (
    <div className="w-full px-4 sm:px-8 pb-6 animate-pulse">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-2">
        <div className="w-6 h-6 bg-blue-200 rounded-full" />
        <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-32" />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((_, index) => (
          <div
            key={index}
            className="border bg-white/80 p-3 rounded-xl shadow-sm flex items-center justify-between"
          >
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
            <div className="w-4 h-4 bg-blue-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PinnedReposSkeleton;
