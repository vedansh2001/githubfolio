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
    <div className="w-full lg:w-[45%] bg-white shadow-md border border-gray-300 rounded-xl p-6 overflow-auto max-h-[80vh]">
      <h1 className="text-2xl font-bold text-blue-800 text-center border-b pb-2">Select Repositories</h1>
      <p className="text-sm text-blue-500 text-center mt-1">
        Only your selected repositories will be visible visitors.
      </p>
      <div className="space-y-3 mt-4">
        {repos.map(({ id, name }) => {
          const isAdded = addedRepos.some((repo) => repo.name === name);
          return (
            <div
              key={id}
              className="bg-blue-50 px-4 py-2 flex justify-between items-center rounded-md border border-blue-200 hover:scale-[1.01] transition-transform"
            >
              <span className="text-blue-900 font-medium truncate">{name}</span>
              <button
                className={`px-4 py-1 rounded-md text-sm font-semibold border shadow-sm transition-all duration-300 ease-in-out ${
                  isAdded
                    ? "bg-blue-100 cursor-not-allowed text-white border-blue-400"
                    : "bg-blue-200 hover:bg-blue-300 text-white border-blue-600"
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
                ) : isAdded ? "Added" : "Add +"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectRepositories;
