"use client";

import React, { useEffect, useState } from "react";
import SelectedRepositories from "../components/SelectedRepositories/SelectedRepositories";
import { useSearchParams } from 'next/navigation';
import SelectRepositories from "../components/SelectRepositories/SelectRepositories";
import { useSession } from "next-auth/react";
import FabarComponent from "../components/FabarComponent/FabarComponet";

interface Repository {
  id: number;
  name: string;
  isPinned?: boolean; 
  link: string;
}

const Repositories: React.FC = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || "";
  const session = useSession();
  
  const [Repos, setRepos] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<Repository[]>([]);
  const [addedRepos, setAddedRepos] = useState<Repository[]>([]);
  const [loadingRepoId, setLoadingRepoId] = useState<number | null>(null);
  const [barisopen, setBarisopen] = useState(false);

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
    const fetchdata = async () => {
      try {
        const url = `/api/repository?Id=${id}&username=${username}`;
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
    fetchdata();
  };

  return (
    <div className="bg-white min-h-screen pt-10">
      <div className="w-full flex justify-center text-4xl font-semibold" >Respositories</div>

      <FabarComponent setBarisopen={setBarisopen} barisopen={barisopen} />

      <div className="pt-8 px-4 md:px-12 flex flex-col lg:flex-row justify-center items-start gap-6 flex-wrap">
        {session.status === "authenticated" && (
          <SelectRepositories
            repos={Repos}
            addedRepos={addedRepos}
            loadingRepoId={loadingRepoId}
            handleSelectRepo={handleSelectRepo}
          />
        )}
        <SelectedRepositories
          selectedRepos={selectedRepos}
          setSelectedRepos={setSelectedRepos}
          setAddedRepos={setAddedRepos}
          username={username}
        />
      </div>
    </div>
  );
};

export default Repositories;
