import React from "react";

interface Repository {
  id: number;
  name: string;
}

interface RepositoryListProps {
  repos: Repository[];
  addedRepos: Repository[];
  loadingRepoId: number | null;
  handleSelectRepo: (id: number) => void;
}

const SelectRepositories: React.FC<RepositoryListProps> = ({
  repos,
  addedRepos,
  loadingRepoId,
  handleSelectRepo,
}) => {
  return (
    <div className="min-h-[500px] w-[40%] mb-[10%] bg-gray-300 shadow-lg border border-black p-5 rounded-lg overflow-auto">
      {/* Title */}
      <h1 className="font-bold py-3 text-2xl text-center text-gray-800 border-b border-gray-300">
        Select Repositories
      </h1>

      {/* Repositories List */}
      <div className="space-y-2 mt-3">
        {repos.map(({ id, name }) => {
          const isAdded = addedRepos.some((repo) => repo.name === name);

          return (
            <div
              key={id}
              className="bg-gray-400 px-4 py-2 flex justify-between items-center border-1 border-gray-300 rounded-md shadow-sm transition-transform hover:scale-[1.02]"
            >
              {/* Repository Name */}
              <span className="font-medium text-gray-800 truncate">{name}</span>

              {/* Add/Added Button */}
              <button
                className={`px-3 py-1 text-sm font-semibold rounded-md flex items-center text-white bg-gradient-to-r border border-black shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out
                  ${
                    isAdded
                      ? "from-gray-500 to-gray-600 cursor-not-allowed"
                      : "from-green-500 to-green-600 hover:bg-green-600"
                  }`}
                onClick={() => handleSelectRepo(id)}
                disabled={loadingRepoId === id || isAdded}
              >
                {loadingRepoId === id ? (
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : isAdded ? (
                  "Added"
                ) : (
                  "Add +"
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectRepositories;
