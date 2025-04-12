import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

type PR = {
  title: string;
  number: number;
  html_url: string;
  state: string;
  full_name: string;
  added?: boolean;
};

type PR2 = {
  createdAt: string;
  description: string | null;
  full_name: string;
  id: number;
  isPinned: boolean;
  link: string;
  name: string;
  number: number;
  repositoryId: number;
  state: string;
  userId: number;
};

interface Repository {
  id: number;
  name: string;
}

const SelectPRsToAdd = ({
  selectPRBoxIsOpen,
  setSelectPRBoxIsOpen,
  repo_fullName,
  setRepo_fullName,
  setRepositoryLink,
  username,
  userId,
  setListofSelectedPRs
}: {
  selectPRBoxIsOpen: boolean;
  setSelectPRBoxIsOpen: (value: boolean) => void;
  repo_fullName: string;
  setRepo_fullName: (value: string) => void;
  setRepositoryLink: (value: string) => void;
  username: string;
  userId: number;
  setListofSelectedPRs: React.Dispatch<React.SetStateAction<PR2[]>>;
}) => {
  const [dropdowns, setDropdowns] = useState({ repo: false, pr: false });
  const [repos, setRepos] = useState<Repository[]>([]);
  const [prs, setPRs] = useState<PR[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("Select repository...");
  const [repoId, setRepoId] = useState<number>(0);
  const [loadingPR, setLoadingPR] = useState<number | null>(null);

  const toggleDropdown = (type: "repo" | "pr") =>
    setDropdowns((prev) => ({ ...prev, [type]: !prev[type] }));

  const closePRBox = () => setSelectPRBoxIsOpen(false);

  const handleSelectRepo = (name: string, id: number) => {
    setSelectedRepo(name);
    setRepoId(id);
    toggleDropdown("repo");
    fetchRepoDetails(name);
  };

  const handleAddPR = async (item: PR) => {
    setLoadingPR(item.number);
    try {
      const payload = {
        title: item.title,
        number: item.number,
        html_url: item.html_url,
        state: item.state,
        full_name: repo_fullName,
        repositoryId: repoId,
        userId
      };
      const res = await fetch("/api/selectPRofRepo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setListofSelectedPRs(data.data);
    } catch (error) {
      console.error("Error adding PR:", error);
    } finally {
      setLoadingPR(null);
    }
  };

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(`/api/repository?username=${username}`);
        const data = await res.json();
        setRepos(data.userRepo || []);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };
    fetchRepos();
  }, []);

  const fetchRepoDetails = async (name: string) => {
    try {
      const res = await fetch(`https://api.github.com/repos/${username}/${name}`);
      const data = await res.json();
      if (data.fork) {
        setRepo_fullName(data.parent?.full_name || "");
        setRepositoryLink(data.parent?.clone_url || "");
      } else {
        setRepo_fullName(data.full_name || "");
        setRepositoryLink(data.clone_url || "");
      }
    } catch (error) {
      console.error("Error fetching repo details:", error);
    }
  };

  useEffect(() => {
    if (!repo_fullName) return;
    const fetchPRs = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/search/issues?q=type:pr+author:${username}+repo:${repo_fullName}`
        );
        const data = await res.json();
        setPRs(data.items.map((item: PR) => ({ ...item, added: false })));
      } catch (error) {
        console.error("Error fetching PRs:", error);
      }
    };
    fetchPRs();
  }, [repo_fullName]);

  return (
    <div>
      {selectPRBoxIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-lg p-6 shadow-lg">
            <div className="flex justify-end">
              <button
                className="text-sm bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                onClick={closePRBox}
              >
                Close
              </button>
            </div>

            <p className="text-lg font-semibold text-center mb-4 text-gray-800 dark:text-white">
              Add Pull Requests
            </p>

            {/* Repo Dropdown */}
            <div className="relative mb-4">
              <button
                onClick={() => toggleDropdown("repo")}
                className="w-full flex justify-between items-center border px-4 py-3 rounded-md text-gray-700 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              >
                <span>{selectedRepo}</span>
                <RiArrowDropDownLine className="text-2xl" />
              </button>
              {dropdowns.repo && (
                <div className="absolute z-10 mt-2 w-full max-h-40 overflow-y-auto rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                  {repos.map((repo) => (
                    <div
                      key={repo.id}
                      onClick={() => handleSelectRepo(repo.name, repo.id)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      {repo.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PR Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("pr")}
                className="w-full flex justify-between items-center border px-4 py-3 rounded-md text-gray-700 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              >
                <span>Select PR</span>
                <RiArrowDropDownLine className="text-2xl" />
              </button>
              {dropdowns.pr && (
                <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                  {prs.map((item) => (
                    <div
                      key={item.number}
                      className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="text-sm text-gray-700 dark:text-white truncate w-3/4">{item.title}</span>
                      <button
                        className={`ml-2 px-3 py-1 rounded-md text-sm font-medium ${
                          item.added
                            ? "bg-blue-500 text-white cursor-not-allowed"
                            : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                        onClick={() => handleAddPR(item)}
                        disabled={loadingPR === item.number || item.added}
                      >
                        {loadingPR === item.number ? "Adding..." : item.added ? "Added" : "Add"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectPRsToAdd;
