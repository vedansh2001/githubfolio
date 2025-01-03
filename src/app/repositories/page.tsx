"use client";

import React, { useEffect, useState } from "react";
import SelectedRepositories from "../components/SelectedRepositories/SelectedRepositories";
import { useSearchParams } from 'next/navigation';

interface Repository {
  id: number;
  name: string;
  isPinned?: boolean; 
}

const Repositories: React.FC = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || "";

  console.log("@#$%^&*(*&^%$#$%^&*&^%$::::::::::::::::::::::-------------", username);
  
  
  const [Repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<Repository[]>([]);
  const [addedRepos, setAddedRepos] = useState<Repository[]>([]);
  const [loadingRepoId, setLoadingRepoId] = useState<number | null>(null);

  useEffect(() => {
    if (username) {
      const fetchdata = async () => {
        try {
          const res = await fetch(`/api/repository?username=${username}`);
          const data = await res.json();
          const RepoListExtracted = data.userRepo.map((repo: Repository) => ({
            ...repo,
            isPinned: repo.isPinned || false,
          }));
          setRepos(RepoListExtracted);
          setSelectedRepos(data.selectedRepos);
        } catch (error) {
          console.log("error: ", error);
        }
      };
      fetchdata();
    }
  }, [username]);

  const handleSelectRepo = (id: number) => {
    setLoadingRepoId(id);

    const fetchdata = async (id: number) => {
      try {
        const url = `/api/repository?Id=${encodeURIComponent(id)}&username=${encodeURIComponent(username || '')}`;
        // const url = `/api/repository?Id=${encodeURIComponent(id)}}`;
        const res = await fetch(url, { method: "POST" });

        if (!res.ok) throw new Error("Failed to add repository");

        const data = await res.json();
        setSelectedRepos(data.selectedRepos);
        setAddedRepos(data.selectedRepos);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingRepoId(null);
      }
    };

    fetchdata(id);
  };

  // Rest of the component remains the same
  return (
    <div className="h-screen bg-gray-200 pt-[5%] px-[10%] flex justify-between">
      <div className="min-h-[500px] w-[40%] mb-[10%] bg-gray-300 border-2 p-1 border-black rounded-sm overflow-auto">
        <h1 className="font-semibold py-3 text-2xl flex justify-center">
          SELECT REPOSITORIES
        </h1>
        {Repos.map(({ id, name }) => (
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

      <SelectedRepositories
        selectedRepos={selectedRepos}
        setSelectedRepos={setSelectedRepos}
        setAddedRepos={setAddedRepos}
        username={username}
      />
    </div>
  );
};

export default Repositories;