import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { RxDrawingPin, RxDrawingPinFilled } from "react-icons/rx";

interface Repository {
  id: number;
  name: string;
  isPinned?: boolean;
  link: string;
}

interface SelectedRepositoriesProps {
  selectedRepos: Repository[];
  setSelectedRepos: React.Dispatch<React.SetStateAction<Repository[]>>;
  setAddedRepos: React.Dispatch<React.SetStateAction<Repository[]>>;
  username: string;
}

const SelectedRepositories: React.FC<SelectedRepositoriesProps> = ({
  selectedRepos,
  setSelectedRepos,
  setAddedRepos,
  username,
}) => {
  const [loadingRepoId, setLoadingRepoId] = useState<number | null>(null);
  const [pinLoadingRepoId, setPinLoadingRepoId] = useState<number | null>(null);
  const session = useSession();

  const handleRemoveRepo = async (id: number) => {
    if (session.status !== "authenticated") {
      alert("You are not authorized to make changes.");
      return;
    }

    setLoadingRepoId(id);
    try {
      await fetch(`/api/ispinned?Id=${id}&action=unpin`, { method: "PUT" });

      const res = await fetch(`/api/removerepository?Id=${encodeURIComponent(id)}&username=${username}`, {
        method: "PUT",
      });

      if (!res.ok) {
        throw new Error("Failed to remove repository");
      }

      const data = await res.json();
      setSelectedRepos(data.selectedRepos);
      setAddedRepos(data.selectedRepos);
    } catch (error) {
      console.error("Error removing repository:", error);
    } finally {
      setLoadingRepoId(null);
    }
  };
  setTimeout(() => {
    
  console.log("this is selected repo", selectedRepos);
  }, 5000);
  

  const togglePin = async (id: number, isPinned: boolean) => {
    if (session.status !== "authenticated") {
      alert("You are not authorized to make changes.");
      return;
    }

    setPinLoadingRepoId(id);
    const action = isPinned ? "unpin" : "pin";

    try {
      const response = await fetch(`/api/ispinned?Id=${id}&action=${action}`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} repository`);
      }

      // const data = await response.json();

      setSelectedRepos((prevRepos) =>
        prevRepos.map((repo) => (repo.id === id ? { ...repo, isPinned: !isPinned } : repo))
      );

      setAddedRepos((prevRepos) =>
        prevRepos.map((repo) => (repo.id === id ? { ...repo, isPinned: !isPinned } : repo))
      );
    } catch (error) {
      console.error(`Error during ${action} operation:`, error);
    } finally {
      setPinLoadingRepoId(null);
    }
  };

  return (
    <div className="min-h-[500px] w-[40%] mb-[10%] bg-gray-300 shadow-lg border border-black p-5 rounded-lg overflow-auto">
      <h1 className="font-bold py-3 text-2xl text-center text-gray-800 border-b border-gray-300">
        Selected Repositories
      </h1>

      {/* Repositories List */}
      <div className="space-y-2 mt-3 ">
        {selectedRepos.map((repo) => (
          <div
            key={repo.id}
            className="bg-gray-400 px-4 py-2 flex justify-between items-center border-1 border-black rounded-md shadow-sm transition-transform hover:scale-[1.02]"
          >
            {/* Repository Name */}
            <span 
                className="font-medium flex items-center gap-4 truncate text-gray-800">
                {repo.name}
                
                <Link href={`${repo.link}`} >
                      <FaExternalLinkAlt className=" text-blue-700 hover:opacity-70 hover:scale-125 transition duration-200" />
                </Link>
            </span>

            <div className="flex items-center gap-4">
              {/* Pin/Unpin Button */}
              {pinLoadingRepoId === repo.id ? (
                <svg
                  className="animate-spin h-5 w-5 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : repo.isPinned ? (
                <RxDrawingPinFilled
                  className="text-gray-800 text-xl cursor-pointer hover:text-green-800 transition"
                  onClick={() => togglePin(repo.id, true)}
                />
              ) : (
                <RxDrawingPin
                  className="text-gray-600 text-xl cursor-pointer hover:text-black transition"
                  onClick={() => togglePin(repo.id, false)}
                />
              )}

              {/* Remove Button */}
              <button
                className={`px-3 py-1 text-sm font-semibold rounded-md flex items-center border border-black bg-gradient-to-r hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out
                  ${loadingRepoId === repo.id ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "from-red-500 to-red-600 text-white"}`}
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                ) : (
                  "Remove"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedRepositories;
