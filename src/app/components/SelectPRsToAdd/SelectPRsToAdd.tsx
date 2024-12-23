import React, { useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';

type PR = { title: string; number: number; html_url: string; state: string };

const SelectPRsToAdd = ({
  selectPRBoxIsOpen,
  setSelectPRBoxIsOpen,
  listOfSelectedPRs,
  repo_fullName,
  setRepo_fullName,
  setRepositoryLink,
  username,
}: {
  selectPRBoxIsOpen: boolean;
  setSelectPRBoxIsOpen: (value: boolean) => void;
  listOfSelectedPRs: PR[];
  repo_fullName: string;
  setRepo_fullName: (value: string) => void;
  setRepositoryLink: (value: string) => void;
  username: string;
}) => {
  const [isdropdownRepo, setIsdropdownRepo] = useState(false);
  const [isdropdownPR, setIsdropdownPR] = useState(false);
  const [listOfUserRepos, setListOfUserRepos] = useState<string[]>([]);
  const [listOfPRsOfParticularRepo, setlistOfPRsOfParticularRepo] = useState<PR[]>([]);
  const [selectedRepo, setSelectedRepo] = useState("Select repository...");
  const [selectedPR, setSelectedPR] = useState<PR | null>(null); // Changed this to type PR | null to ensure a valid object

  const handleCrossToCloseAddPRBox = () => {
    setSelectPRBoxIsOpen(!selectPRBoxIsOpen);
  };

  const handleToSelectRepo = (name: string) => {
    setSelectedRepo(name);
    setIsdropdownRepo(!isdropdownRepo);
    fetchdataforPR(name);
  };

  const handleToSelectPR = (item: PR) => {
    setSelectedPR(item);  // Now setSelectedPR can accept the 'PR' type object correctly
    setIsdropdownPR(!isdropdownPR);
  };

  const handleAddPR = () => {
    if (selectedPR) {  // Added a check to ensure selectedPR is not null before pushing
      listOfSelectedPRs.push(selectedPR);
      setSelectPRBoxIsOpen(!selectPRBoxIsOpen);
    }
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        const data = await res.json();
        const RepoListExtracted = data.map((item: { name: string }) => item.name);
        setListOfUserRepos(RepoListExtracted);
      } catch (error) {
        console.log("error: ", error);
      }
    };
    fetchdata();
  }, [username]);

  const fetchdataforPR = async (name: string) => {
    try {
      const fetchOwnerName = await fetch(`https://api.github.com/repos/${username}/${name}`);
      const ownerdata = await fetchOwnerName.json();

      if (ownerdata.fork) {
        setRepo_fullName(ownerdata.parent?.full_name || "");
        setRepositoryLink(ownerdata.parent?.clone_url || "");
      } else {
        setRepo_fullName(ownerdata.full_name || "");
        setRepositoryLink(ownerdata.clone_url || "");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    if (repo_fullName) {
      fetchdataforPR2(repo_fullName);
    }
  }, [repo_fullName]);

  const fetchdataforPR2 = async (repo_fullName: string) => {
    try {
      const fetchPRdata = await fetch(
        `https://api.github.com/search/issues?q=type:pr+author:${username}+repo:${repo_fullName}`
      );
      const PRdata = await fetchPRdata.json();

      const PRlist = PRdata.items.map((item: any) => ({
        title: item.title,
        number: item.number,
        html_url: item.html_url,
        state: item.state,
      }));

      setlistOfPRsOfParticularRepo(PRlist);
      console.log(PRlist);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div>
      {selectPRBoxIsOpen && (
        <div className="absolute top-[20%] right-[25%] w-[50%] h-[50%] bg-[#FFFFFF] p-5 border-2 border-black rounded-sm">
          <div className="flex justify-end">
            <button
              className="px-3 py-1 flex justify-center items-center bg-gray-200"
              onClick={handleCrossToCloseAddPRBox}
            >
              X
            </button>
          </div>

          <div>
            <p className="ml-[7.5%] mb-2">Add PRs</p>
            <div className="w-[85%] ml-[7.5%] h-[60px] border-2 border-black text-gray-600 flex items-center justify-between px-4">
              <p>{selectedRepo}</p>
              <button
                onClick={() => setIsdropdownRepo(!isdropdownRepo)}
                className="text-4xl"
              >
                <RiArrowDropDownLine />
              </button>
            </div>

            {isdropdownRepo && (
              <div className="w-[85%] ml-[7.5%] h-40 max-h-40 overflow-y-auto">
                {listOfUserRepos.map((name, index) => (
                  <div
                    className="h-[40px] border-2 border-black text-gray-500 flex items-center justify-between px-4 -mt-[1px] hover:bg-gray-200"
                    key={index}
                    onClick={() => handleToSelectRepo(name)}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="w-[85%] ml-[7.5%] mt-8 h-[60px] border-2 border-black text-gray-600 flex items-center justify-between px-4">
              <p>Select PR</p>
              <button
                onClick={() => setIsdropdownPR(!isdropdownPR)}
                className="text-4xl"
              >
                <RiArrowDropDownLine />
              </button>
            </div>

            {isdropdownPR && (
              <div className="w-[85%] ml-[7.5%] max-h-40 overflow-y-auto">
                {listOfPRsOfParticularRepo.map((item, index) => (
                  <div
                    className="h-[40px] border-2 border-black text-gray-500 flex items-center justify-between px-4 -mt-1 hover:bg-gray-200"
                    key={index}
                    onClick={() => handleToSelectPR(item)}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-center pt-6">
            <button
              className="bg-green-500 border-2 border-black rounded-sm px-4 py-1"
              onClick={handleAddPR}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectPRsToAdd;
