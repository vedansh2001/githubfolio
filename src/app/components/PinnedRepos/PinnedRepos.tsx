import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { PiPushPinSlashFill } from "react-icons/pi";

interface Repository {
  id: number;
  name: string;
  link: string;
}
interface usernameprop {
  username: string;
}

const PinnedRepos: React.FC<usernameprop> = ({ username }) => {
  const [fetchedPinnedRepos, setFetchedPinnedRepos] = useState<Repository[]>([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch(`api/fetchPinnedRepos/?username=${username}`, {
          method: "GET",
          cache: 'no-store'
        });
        const data = await res.json();

        setFetchedPinnedRepos(data.isPinnedToShowInPinnedSection);
      } catch (error) {
        console.log("error: ", error);
      }
    };
    fetchdata();
  }, []);

  return (
    <div className="h-[38%] bg-gray-300">
      <p className="ml-[10%] pb-1 flex items-center gap-1 font-semibold">
      <PiPushPinSlashFill className="text-gray-600" /> 
        Pinned Repos
      </p>
      <div className="w-[80%] ml-[10%] bg-gray-300 h-[80%] border-2 p-4 border-black rounded-sm shadow-md grid grid-cols-2 gap-4">
        {fetchedPinnedRepos?.length > 0 ? (
          fetchedPinnedRepos?.map((repo) => (
            <div
              key={repo.id}
              className="border-2 border-gray-700 p-2 flex items-center justify-between cursor-pointer truncate"
            >
              <div className="bg-gray-300 truncate max-w-[90%] text-gray-600 hover:opacity-70 hover:scale-110 transition duration-300">
                {repo.name}
              </div>
              <div>
                <Link href={repo.link}>
                  <FaExternalLinkAlt className="text-blue-600 hover:opacity-70 hover:scale-125 transition duration-200" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-2 text-center">
            No pinned repositories
          </p>
        )}
      </div>
    </div>
  );
};

export default PinnedRepos;
