const GitHubStatsSkeleton = () => {
    return (
      <div className="flex justify-center w-full">
      <div className="mb-4 w-full max-w-md bg-white dark:bg-gray-800 border rounded-md p-4 animate-pulse">
        <div className="text-xl font-semibold text-gray-600 mb-4 w-1/2 h-6 bg-gray-300 rounded" />
        <div className="flex items-center justify-between">
          {/* Left side stats */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-40" />
            <div className="h-4 bg-gray-300 rounded w-40" />
            <div className="h-4 bg-gray-300 rounded w-40" />
            <div className="h-4 bg-gray-300 rounded w-40" />
          </div>
  
          {/* Right side circle (mock GitHub icon with ring) */}
          <div className="w-20 h-20 rounded-full border-[6px] border-blue-100 bg-gray-200 flex items-center justify-center">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
      </div>
    );
  };
  
  export default GitHubStatsSkeleton;
  