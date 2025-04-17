import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { PiPushPinSlashFill } from "react-icons/pi";
import PinnedReposSkeleton from "./PinnedReposSkeleton";
import { useSession } from "next-auth/react";

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
  const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch(`api/fetchPinnedRepos/?username=${username}`, {
          method: "GET",
          cache: 'no-store',
        });
        const data = await res.json();
        setFetchedPinnedRepos(data.isPinnedToShowInPinnedSection);
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, [username]);

  if (loading) return <PinnedReposSkeleton />;

  return (
    <div className="w-full px-4 sm:px-8 pt-2 pb-3 border rounded-2xl shadow-sm">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800 mb-2">
        <PiPushPinSlashFill className="text-blue-400" />
        Pinned Repos
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fetchedPinnedRepos?.length > 0 ? (
          fetchedPinnedRepos?.map((repo) => (
            <div
              key={repo.id}
              className="border border-gray-200 bg-gray-50 px-4 py-2 rounded-xl shadow-sm flex items-center justify-between hover:scale-[1.02] transition duration-200"
            >
              <div className="truncate text-sm text-gray-700 dark:text-gray-300 max-w-[85%]">
                {repo.name}
              </div>
              <Link href={repo.link} target="_blank">
                <FaExternalLinkAlt className="text-blue-400 hover:scale-110 transition-transform duration-200" />
              </Link>
            </div>
          ))
        ) : (
          session?.user ? (
            <p className="text-gray-500 col-span-2 text-center">No pinned repositories. Click on the button and start pinning your Repositories</p>
          ) : (
          <p className="text-gray-500 col-span-2 text-center">The user has no pinned Repositories</p>
          )
       )}
      </div>
    </div>
  );
};

export default PinnedRepos;
