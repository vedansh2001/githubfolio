import Link from "next/link";
import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { PiPushPinSlashFill } from "react-icons/pi";

interface Repository {
  id: number;
  name: string;
  link: string;
}

const PinnedRepos = () => {
  const [fetchedPinnedRepos, setFetchedPinnedRepos] = useState<Repository[]>([]);

    const fetchdata = async () => {
      try {
        const res = await fetch("api/fetchPinnedRepos", {
          method: "GET",
        });
        const data = await res.json();
        setFetchedPinnedRepos(data.isPinnedToShowInPinnedSection);
      } catch (error) {
        console.log("error: ", error);
      }
    };
    fetchdata();

  return (
    <div className="h-[38%] bg-gray-300">
      <p className="ml-[10%] pb-1 flex items-center gap-1">
        <PiPushPinSlashFill /> Pinned Repos
      </p>
      <div className="w-[80%] ml-[10%] bg-gray-300 h-[80%] border-2 p-4 border-black rounded-sm grid grid-cols-2 gap-4">
        {fetchedPinnedRepos?.length > 0 ? (
          fetchedPinnedRepos?.map((repo) => (
            <div
              key={repo.id}
              className="border-2 border-gray-700 p-2 flex items-center justify-between cursor-pointer"
            >
              <div className="bg-gray-300 truncate max-w-[90%]">
                {repo.name}
              </div>
              <div>
                <Link href={repo.link}>
                  <FaExternalLinkAlt className="hover:text-blue-500" />
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
