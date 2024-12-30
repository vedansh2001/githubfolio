import React, { useEffect, useState } from "react";
import { RxDrawingPin, RxDrawingPinFilled } from "react-icons/rx";
import { FaSpinner } from "react-icons/fa"; // Spinner icon for loading

// Updated PR type to match the data structure you provided
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
  const [descriptionDropdown, setDescriptionDropdown] = useState(false);
  const [loadingPR, setLoadingPR] = useState<number | null>(null); // PR ID being pinned/unpinned

  const handleAddDescription = () => {
    setDescriptionDropdown(!descriptionDropdown);
  };

  // Fetching PRs when userId changes
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
  }, [userId, setListofSelectedPRs]); // Dependency array for useEffect
  

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
      setIsPinnedToShowInPinnedSection(data.pinnedPRs)
  
      // Update the local state immediately
      setListofSelectedPRs((prevPRs) =>
        prevPRs.map((pr) =>
          pr.id === id ? { ...pr, isPinned: shouldPin } : pr
        )
      );
  
    } catch (error) {
      console.error(`Error during ${action} operation:`, error);
    } finally {
      setLoadingPR(null);

    }
  };
  

  return (
    <div>
      {/* Loop through listOfSelectedPRs to render each PR */}
      {Array.isArray(listOfSelectedPRs) &&
        listOfSelectedPRs.map((item) => (
          <div
            className="w-[70%] h-[60px] ml-[15%] border-2 mb-4 border-black rounded-sm flex justify-between px-4"
            key={item.id}
          >
            <div>
              <p className="text-sm text-sky-600">
                <a href={repositoryLink}>{item.full_name}</a>
              </p>
              <p>
                {item.name} {/* Name of PR */}
                <a className="text-sky-600 ml-2" href={item.link}>
                  Link
                </a>
              </p>
            </div>
            <div>
              <div className="flex gap-4 items-center">
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
              </div>
            </div>
            <button
              className="bg-gray-200 px-2 flex justify-center items-center"
              onClick={handleAddDescription}
            >
              v
            </button>
          </div>
        ))}

      {/* Description dropdown */}
      {descriptionDropdown && (
        <div className="h-[150px] w-[70%] ml-[15%] bg-gray-300">
          {/* Description content here */}
          hello
        </div>
      )}
    </div>
  );
};

export default ShowcaseSelectedPR;
