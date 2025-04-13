import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { RxDrawingPin, RxDrawingPinFilled } from "react-icons/rx";
import { useSession } from "next-auth/react";

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

type ShowcaseSelectedPRProps = {
  setListofSelectedPRs: React.Dispatch<React.SetStateAction<PR[]>>;
  listOfSelectedPRs: PR[];
  repositoryLink: string;
  repo_fullName: string;
  userId: number;
  setIsPinnedToShowInPinnedSection: React.Dispatch<React.SetStateAction<PR[]>>;
  username: string;
};

const ShowcaseSelectedPR: React.FC<ShowcaseSelectedPRProps> = ({
  setListofSelectedPRs,
  listOfSelectedPRs = [],
  repositoryLink,
  userId,
  setIsPinnedToShowInPinnedSection,
  username,
}) => {
  const [loadingPR, setLoadingPR] = useState<number | null>(null);
  const [openDescriptionId, setOpenDescriptionId] = useState<number | null>(null);
  const session = useSession();

  useEffect(() => {
    if (userId !== 0) {
      const fetchSelectedPRs = async () => {
        try {
          const res = await fetch(`/api/fetchSelectedPRs?userId=${encodeURIComponent(userId)}`);
          if (!res.ok) throw new Error(`Error: ${res.status}`);
          const data = await res.json();
          setListofSelectedPRs(data.selectedPRs);
        } catch (error) {
          console.error("Error fetching repositories:", error);
        }
      };
      fetchSelectedPRs();
    }
  }, [userId, setListofSelectedPRs]);

  const handlePinUnpin = async (id: number, shouldPin: boolean) => {
    if (session.status !== "authenticated") {
      alert("You are not authorized to make changes.");
      return;
    }
    setLoadingPR(id);
    const action = shouldPin ? "pin" : "unpin";

    try {
      const response = await fetch(`/api/PinUnpinPRs?Id=${id}&action=${action}&username=${username}`, {
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
    <div className="w-[80%] ml-[10%] mt-6 bg-white shadow-md border border-gray-300 rounded-xl p-6 overflow-auto max-h-[80vh]">
      <h1 className="text-2xl font-bold text-blue-800 text-center border-b pb-2">
        Selected Pull Requests
      </h1>

      <div className="space-y-3 mt-4">
        {Array.isArray(listOfSelectedPRs) &&
          listOfSelectedPRs.map((item) => (
            <div
              key={item.id}
              className="bg-blue-50 px-4 py-3 rounded-md border border-blue-200 hover:scale-[1.01] transition-transform"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm text-blue-600 font-semibold truncate">
                    <a href={repositoryLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {item.full_name}
                    </a>
                  </p>
                  <p className="font-medium text-blue-900">{item.name}</p>
                </div>

                <div className="flex gap-3 items-center">
                  <span className="text-gray-600 text-sm px-2 py-1 bg-blue-100 rounded-full">
                    {item.state}
                  </span>

                  {/* Pin/Unpin Icon */}
                  {loadingPR === item.id ? (
                    <svg className="animate-spin h-5 w-5 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                  ) : item.isPinned ? (
                    <RxDrawingPinFilled
                      className="cursor-pointer text-blue-600 text-xl hover:text-blue-800 transition"
                      onClick={() => handlePinUnpin(item.id, false)}
                    />
                  ) : (
                    <RxDrawingPin
                      className="cursor-pointer text-blue-600 text-xl hover:text-blue-800 transition"
                      onClick={() => handlePinUnpin(item.id, true)}
                    />
                  )}

                  {/* External Link */}
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:opacity-75 transition-transform hover:scale-125"
                  >
                    <FaExternalLinkAlt />
                  </a>

                  {/* Toggle Description Button */}
                  <button
                    onClick={() => toggleDescription(item.id)}
                    className="bg-blue-200 rounded-full p-1 hover:bg-blue-300 transition-all"
                  >
                    <RiArrowDropDownLine className="text-2xl text-blue-800" />
                  </button>
                </div>
              </div>

              {/* Description Section */}
              {openDescriptionId === item.id && (
                <div className="mt-3 p-3 bg-white border-l-4 border-blue-500 rounded-md transition-all">
                  <p className="text-gray-700">
                    {item.description || "No description available"}
                  </p>
                </div>
              )}
            </div>
          ))}
      </div>

      {(!listOfSelectedPRs || listOfSelectedPRs.length === 0) && (
        <div className="py-8 text-center text-gray-500">
          No pull requests have been selected yet.
        </div>
      )}
    </div>
  );
};

export default ShowcaseSelectedPR;