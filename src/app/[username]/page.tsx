"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoLocation } from "react-icons/io5";
import { RiGitRepositoryFill, RiUserFollowFill } from "react-icons/ri";
import { LuDot } from "react-icons/lu";
import { FaAt } from "react-icons/fa";
import FabarComponent from "../components/FabarComponent/FabarComponet";
import PinnedPRs from "../components/PinnedPRs/PinnedPRs";
import PinnedRepos from "../components/PinnedRepos/PinnedRepos";
import SocialIcons from "../components/SocialIcons/SocialIcons";
import AIReviewCard from "../components/AIReviewCard/AIReviewCard";
import PendingAIReviewCard from "../components/PendingAIReviewCard/PendingAIReviewCard";
import AIReviewCardSkeleton from "../components/AIReviewCard/AIReviewCardSkeleton";
import UserCardSkeleton from "../components/skeletons/UserCardSkeleton";
import GitHubStatsSkeleton from "../components/skeletons/GitHubStatsSkeleton ";
import SocialIconsSkeleton from "../components/skeletons/SocialIconsSkeleton";

interface UserPageProps {
  params: { username: string };
}

type UserData = {
  imageURL: string;
  name: string;
  bio: string;
  location: string;
  followers: number;
  following: number;
  publicRepos: number;
  githubUsername?: string;
};

interface AIReviewData {
    overallRating: number;
    codeQualityRating: number;
    securityRating: number;
    documentationRating: number;
    summary: string;
    strengths: string[];
    improvementAreas: string[];
}
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

