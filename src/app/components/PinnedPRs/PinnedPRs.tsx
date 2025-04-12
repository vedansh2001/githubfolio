import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { PiPushPinSlashFill } from 'react-icons/pi';
import PinnedReposSkeleton from './PinnedPrsSkeleton';

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

type PinnedPRsProps = {username: string;
};

const PinnedPRs: React.FC<PinnedPRsProps> = ({username}) => {
  const [loading, setLoading] = useState(true);
    const [isPinnedToShowInPinnedSection, setIsPinnedToShowInPinnedSection] = useState<PR[]>([]);

  useEffect(() => {
    const fetchPinnedPRs = async () => {
      try {
        const res = await fetch(`/api/fetchPinnedPRs/?username=${username}`);
        const data = await res.json();
        setIsPinnedToShowInPinnedSection(data.isPinnedToShowInPinnedSection);
      } catch (error) {
        console.log('Failed to fetch Pinned PRs: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPinnedPRs();
  }, [username, setIsPinnedToShowInPinnedSection]);

  if (loading) return <PinnedReposSkeleton />;

  return (
    <div className="w-full px-4 sm:px-8 pt-2 pb-3 border rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-2">
        <PiPushPinSlashFill className="text-blue-400" />
        Pinned PRs
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isPinnedToShowInPinnedSection.length > 0 ? (
          isPinnedToShowInPinnedSection.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 bg-gray-50 px-4 py-2 rounded-xl shadow-sm flex items-center justify-between hover:scale-[1.02] transition duration-200"
            >
              <div className="truncate text-sm text-gray-700 dark:text-gray-300 max-w-[85%]">
                {item.name}
              </div>
              <Link href={item.link} target="_blank">
                <FaExternalLinkAlt className="text-blue-400 hover:scale-110 transition-transform duration-200" />
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-2 text-center">No pinned pull requests</p>
        )}
      </div>
    </div>
  );
};

export default PinnedPRs;
