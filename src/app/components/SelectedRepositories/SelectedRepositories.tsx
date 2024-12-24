import React, { useState } from "react";
import { RxDrawingPin, RxDrawingPinFilled } from "react-icons/rx";

// Define the type for a Repository
interface Repository {
  id: number;
  name: string;
  isPinned: Boolean;
}

interface SelectedRepositoriesProps {
  selectedRepos: Repository[];
  setSelectedRepos: React.Dispatch<React.SetStateAction<Repository[]>>;
  setAddedRepos: React.Dispatch<React.SetStateAction<Repository[]>>;
}

const SelectedRepositories: React.FC<SelectedRepositoriesProps> = ({
  selectedRepos,
  setSelectedRepos,
  setAddedRepos,
}) => {
  const [loadingRepoId, setLoadingRepoId] = useState<number | null>(null); // For deleting
  const [pinLoadingRepoId, setPinLoadingRepoId] = useState<number | null>(null); // For pinning/unpinning

  const handleRemoveRepo = (id: number) => {
    setLoadingRepoId(id);

    const fetchdata = async (id: number) => {
      try {
        //if we remove a repo from selected repo then it should by default be unpinned also 
        await fetch(`/api/ispinned?Id=${id}&action=unpin`, {
          method: "PUT",
        });


        const url = `/api/removerepository?Id=${encodeURIComponent(id)}`;
        const res = await fetch(url, { method: "PUT" });

        if (!res.ok) {
          throw new Error("Failed to remove repository");
        }

        const data = await res.json();
        setSelectedRepos(data.selectedRepos);
        setAddedRepos(data.selectedRepos);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingRepoId(null); // Clear loading state
      }
    };

    fetchdata(id);
  };

  const togglePin = async (id: number, isPinned: boolean) => {
    setPinLoadingRepoId(id);

    const action = isPinned ? "unpin" : "pin";

    try {
      const response = await fetch(`/api/ispinned?Id=${id}&action=${action}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} repository`);
      }

      const data = await response.json();

      // Optimistically update the UI
      setSelectedRepos((prevRepos) =>
        prevRepos.map((repo) =>
          repo.id === id ? { ...repo, isPinned: !isPinned } : repo
        )
      );

      setAddedRepos((prevRepos) =>
        prevRepos.map((repo) =>
          repo.id === id ? { ...repo, isPinned: !isPinned } : repo
        )
      );

      console.log(data.message);
      console.log(`This is the data after ${action}:`, data.pinnedRepos);
    } catch (error) {
      console.error(`Error while trying to ${action}:`, error);
    } finally {
      setPinLoadingRepoId(null); // Clear loading state
    }
  };

  return (
    <div className="min-h-[500px] w-[40%] mb-[10%] bg-gray-300 border-2 p-1 border-black rounded-sm overflow-auto">
      <h1 className="font-semibold py-3 text-2xl flex justify-center">
        SELECTED REPOSITORIES
      </h1>

      {selectedRepos.map((repo) => (
        <div
          className="bg-gray-400 px-2 py-1 flex justify-between mb-1 border-2 border-black rounded-sm"
          key={repo.id}
        >
          {repo.name}

          <div className="flex items-center gap-4">
            {pinLoadingRepoId === repo.id ? (
              <svg
                className="animate-spin h-5 w-5 text-black"
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
            ) : repo.isPinned ? (
              <RxDrawingPinFilled
                className={`text-xl cursor-pointer hover:text-2xl ${
                  pinLoadingRepoId === repo.id ? "cursor-not-allowed" : ""
                }`}
                onClick={() => togglePin(repo.id, true)}
                disabled={pinLoadingRepoId === repo.id}
              />
            ) : (
              <RxDrawingPin
                className={`text-xl cursor-pointer hover:text-2xl ${
                  pinLoadingRepoId === repo.id ? "cursor-not-allowed" : ""
                }`}
                onClick={() => togglePin(repo.id, false)}
                disabled={pinLoadingRepoId === repo.id}
              />
            )}

            <button
              className={`bg-red-500 border-[1px] border-black rounded-sm px-2 py-[1px] flex items-center justify-center ${
                loadingRepoId === repo.id ? "bg-gray-500 cursor-not-allowed" : ""
              }`}
              onClick={() => handleRemoveRepo(repo.id)}
              disabled={loadingRepoId === repo.id || pinLoadingRepoId === repo.id}
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
        </div>
      ))}
    </div>
  );
};

export default SelectedRepositories;
