import React, { useEffect, useState } from "react";
import { RxDrawingPin, RxDrawingPinFilled } from "react-icons/rx";
import { FaExternalLinkAlt, FaSpinner } from "react-icons/fa"; // Spinner icon for loading
import { RiArrowDropDownLine } from "react-icons/ri";

type PR = {
  createdAt: string; // ISO Date format
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

type ShowcaseSelectedPRProps = {
  setListofSelectedPRs: React.Dispatch<React.SetStateAction<PR[]>>; // State setter for PR array
  listOfSelectedPRs: PR[]; // Array of PR objects
  repositoryLink: string; // Repository link
  repo_fullName: string; // Repository full name
  userId: number; // User ID
  setIsPinnedToShowInPinnedSection: React.Dispatch<React.SetStateAction<PR[]>>;
};

const ShowcaseSelectedPR: React.FC<ShowcaseSelectedPRProps> = ({
  setListofSelectedPRs,
  listOfSelectedPRs = [], // Default to an empty array if undefined or null
  repositoryLink,
  repo_fullName,
  userId,
  setIsPinnedToShowInPinnedSection,
}) => {
  const [loadingPR, setLoadingPR] = useState<number | null>(null); // PR ID being pinned/unpinned
  const [openDescriptionId, setOpenDescriptionId] = useState<number | null>(null); // Tracks which PR's description is open

  useEffect(() => {
    if (userId !== 0) {
      const fetchSelectedPRs = async () => {
        try {
          const res = await fetch(`/api/fetchSelectedPRs?userId=${encodeURIComponent(userId)}`);
          if (!res.ok) throw new Error(`Error: ${res.status}`);
          const data = await res.json();
          setListofSelectedPRs(data.selectedPRs); // Update state with fetched PRs
        } catch (error) {
          console.error("Error fetching repositories:", error);
        }
      };
      fetchSelectedPRs();
    }
  }, [userId, setListofSelectedPRs]);

  const handlePinUnpin = async (id: number, shouldPin: boolean) => {
    setLoadingPR(id); // Show spinner for the clicked PR
    const action = shouldPin ? "pin" : "unpin";

    try {
      const response = await fetch(`/api/PinUnpinPRs?Id=${id}&action=${action}`, {
        method: "PUT",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to ${action}:`, errorText);
        throw new Error(errorText);
      }
      const data = await response.json();
      setIsPinnedToShowInPinnedSection(data.pinnedPRs);

      setListofSelectedPRs((prevPRs) =>
        prevPRs.map((pr) => (pr.id === id ? { ...pr, isPinned: shouldPin } : pr))
      );
    } catch (error) {
      console.error(`Error during ${action} operation:`, error);
    } finally {
      setLoadingPR(null);
    }
  };

  const toggleDescription = (id: number) => {
    setOpenDescriptionId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div>
      {Array.isArray(listOfSelectedPRs) &&
        listOfSelectedPRs.map((item) => (
          <div
            className="w-[70%] h-[60px] ml-[15%] border-2 mb-4 border-black rounded-sm flex justify-between items-center px-4 bg-gray-300"
            key={item.id}
          >
            <div>
              <p className="text-sm text-sky-600">
                <a href={repositoryLink}>{item.full_name}</a>
              </p>
              <p>
                {item.name} {/* Name of PR */}
              </p>
            </div>
            <div>
              <div className="flex gap-5 items-center">
                <div>Status: {item.state}</div>
                {loadingPR === item.id ? (
                  <FaSpinner className="animate-spin text-gray-500" />
                ) : item.isPinned ? (
                  <RxDrawingPinFilled
                    className="cursor-pointer text-black"
                    onClick={() => handlePinUnpin(item.id, false)}
                  />
                ) : (
                  <RxDrawingPin
                    className="cursor-pointer text-black"
                    onClick={() => handlePinUnpin(item.id, true)}
                  />
                )}
                
                <a className="text-sky-600 ml-2" href={item.link}>
                  <FaExternalLinkAlt/>
                </a>
              </div>
              <div className="flex justify-end -mr-2">
                <div
                  className=" bg-[#C4C4C4] rounded-full flex justify-end"
                  onClick={() => toggleDescription(item.id)}
                >
                  <RiArrowDropDownLine className="text-3xl" />
                </div>
            {openDescriptionId === item.id && (
              <div className="h-[150px] w-[70%] -mx-[10px] p-4 absolute bg-gray-300 mt-[40px]">
                {item.description || "No description available"}
              </div>
            )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ShowcaseSelectedPR;
