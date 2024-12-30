import React, { useEffect, useState } from 'react';
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

type PinnedPRsProps = {
  //  fetchPinnedPRs: () => Promise<void>; 
   isPinnedToShowInPinnedSection: PR[] ;
   setIsPinnedToShowInPinnedSection: React.Dispatch<React.SetStateAction<PR[]>>;
  };

const PinnedPRs: React.FC<PinnedPRsProps> = ({
  isPinnedToShowInPinnedSection,
  setIsPinnedToShowInPinnedSection,
}) => {
  
  
  const fetchPinnedPRs = async () => {
    try {
      const res = await fetch('api/fetchPinnedPRs');
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
        {isPinnedToShowInPinnedSection.map((item) => (
          <div className="border-2 border-gray-700" key={item.id}>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PinnedPRs;
 