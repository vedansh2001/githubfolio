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
    <div className="w-full lg:w-[45%] bg-white shadow-md border border-gray-300 rounded-xl p-6 overflow-auto max-h-[80vh]">
      <h1 className="text-2xl font-bold text-blue-800 text-center border-b pb-2">
        Selected Repositories
      </h1>


      <div className="space-y-3 mt-4">
        {selectedRepos.map((repo) => (
          <div
            key={repo.id}
            className="bg-blue-50 px-4 py-2 flex justify-between items-center rounded-md border border-blue-200 hover:scale-[1.01] transition-transform"
          >
            <span className="font-medium text-blue-900 flex items-center gap-3 truncate">
              {repo.name}
              <a href={repo.link} target="_blank" rel="noopener noreferrer">
                <FaExternalLinkAlt className="text-blue-500 hover:opacity-75 transition-transform hover:scale-125" />
              </a>
            </span>
            <div className="flex items-center gap-4">
              {pinLoadingRepoId === repo.id ? (
                <svg className="animate-spin h-5 w-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : repo.isPinned ? (
                <RxDrawingPinFilled className="text-blue-600 text-xl cursor-pointer" onClick={() => togglePin(repo.id, true)} />
              ) : (
                <RxDrawingPin className="text-blue-600 text-xl cursor-pointer" onClick={() => togglePin(repo.id, false)} />
              )}
              <button
                className={`px-3 py-1 text-sm font-semibold rounded-md border border-blue-400 shadow-sm transition-all duration-300 ease-in-out ${
                  loadingRepoId === repo.id ? "bg-blue-300 text-white cursor-not-allowed" : "bg-blue-200 text-white hover:bg-blue-400"
                }`}
                onClick={() => handleRemoveRepo(repo.id)}
                disabled={loadingRepoId === repo.id || pinLoadingRepoId === repo.id}
              >
                {loadingRepoId === repo.id ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
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
