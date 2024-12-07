"use client";

import React, { useEffect, useState } from 'react';
import SelectedRepositories from '../components/SelectedRepositories/SelectedRepositories';

const Repositories = () => {
  const [Repos, setRepos] = useState([]); // List of all repositories
  const [selectedRepos, setSelectedRepos] = useState([]); // List of selected repositories
  const [addedRepos, setAddedRepos] = useState([]); // Tracks which repos have been added

  const username = "vedansh2001";

  const handleSelectRepo = (nameofrepo) => {
    if (!addedRepos.includes(nameofrepo)) {
      // Add repo to selected and added lists
      setSelectedRepos([...selectedRepos, nameofrepo]);
      setAddedRepos([...addedRepos, nameofrepo]);
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        const data = await res.json();
        const RepoListExtracted = data.map((item) => item.name);
        setRepos(RepoListExtracted);
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

        {Repos.map((name, index) => (
          <div
            className="bg-gray-400 px-2 py-1 flex justify-between mb-1 border-2 border-black rounded-sm"
            key={index}
          >
            {name}

            <button
              className={`bg-green-500 border-[1px] border-black rounded-sm px-2 py-[1px] 
                ${addedRepos.includes(name) ? "bg-slate-500" : ""}`}
              
              onClick={() => handleSelectRepo(name)}
            >
              {addedRepos.includes(name) ? "Added" : "Add +"}
            </button>
          </div>
        ))}
      </div>

      {/* Selected Repositories */}
      <SelectedRepositories selectedRepos={selectedRepos} setSelectedRepos={setSelectedRepos} setAddedRepos={setAddedRepos} addedRepos={addedRepos} />
    </div>
  );
};

export default Repositories;
