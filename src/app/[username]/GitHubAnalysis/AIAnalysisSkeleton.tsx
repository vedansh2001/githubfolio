// components/AIAnalysisSkeleton.jsx
import React from "react";

const AIAnalysisSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-bold border-b pb-2 mb-4 text-gray-200 animate-pulse">AI Analysis Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-200">Loading...</div>
              <div className="h-12 bg-gray-200 animate-pulse rounded mt-1"></div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2 text-gray-200">Summary</h3>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 animate-pulse rounded w-full"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-5/6"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-4/6"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-3/6"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 text-gray-200 pl-6 ">Strengths</h3>
            <ul className="space-y-2 pl-6">
              {[...Array(3)].map((_, idx) => (
                <li key={idx} className="h-6 bg-gray-200 animate-pulse rounded w-5/6"></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-gray-200 pl-6">Areas for Improvement</h3>
            <ul className="space-y-2 pl-6">
              {[...Array(3)].map((_, idx) => (
                <li key={idx} className="h-6 bg-gray-200 animate-pulse rounded w-5/6"></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold border-b pt-6 pb-2 mb-4 text-gray-200 animate-pulse">Ripository Analysis</h2>
    </div>
  );
};

export default AIAnalysisSkeleton;