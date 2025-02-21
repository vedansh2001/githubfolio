import React, { useEffect, useState } from "react";
import { RxDrawingPin, RxDrawingPinFilled } from "react-icons/rx";
import { FaExternalLinkAlt, FaSpinner } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
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
    <div className="mt-6 flex flex-col items-center">
      {Array.isArray(listOfSelectedPRs) &&
        listOfSelectedPRs.map((item) => (
          <div
            key={item.id}
            className="w-[70%] bg-gray-300 border border-gray-800 shadow-md rounded-lg mb-4 p-4 transition-all hover:shadow-lg"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-600 font-semibold">
                  <a href={repositoryLink} target="_blank" rel="noopener noreferrer">{item.full_name}</a>
                </p>
                <p className="font-medium text-lg">{item.name}</p>
              </div>

              <div className="flex gap-4 items-center">
                <span className="text-gray-600 text-sm">Status: {item.state}</span>

                {/* Pin/Unpin Icon */}
                {loadingPR === item.id ? (
                  <FaSpinner className="animate-spin text-gray-500 text-lg" />
                ) : item.isPinned ? (
                  <RxDrawingPinFilled
                    className="cursor-pointer text-green-600 text-xl hover:text-green-800 transition"
                    onClick={() => handlePinUnpin(item.id, false)}
                  />
                ) : (
                  <RxDrawingPin
                    className="cursor-pointer text-gray-600 text-xl hover:text-black transition"
                    onClick={() => handlePinUnpin(item.id, true)}
                  />
                )}

                {/* External Link */}
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition">
                  <FaExternalLinkAlt />
                </a>

                {/* Toggle Description */}
                <button
                  onClick={() => toggleDescription(item.id)}
                  className="bg-gray-400 rounded-full p-1 hover:bg-gray-500 transition"
                >
                  <RiArrowDropDownLine className="text-2xl text-gray-700" />
                </button>
              </div>
            </div>

            {/* Description Section */}
            {openDescriptionId === item.id && (
              <div className="mt-3 p-3 bg-gray-100 border-l-4 border-blue-500 rounded-lg transition-all">
                {item.description || "No description available"}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default ShowcaseSelectedPR;
