"use client";

import React, { useEffect, useState } from "react";
import SelectedRepositories from "../components/SelectedRepositories/SelectedRepositories";

const Repositories = () => {
  const [Repos, setRepos] = useState([]); // List of all repositories
  const [selectedRepos, setSelectedRepos] = useState([]); // List of selected repositories
  const [addedRepos, setAddedRepos] = useState([]); // Tracks which repos have been added
  const [loadingRepoId, setLoadingRepoId] = useState(null); // Track loading state for each button

  const username = "vedansh2001";

  const handleSelectRepo = (id) => {
    setLoadingRepoId(id); // Start loading for the specific repository

    const fetchdata = async (id) => {
      try {
        const url = `/api/repository?Id=${encodeURIComponent(id)}`;
        const res = await fetch(url, {
          method: "POST", // Specify the method
        });

        if (!res.ok) {
          throw new Error("Failed to add repository");
        }

        const data = await res.json();
        console.log(data.selectedRepos);
        setSelectedRepos(data.selectedRepos);
        setAddedRepos(data.selectedRepos);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingRepoId(null); // Stop loading
      }
    };

    fetchdata(id);
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch("api/repository");
        const data = await res.json();
        const RepoListExtracted = data.userRepo;
        setRepos(RepoListExtracted);
        setSelectedRepos(data.selectedRepos);
      } catch (error) {
        console.log("error: ", error);
      }
    };
    fetchdata();
  }, [username]);

  return (
    <div className="h-screen bg-gray-200 pt-[5%] px-[10%] flex justify-between">
      {/* Available Repositories */}
      <div className="min-h-[500px] w-[40%] mb-[10%] bg-gray-300 border-2 p-1 border-black rounded-sm overflow-auto">
        <h1 className="font-semibold py-3 text-2xl flex justify-center">
          SELECT REPOSITORIES
        </h1>

        {Repos.map(({ id, name }, index) => (
          <div
            className="bg-gray-400 px-2 py-1 flex justify-between mb-1 border-2 border-black rounded-sm"
            key={index}
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

      {/* Selected Repositories */}
      <SelectedRepositories
        selectedRepos={selectedRepos}
        setSelectedRepos={setSelectedRepos}
        setAddedRepos={setAddedRepos}
        addedRepos={addedRepos}
      />
    </div>
  );
};

export default Repositories;
