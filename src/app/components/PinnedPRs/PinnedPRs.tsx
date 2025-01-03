import Link from 'next/link';
import React, { useEffect } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { PiPushPinSlashFill } from 'react-icons/pi';

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

// interface usernameprop {
//   username: string;
// }
type PinnedPRsProps = {
  //  fetchPinnedPRs: () => Promise<void>; 
   isPinnedToShowInPinnedSection: PR[] ;
   setIsPinnedToShowInPinnedSection: React.Dispatch<React.SetStateAction<PR[]>>;
   username: string;
  };

const PinnedPRs: React.FC<PinnedPRsProps> = ({
  isPinnedToShowInPinnedSection,
  setIsPinnedToShowInPinnedSection,
  username,
}) => {
  
  
  const fetchPinnedPRs = async () => {
    try {
      const res = await fetch(`/api/fetchPinnedPRs/?username=${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
      });

      const data = await res.json();
      setIsPinnedToShowInPinnedSection(data.isPinnedToShowInPinnedSection);
    } catch (error) {
      console.log('Failed to fetch Pinned PRs: ', error);
    }
  };

  useEffect(() => {
    setIsPinnedToShowInPinnedSection(isPinnedToShowInPinnedSection)
      fetchPinnedPRs();
  }, []);

  return (
    <div className="h-[38%] bg-gray-300">
      <p className="ml-[10%] pb-1 flex items-center gap-1">
        <PiPushPinSlashFill />
        Pinned PRs
      </p>
      <div className="w-[80%] ml-[10%] bg-gray-300 h-[80%] border-2 p-4 border-black rounded-sm grid grid-cols-2 gap-4">
      {isPinnedToShowInPinnedSection?.length > 0 ? (
        isPinnedToShowInPinnedSection.map((item) => (
          <div
          key={item.id}
          className="border-2 border-gray-700 p-2 flex items-center justify-between cursor-pointer truncate"
          >
          <div className="bg-gray-300 truncate max-w-[90%]" >
            {item.name}
          </div>
           <div>
             <Link href={item.link}>
               <FaExternalLinkAlt className="hover:text-blue-500" />
             </Link>
           </div>
           </div>
        ))
      ) : (
        <div>
            <p className="text-gray-500 col-span-2 text-center">
              No pinned repositories
            </p>

        </div>
      )}
      </div>
    </div>
  );
};

export default PinnedPRs;
  