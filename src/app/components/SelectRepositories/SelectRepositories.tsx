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

const RepositoryList: React.FC<RepositoryListProps> = ({
  repos,
  addedRepos,
  loadingRepoId,
  handleSelectRepo,
}) => {
  return (
    <div className="min-h-[500px] w-[40%] mb-[10%] bg-gray-300 border-2 p-1 border-black rounded-sm overflow-auto">
      <h1 className="font-semibold py-3 text-2xl flex justify-center">
        SELECT REPOSITORIES
      </h1>

      {repos.map(({ id, name }) => (
        <div
          className="bg-gray-400 px-2 py-1 flex justify-between mb-1 border-2 border-black rounded-sm"
          key={id}
        >
          {name}
          <button
            className={`bg-green-500 border-[1px] border-black rounded-sm px-2 py-[1px] flex items-center justify-center 
              ${addedRepos.some((repo) => repo.name === name) ? "bg-slate-500" : ""}`}
            onClick={() => handleSelectRepo(id)}
            disabled={loadingRepoId === id || addedRepos.some((repo) => repo.name === name)}
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
            ) : addedRepos.some((repo) => repo.name === name) ? (
              "Added"
            ) : (
              "Add +"
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default RepositoryList;
