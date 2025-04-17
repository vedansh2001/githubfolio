"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, Info } from "lucide-react";
import AIAnalysisSkeleton from "./AIAnalysisSkeleton";
import { useSession } from "next-auth/react";

interface AnalysisResultProps {
  githubUsername: string;
}
interface Repo {
  repoName: string;
  primaryLanguage: string;
  analysis: string;
  codeQualityRating: number;
  securityRating: number;
  documentationRating: number;
  overallRating: number;
  bestPractices?: string[];
}
interface AnalysisResultType {
  overallEvaluation: {
    overallRating: number;
    codeQualityRating: number;
    securityRating: number;
    documentationRating: number;
    summary: string;
    strengths: string[];
    improvementAreas: string[];
  };
  repositoriesAnalysis: Repo[];
}

const AnalysisResult = ({ githubUsername }: AnalysisResultProps) => {
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [skeletonloading, setSkeletonloading] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { data: session } = useSession();
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    if (!githubUsername || !session?.user) return;
    
    // Check if the logged in user's GitHub account matches the profile being viewed
    // This assumes that user object contains a 'githubUsername' property
    // You may need to adjust this based on how your session data is structured
    if (session?.user && 'githubUsername' in session.user) {
      setIsOwnProfile(session.user.githubUsername === githubUsername);
    } else {
      // If there's no githubUsername in session, you might want to fetch it
      const fetchUserGithub = async () => {
        try {
          const response = await fetch('/api/user/github-info');
          const data = await response.json();
          if (data.githubUsername) {
            setIsOwnProfile(data.githubUsername === githubUsername);
          }
        } catch (error) {
          console.error("Error fetching user GitHub info:", error);
        }
      };
      
      fetchUserGithub();
    }
  }, [githubUsername, session]);

  useEffect(() => {
    if (!githubUsername) return;
    const fetchInitialReview = async () => {
      try {
        setSkeletonloading(true);
        setError(null);
        const response = await fetch(
          `/api/aiAnalizerData?githubUsername=${githubUsername}&ts=${Date.now()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responseData = await response.json();
        if ("aiReview" in responseData && responseData.aiReview !== null) {
          setResult(responseData.aiReview);
        } else if (responseData.message) {
          setError(responseData.message);
        } else {
          setError("Unknown error occurred.");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unexpected error occurred.");
      } finally {
        setSkeletonloading(false);
      }
    };
    fetchInitialReview();
  }, [githubUsername]);

  const initiateCodeReview = () => {
    setShowConfirmDialog(true);
  };

  const confirmCodeReview = async () => {
    setShowConfirmDialog(false);
    setSkeletonloading(true);
    
    try {
      setLoading(true);
      setShowProgressBar(true);
      setProgress(0);
      setError(null);

      // Send request to start background analysis
      fetch(
        `https://githubfolio.onrender.com/api/aiAnalizerData?githubUsername=${githubUsername}&buttonClicked=true&ts=${Date.now()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Progress bar animation for 60 seconds
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1.7; // approx 60 sec
        });
      }, 1000);

      // Wait 60 seconds then refetch analyzed data
      setTimeout(async () => {
        try {
          const fetchResponse = await fetch(
            `/api/aiAnalizerData?githubUsername=${githubUsername}&ts=${Date.now()}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await fetchResponse.json();
          if ("aiReview" in data && data.aiReview !== null) {
            setResult(data.aiReview);
            setError(null); // Clear any existing error message once results are available
          } else if (data.message) {
            setError(data.message);
          } else {
            setError("Unknown error occurred.");
          }
        } catch (fetchError) {
          console.log(fetchError);
          
          setError("Failed to fetch updated analysis.");
        } finally {
          setLoading(false);
          setShowProgressBar(false);
          setSkeletonloading(false);
        }
      }, 60000); // 60 sec
    } catch (error) {
      console.error("Error sending review request:", error);
      setLoading(false);
      setShowProgressBar(false);
      setSkeletonloading(false)
    }
  };

  const cancelCodeReview = () => {
    setShowConfirmDialog(false);
  };
  

  const RatingBadge = ({ rating }: {rating: number}) => {
    const getBadgeColor = (rating: number) => {
      if (rating >= 8) return "bg-green-100 text-green-800";
      if (rating >= 6) return "bg-blue-100 text-blue-800";
      if (rating >= 4) return "bg-yellow-100 text-yellow-800";
      return "bg-red-100 text-red-800";
    };

    return (
      <span className={`px-2 py-1 rounded-md font-medium ${getBadgeColor(rating)}`}>
        {rating}/10
      </span>
    );
  };

  const RepoCard = ({ repo }: { repo: Repo }) => {
    return (
      <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">{repo.repoName}</h3>
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {repo.primaryLanguage}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3">{repo.analysis}</p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Quality:</span>
            <RatingBadge rating={repo.codeQualityRating} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Security:</span>
            <RatingBadge rating={repo.securityRating} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Docs:</span>
            <RatingBadge rating={repo.documentationRating} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">Overall:</span>
            <RatingBadge rating={repo.overallRating} />
          </div>
        </div>

        {repo.bestPractices && repo.bestPractices.length > 0 && (
          <div className="mt-2">
            <p className="text-xs font-semibold text-gray-700">Best Practices:</p>
            <ul className="text-xs text-gray-600 list-disc pl-4">
              {repo.bestPractices.map((practice, idx) => (
                <li key={idx}>{practice}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Confirmation Dialog Component
  const ConfirmationDialog = () => {
    if (!showConfirmDialog) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
          <h3 className="text-lg font-bold mb-4">Confirm Analysis</h3>
          <p className="mb-6">
            This will analyze your GitHub repositories and may take up to a minute to complete. 
            Do you want to continue?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={cancelCodeReview}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmCodeReview}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full pt-10 px-4">
        {session?.user && isOwnProfile && (
          <div className="text-2xl font-bold flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
            <span>Get a detailed analysis of your GitHub by AI:</span>
            <button
              type="button"
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white disabled:opacity-70`}
              onClick={initiateCodeReview}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Get review"
              )}
            </button>
          </div>
        )}

        {showProgressBar && (
          <div className="max-w-2xl mx-auto w-full h-3 rounded-full bg-gray-200 overflow-hidden mb-6">
            <div
              className="h-3 bg-blue-500 transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {error && !result && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <div className="flex items-center gap-2">
              <Info size={20} />
              <p>{error}</p>
            </div>
          </div>
        )}

        {skeletonloading ? (
          <AIAnalysisSkeleton />
        ) : (
          result !== null && result !== undefined ? (
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold border-b pb-2 mb-4">AI Analysis Summary</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500">Overall Rating</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {result?.overallEvaluation?.overallRating}/10
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500">Code Quality</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {result?.overallEvaluation?.codeQualityRating}/10
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500">Security</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {result?.overallEvaluation?.securityRating}/10
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-sm text-gray-500">Documentation</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {result?.overallEvaluation?.documentationRating}/10
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <p className="text-gray-700">{result?.overallEvaluation?.summary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold mb-3 text-green-700">
                      <CheckCircle size={18} />
                      Strengths
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {result?.overallEvaluation?.strengths.map((strength, idx) => (
                        <li key={idx} className="text-gray-700">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="flex items-center gap-2 font-semibold mb-3 text-amber-700">
                      <Info size={18} />
                      Areas for Improvement
                    </h3>
                    <ul className="list-disc pl-6 space-y-1">
                      {result?.overallEvaluation?.improvementAreas.map((area, idx) => (
                        <li key={idx} className="text-gray-700">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold border-b pb-2 mb-6">Repository Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result?.repositoriesAnalysis?.map((repo, idx) => (
                    <RepoCard key={idx} repo={repo} />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold border-b pb-2 mb-4">Repository Language Distribution</h2>
                <div className="space-y-4">

                  {(() => {
                        const langCount: { [language: string]: number} = {};
                        result?.repositoriesAnalysis?.forEach((repo) => {
                          langCount[repo.primaryLanguage] = (langCount[repo.primaryLanguage] || 0) + 1;
                        });

                        const total = Object.values(langCount).reduce((a, b) => a + b, 0);
                        const sortedLangs = Object.entries(langCount).sort((a, b) => b[1] - a[1]);

                        const colorMap = {
                          JavaScript: "bg-yellow-400",
                          Python: "bg-blue-500",
                          HTML: "bg-orange-500",
                          CSS: "bg-purple-500",
                          "C++": "bg-pink-500",
                          YAML: "bg-green-500",
                          TypeScript: "bg-blue-400",
                          default: "bg-gray-400",
                        };

                      return sortedLangs.map(([lang, count], idx) => {
                                const percentage = Math.round((count / total) * 100);
                                const bgColor = (colorMap as Record<string, string>)[lang] || colorMap.default;

                          return (
                              <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{lang}</span>
                                  <span>
                                    {percentage}% ({count} repos)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className={`h-2.5 rounded-full ${bgColor}`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                          );
                      });
                  })()}
                </div>
              </div>
            </div>
          ) : !loading && (
            <div className="max-w-4xl mx-auto mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              <div className="flex items-center gap-2">
                <Info size={20} />
                <p>No analysis found. {isOwnProfile ? "Click the button above to generate a review. If it fails once, please try again" : "No analysis available for this profile."}</p>
              </div>
            </div>
          )
        )}
      </div>
      
      <ConfirmationDialog />
    </>
  );
};

export default AnalysisResult;