"use client";

import React, { useState, useEffect } from "react";
// import PinnedSection from "../components/PinnedPRs/PinnedPRs";
import ShowcaseSelectedPR from "../components/ShowcaseSelectedPR/ShowcaseSelectedPR";
import SelectPRsToAdd from "../components/SelectPRsToAdd/SelectPRsToAdd";
import PinnedPRs from "../components/PinnedPRs/PinnedPRs";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import FabarComponent from "../components/FabarComponent/FabarComponet";

// Define the PR type with the correct structure
type PR = {
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

const Pullrequest = () => {
  const [selectPRBoxIsOpen, setSelectPRBoxIsOpen] = useState(false);
  const [listOfSelectedPRs, setListofSelectedPRs] = useState<PR[]>([]); // Use the new PR type
  const [repo_fullName, setRepo_fullName] = useState("");
  const [repositoryLink, setRepositoryLink] = useState("");
  // const username = "vedansh2001";
  const [userId, setUserId] = useState<number>(0);
  const [isPinnedToShowInPinnedSection, setIsPinnedToShowInPinnedSection] = useState<PR[]>([]);
  const [barisopen, setBarisopen] = useState(false)

  const session = useSession();
  
  
  const searchParams = useSearchParams();
  const username = searchParams.get('username') || "";


  useEffect(() => {
    const userIdFromParams = searchParams.get('userId');
    if (userIdFromParams) {
      setUserId(Number(userIdFromParams));
    }
  }, [searchParams]);
  

  const handleOpenAddPRBox = () => {
    setSelectPRBoxIsOpen(!selectPRBoxIsOpen);
  };

  return (
    <div className="bg-gray-200">
      
      <FabarComponent
      setBarisopen={setBarisopen}
      barisopen={barisopen}
      />
      
      <div className="h-screen">
        {/* pinned section present on the top */}
        <PinnedPRs 
          isPinnedToShowInPinnedSection={isPinnedToShowInPinnedSection}
          setIsPinnedToShowInPinnedSection={setIsPinnedToShowInPinnedSection}
          username={username}
        />

        {/* button to add select PR to be added */}
        {/* Show button only if user session exists */}
        {session.status === "authenticated" && (
      <div className="w-[80%] ml-[10%] mb-6 flex justify-end">
        <button
          className="bg-green-500 border-2 border-black rounded-sm px-3 py-1"
          onClick={handleOpenAddPRBox}
        >
          Add PR +
        </button>
      </div>
    )}


        {/* code of the selected PRs that will be displayed after being selected */}
        <ShowcaseSelectedPR
          setListofSelectedPRs={setListofSelectedPRs}
          listOfSelectedPRs={listOfSelectedPRs}
          repositoryLink={repositoryLink}
          repo_fullName={repo_fullName}
          userId={userId}
          setIsPinnedToShowInPinnedSection={setIsPinnedToShowInPinnedSection}
          username={username}
        />

        {/* code of the section where user can select which PRs they want to show */}
        {selectPRBoxIsOpen && (
          <SelectPRsToAdd
            selectPRBoxIsOpen={selectPRBoxIsOpen}
            setSelectPRBoxIsOpen={setSelectPRBoxIsOpen}
            repo_fullName={repo_fullName}
            setRepo_fullName={setRepo_fullName}
            setRepositoryLink={setRepositoryLink}
            username={username}
            userId={userId}
            setListofSelectedPRs={setListofSelectedPRs}
          />
        )}
      </div>
    </div>
  );
};

export default Pullrequest;
