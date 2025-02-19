"use client";

import React, { useEffect, useState } from "react";
import SelectedRepositories from "../components/SelectedRepositories/SelectedRepositories";
import { useSearchParams } from 'next/navigation';
import RepositoryList from "../components/SelectRepositories/SelectRepositories";

interface Repository {
  id: number;
  name: string;
  isPinned?: boolean; 
}

const Repositories: React.FC = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || "";
  
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

  return (
    <div className="h-screen bg-gray-200 pt-[5%] px-[10%] flex justify-between">
      
      {/* Repository List Component */}
      <RepositoryList
        repos={Repos}
        addedRepos={addedRepos}
        loadingRepoId={loadingRepoId}
        handleSelectRepo={handleSelectRepo}
      />

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
