import React, { useEffect, useState } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

type PR = {
  title: string;
  number: number;
  html_url: string;
  state: string;
  full_name: string;
  added?: boolean; // Add the optional 'added' property
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
  const [dropdowns, setDropdowns] = useState({
    repo: false,
    pr: false,
  });
  const [repos, setRepos] = useState<Repository[]>([]);
  const [prs, setPRs] = useState<PR[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("Select repository...");
  const [repoId, setRepoId] = useState<number>(0);
  const [loadingPR, setLoadingPR] = useState<number | null>(null); // Tracks the loading state for the specific PR

  const toggleDropdown = (type: "repo" | "pr") => {
    setDropdowns((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const closePRBox = () => setSelectPRBoxIsOpen(false);

  const handleSelectRepo = (name: string, id: number) => {
    setSelectedRepo(name);
    setRepoId(id);
    toggleDropdown("repo");
    fetchRepoDetails(name);
  };

  const handleAddPR = async (item: PR) => {
    setLoadingPR(item.number); // Start loading for the specific PR

    try {
      const payload = {
        title: item.title,
        number: item.number,
        html_url: item.html_url,
        state: item.state,
        full_name: repo_fullName,
        userId,
        repositoryId: repoId,
      };

      const res = await fetch("/api/selectPRofRepo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();

      setListofSelectedPRs(data.data)

    } catch (error) {
      console.error("Error adding PR:", error);
    } finally {
      setLoadingPR(null); // Stop loading
    }
  };

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch("/api/repository");
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

        setPRs(data.items.map((item: any) => ({
          title: item.title,
          number: item.number,
          html_url: item.html_url,
          state: item.state,
          added: false, // Track if this PR is added
        })));
      } catch (error) {
        console.error("Error fetching PRs:", error);
      }
    };

    fetchPRs();
  }, [repo_fullName]);

  return (
    <div>
      {selectPRBoxIsOpen && (
        <div className="absolute top-[20%] right-[25%] w-[50%] h-[50%] bg-white p-5 border-2 border-black rounded-sm">
          <div className="flex justify-end">
            <button
              className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300"
              onClick={closePRBox}
            >
              X
            </button>
          </div>
          <div>
            <p className="ml-[7.5%] mb-2 text-lg font-semibold">Add PRs</p>
            <div className="w-[85%] ml-[7.5%] h-[60px] border-2 border-black text-gray-600 flex items-center justify-between px-4">
              <p>{selectedRepo}</p>
              <button onClick={() => toggleDropdown("repo")} className="text-4xl">
                <RiArrowDropDownLine />
              </button>
            </div>
            {dropdowns.repo && (
              <div className="w-[85%] ml-[7.5%] max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-gray-50">
                {repos.map((repo) => (
                  <div
                    className="h-[40px] border-b border-gray-300 text-gray-500 flex items-center justify-between px-4 hover:bg-gray-200 cursor-pointer"
                    key={repo.id}
                    onClick={() => handleSelectRepo(repo.name, repo.id)}
                  >
                    {repo.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="w-[85%] ml-[7.5%] mt-8 h-[60px] border-2 border-black text-gray-600 flex items-center justify-between px-4">
              <p>Select PR</p>
              <button onClick={() => toggleDropdown("pr")} className="text-4xl">
                <RiArrowDropDownLine />
              </button>
            </div>
            {dropdowns.pr && (
              <div className="w-[85%] ml-[7.5%] max-h-40 overflow-y-auto border border-gray-300 rounded-md bg-gray-50">
                {prs.map((item) => (
                  <div
                    className="h-[40px] border-b border-gray-300 text-gray-500 flex items-center justify-between px-4 hover:bg-gray-200 cursor-pointer"
                    key={item.number}
                  >
                    {item.title}
                    <button
                      className={`px-4 py-1 border-2 rounded-sm ${
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
      )}
    </div>
  );
};

export default SelectPRsToAdd;