export default function Home({ params }: UserPageProps) {
  const { username } = params;
  

  const [userdata, setUserdata] = useState<UserData>({
    imageURL: "",
    name: "",
    bio: "",
    location: "",
    followers: 0,
    following: 0,
    publicRepos: 0,
  });

  const [userId, setUserId] = useState<number>(0);
  const [barisopen, setBarisopen] = useState(false);

  const [aiReview, setAiReview] = useState<AIReviewData | null>(null);
  const [isSkeletonLoading, setSkeletonLoading] = useState<boolean>(true);
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  const [isPinnedToShowInPinnedSection, setIsPinnedToShowInPinnedSection] = useState<PR[]>([]);
  const [isInvalidUser, setIsInvalidUser] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user/?username=${username}`);
  
        if (!res.ok) {
          // Fallback: Fetch from GitHub directly
          const githubRes = await fetch(`https://api.github.com/users/${username}`);
          if (!githubRes.ok) {
            setIsInvalidUser(true);
            return;
          }
          const githubData = await githubRes.json();
          setUserdata({
            imageURL: githubData.avatar_url || "",
            name: githubData.name || githubData.login || "Anonymous",
            bio: githubData.bio || "",
            location: githubData.location || "Location not specified",
            followers: githubData.followers || 0,
            following: githubData.following || 0,
            publicRepos: githubData.public_repos || 0,
            githubUsername: githubData.login,
          });
          return;
        }
  
        const data = await res.json();
        setUserId(data.user.id);
        setUserdata({
          imageURL: data.user.imageURL,
          name: data.user.name,
          bio: data.user.bio,
          location: data.user.location,
          followers: data.user.followers,
          following: data.user.following,
          publicRepos: data.user.publicRepos,
          githubUsername: data.user.githubUsername,
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setIsInvalidUser(true);
      } finally {
        setIsUserDataLoading(false);
      }
    };
  
    const fetchAIReview = async () => {
      try {
        setSkeletonLoading(true);
        const res = await fetch(`/api/aiAnalizerData?githubUsername=${username}`);
        const result = await res.json();
        if (result.aiReview.overallEvaluation) setAiReview(result?.aiReview?.overallEvaluation);
        console.log("this is the ai review", result.aiReview);
      } catch (err) {
        console.error("Error fetching AI review:", err);
      } finally {
        setSkeletonLoading(false);
      }
    };
  
    fetchUserData();
    fetchAIReview();
  }, [username]);
  

  if (isInvalidUser && !isUserDataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white px-4">
        {/* <Image
          src="/github-404.png" // Add your own illustration or just text
          alt="User Not Found"
          width={200}
          height={200}
          className="mb-6"
        /> */}
        <h1 className="text-3xl font-bold mb-2">User not found</h1>
        <p className="text-lg text-center max-w-md mb-4">
          Sorry, the GitHub user <span className="font-semibold">{username}</span> does not exist or could not be found.
        </p>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go back to home
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <FabarComponent barisopen={barisopen} setBarisopen={setBarisopen} />

      <div className="flex flex-col lg:flex-row justify-between gap-2 w-full max-w-7xl mx-auto px-4 pt-6">
        {/* Left Section */}
        <div className="flex-1">
          {/* User Card */}
          {isUserDataLoading ? <UserCardSkeleton /> : (

          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-md border border-gray-300 dark:border-gray-700 p-6 mb-2 w-full">
            <div className="flex flex-col sm:flex-row gap-6 mb-4">
              {/* Avatar */}
              <div className="flex items-center justify-center sm:w-1/3">
                {userdata.imageURL ? (
                  <div className="border border-black rounded-full">
                    <Image
                      src={userdata.imageURL}
                      alt="GitHub Avatar"
                      className="border-[3px] rounded-full border-gray-400 shadow-md"
                      width={110}
                      height={110}
                      priority
                    />
                  </div>
                ) : (
                  <div className="rounded-full bg-gray-400 w-[110px] h-[110px] border border-gray-300" />
                )}
              </div>

              {/* Details */}
              <div className="sm:w-2/3 font-semibold">
                <div className="text-2xl font-bold">{userdata.name || "Anonymous"}</div>
                <div className="flex items-center text-sm mt-1">
                  <FaAt className="mr-2 text-gray-500" />
                  {userdata.githubUsername}
                </div>
                <div className="flex items-center text-sm mt-1">
                  <IoLocation className="mr-2 text-black bg-gray-200 rounded-full w-5 h-5 p-1" />
                  {userdata.location || "Location not specified"}
                </div>
                <div className="flex items-center text-sm mt-1">
                  <RiUserFollowFill className="mr-2 text-black bg-gray-200 rounded-full w-5 h-5 p-1" />
                  {userdata.followers} Followers <LuDot className="mx-2" /> {userdata.following} Following
                </div>
                <div className="flex items-center text-sm mt-1">
                  <RiGitRepositoryFill className="mr-2 text-black bg-gray-200 rounded-full w-5 h-5 p-1" />
                  Public repos: {userdata.publicRepos}
                </div>
              </div>
            </div>

            <div className="text-sm leading-relaxed">{userdata.bio}</div>
          </div>
          )}

          {/* Stats + AI Review */}
          <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-md rounded-md p-4 mb-4">


            {isSkeletonLoading ? (
              <AIReviewCardSkeleton />
            ) : aiReview ? (
              <AIReviewCard data={aiReview} username={username}/>
            ) : (
              <PendingAIReviewCard username={username}/>
            )}

            {isUserDataLoading ? (
                <SocialIconsSkeleton />
              ) : (
                <SocialIcons />
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 border border-gray-300 shadow-md dark:border-gray-700 p-4 pt-6 mb-4 rounded-md bg-white dark:bg-gray-800">
          <div className="space-y-4">
            {/* {userId !== 0 && (
              <PinnedPRs username={username}/>
            )} */}
            <PinnedPRs username={username} 
            isPinnedToShowInPinnedSection={isPinnedToShowInPinnedSection}
            setIsPinnedToShowInPinnedSection={setIsPinnedToShowInPinnedSection}
            />

            {isUserDataLoading? (
              <div className="flex justify-end pr-10">
              <div
                className="bg-blue-50 text-blue-50 font-semibold rounded-md px-4 py-2 shadow-md hover:scale-105 transition-transform duration-300"
              >
                More
              </div>
            </div>
            ) : (
              <div className="flex justify-end pr-10">
                <Link
                  className="bg-blue-300 border border-black text-white font-semibold rounded-md px-4 py-2 shadow-md hover:scale-105 transition-transform duration-300"
                  href={`/pullrequests?username=${username}&userId=${userId}`}
                >
                  More
                </Link>
              </div>
            )}

            <PinnedRepos username={username} />

            {isUserDataLoading? (
              <div className="flex justify-end pr-10">
              <div
                className="bg-blue-50 text-blue-50 font-semibold rounded-md px-4 py-2 shadow-md hover:scale-105 transition-transform duration-300"
              >
                More
              </div>
            </div>
            ) : (
              <div className="flex justify-end pr-10">
              <Link
                className="bg-blue-300 border border-black text-white font-semibold rounded-md px-4 py-2 shadow-md hover:scale-105 transition-transform duration-300"
                href={`/repositories?username=${username}`}
              >
                More
              </Link>
            </div>
            )}

            {/* <SocialIcons /> */}
            {username ? (
              isUserDataLoading ? (
                <GitHubStatsSkeleton />
              ) : (
                <div className="flex justify-center w-full">
                  <Image
                    src={`https://github-readme-stats.vercel.app/api?username=${username}&custom_title=${encodeURIComponent("My GitHub Stats")}&title_color=4B5563&hide_title=false&rank_icon=github&show_icons=true&include_all_commits=true&count_private=true&disable_animations=false&theme=dracula&locale=en&hide_border=false&border_color=E5E7EB&border_width=2&text_color=374151&bg_color=ffffff&ring_color=2563EB&icon_color=000000&hide=contribs`}
                    height={180}
                    width={700}
                    className="h-40 max-w-[700px] w-full mt-6"
                    alt="Stats Graph"
                    unoptimized
                    priority
                  />
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
