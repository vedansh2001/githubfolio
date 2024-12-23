import React, { useState } from 'react'

const SelectedRepositories = ({selectedRepos, setSelectedRepos, setAddedRepos, addedRepos}) => {
  const [loadingRepoId, setLoadingRepoId] = useState(null);    

  const handleRemoveRepo = (id) => {
    // Remove repo from selected and added lists
    // setSelectedRepos(selectedRepos.filter((repo) => repo !== nameofrepo));
    // setAddedRepos(addedRepos.filter((repo) => repo !== nameofrepo));
    setLoadingRepoId(id);

    const fetchdata = async (id) => {        
      try {
        const url = `/api/removerepository?Id=${encodeURIComponent(id)}`;
        const res = await fetch(url, {
          method: 'PUT', // Specify the method
      });
        const data = await res.json();
        console.log(data.selectedRepos);
        setSelectedRepos(data.selectedRepos)
        setAddedRepos(data.selectedRepos)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchdata(id)
  };


  return (
      <div className="min-h-[500px] w-[40%] mb-[10%] bg-gray-300 border-2 p-1 border-black rounded-sm overflow-auto">
        <h1 className="font-semibold py-3 text-2xl flex justify-center">
          SELECTED REPOSITORIES
        </h1>

        {selectedRepos.map((repo, index) => (
          <div
            className="bg-gray-400 px-2 py-1 flex justify-between mb-1 border-2 border-black rounded-sm"
            key={index}
          >
            {repo.name}

            <button
            className={`bg-red-500 border-[1px] border-black rounded-sm px-2 py-[1px] flex items-center justify-center ${
              loadingRepoId === repo.id ? "bg-gray-500 cursor-not-allowed" : ""
            }`}
            onClick={() => handleRemoveRepo(repo.id)}
            disabled={loadingRepoId === repo.id}
          >
            {loadingRepoId === repo.id ? (
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
            ) : (
              "Delete"
            )}
          </button>
          </div>
        ))}
    </div>
  )
}

export default SelectedRepositories
