const SocialIconsSkeleton = () => {
    return (
      <div className="w-full mt-4 pb-6 animate-pulse">
        <div className="bg-white border p-6 rounded-2xl shadow-md max-w-xl mx-auto">
          <div className="text-xl font-semibold text-center text-gray-800 mb-4 h-6 bg-gray-300 rounded w-1/3 mx-auto" />
  
          <div className="flex justify-center gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-gray-300 shadow"
              />
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default SocialIconsSkeleton;
  