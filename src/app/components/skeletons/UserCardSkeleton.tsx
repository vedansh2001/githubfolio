import React from "react";

const UserCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-md border border-gray-300 dark:border-gray-700 p-6 mb-4 w-full animate-pulse">
      <div className="flex flex-col sm:flex-row gap-6 mb-4">
        {/* Avatar */}
        <div className="flex items-center justify-center sm:w-1/3">
          <div className="rounded-full bg-gray-300 w-[110px] h-[110px]" />
        </div>

        {/* Details */}
        <div className="sm:w-2/3 space-y-3">
          <div className="h-6 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-300 rounded w-1/3" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
          <div className="h-4 bg-gray-300 rounded w-2/3" />
          <div className="h-4 bg-gray-300 rounded w-1/3" />
        </div>
      </div>

      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-5/6 mt-2" />
      <div className="h-4 bg-gray-300 rounded w-4/6 mt-2" />
    </div>
  );
};

export default UserCardSkeleton;
