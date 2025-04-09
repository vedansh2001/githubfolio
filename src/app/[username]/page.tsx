"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoLocation } from "react-icons/io5";
import { RiGitRepositoryFill, RiUserFollowFill } from "react-icons/ri";
import { LuDot } from "react-icons/lu";
import FabarComponent from "../components/FabarComponent/FabarComponet";
import PinnedPRs from "../components/PinnedPRs/PinnedPRs";
import PinnedRepos from "../components/PinnedRepos/PinnedRepos";
import SocialIcons from "../components/SocialIcons/SocialIcons";
import { FaAt } from "react-icons/fa";

interface UserPageProps {
    params: { username: string };
  }
  
export default function Home({ params }: UserPageProps) {

  const { username } = params;


  type UserData = {
    imageURL: string;
    name: string;
    bio: string;
    location: string;
    followers: number;
    following: number;
    publicRepos: number;
    githubUsername?: string; // Optional if it might be missing
  };
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
  
  const [userdata, setUserdata] = useState<UserData>({
    imageURL: "",
    name: "",
    bio: "",
    location: "",
    followers: 0,
    following: 0,
    publicRepos: 0,
  });
  
  const [barisopen, setBarisopen] = useState(false)
  const [userId, setUserId] = useState<number>(0);
  const [isPinnedToShowInPinnedSection, setIsPinnedToShowInPinnedSection] = useState<PR[]>([]);
  // const [expanded, setExpanded] = useState(false);
  // const maxChars = 80;

  
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch(`/api/user/?username=${username}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          });
        const data = await res.json();
        setUserId(data.user.id)
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
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchdata();

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
    fetchPinnedPRs();
  }, []);

 
  return (
    <div className=" h-screen bg-gray-300" >

      <FabarComponent barisopen={barisopen} setBarisopen={setBarisopen}  />


      <div className="h-[92%] bg-gray-300 flex justify-between w-[80%] p-4 py-2 mx-[10%] border-2 border-dashed border-black" >
        <div className="bg-gray-300 ">



        <div className="bg-gray-300 shadow-md rounded-sm border border-1 border-black p-5 py-3 mb-2 w-[100%] mx-auto">
            <div className="flex gap-6 mb-3">
              {/* Profile Image */}
              <div className="flex items-center justify-center w-[25%]">
                {userdata.imageURL ? (
                  <div className="border border-black rounded-full" >
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

              {/* User Details */}
              <div className="w-[75%] font-semibold text-gray-800">
                {/* Name */}
                <div className="text-2xl font-bold">{userdata.name || "Anonymous"}</div>

                {/* GitHub Username */}
                <div className="flex items-center text-md text-gray-600">
                  <FaAt className="text-gray-500" />
                  <span>{userdata.githubUsername}</span>
                </div>

                {/* Location */}
                <div className="flex items-center text-md text-gray-700">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 mr-2">
                    <IoLocation className="text-black"/>
                  </div>
                  {userdata.location || "Location not specified"}
                </div>

                {/* Followers & Following */}
                <div className="flex items-center text-md text-gray-700">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 mr-2">
                    <RiUserFollowFill className="text-black" />
                  </div>
                  {userdata.followers} Followers
                  <LuDot className="text-gray-500 mx-2" />
                  {userdata.following} Following
                </div>

                {/* Public Repositories */}
                <div className="flex items-center text-md text-gray-700">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 mr-2">
                    <RiGitRepositoryFill className="text-black" />
                  </div>
                  Public repos: {userdata.publicRepos}
                </div>

              </div>
            </div>

            {/* Bio Section */}
            <div className="text-gray-700 leading-relaxed ">
              {userdata.bio}
            </div>
        </div>





         <div className="bg-gray-300 border-gray-700 text-xl mb-2 shadow-md rounded-md">
            {/* GitHub Stats Graph */}
            {username && (
              <Image
                src={`https://github-readme-stats.vercel.app/api?username=${username}&custom_title=${encodeURIComponent("My GitHub Stats")}&title_color=4B5563&hide_title=false&rank_icon=github&show_icons=true&include_all_commits=true&count_private=true&disable_animations=false&theme=dracula&locale=en&hide_border=false&border_color=000000&border_width=2&text_color=000000&bg_color=D1D5DB&ring_color=16A34A&icon_color=000000&hide=contribs`}
                height={150}
                width={500}
                className="mb-2"
                alt="Stats Graph"
                unoptimized
                priority
              />
            )}


            {/* GitHub Languages Graph */}
            <Image
              src={`https://github-readme-stats.vercel.app/api/top-langs?username=${username}&title_color=4B5563&bar_color=16A34A&locale=en&hide_title=false&layout=compact&card_width=320&langs_count=5&theme=dracula&hide_border=false&border_color=000000&text_color=000000&bg_color=D1D5DB&icon_color=000000`}
              height={150}
              width={500}
              alt="Languages Graph"
              unoptimized
              priority
            />

          </div>



            
        </div>


        <div className="border-gray-700 border-2 border-dashed ml-4">


              <div className='h-[90%] bg-gray-300 w-[600px] pt-5 pb-6' >

                 
                 {userId !== 0 && <PinnedPRs 
                 setIsPinnedToShowInPinnedSection={setIsPinnedToShowInPinnedSection}
                 isPinnedToShowInPinnedSection={isPinnedToShowInPinnedSection}
                 username={username}
                 />}


                <div className="w-[80%] ml-[10%] flex -mt-2 justify-end">
                  <Link 
                    className="bg-gradient-to-r from-green-500 to-green-600 border-2 border-black text-white font-semibold rounded-md px-4 py-[6px] shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out"
                    href={`/pullrequests?username=${username}&userId=${userId}`}
                  >
                    More
                  </Link>
                </div>



                 <PinnedRepos username={username}/>

                  <div className='w-[80%] ml-[10%] flex justify-end -mt-2'>
                  <Link
                    className="bg-gradient-to-r from-green-500 to-green-600 border-2 border-black text-white font-semibold rounded-md px-4 py-[6px] shadow-md hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out"
                    href={`/repositories?username=${username}`}
                    >
                    More
                  </Link>
                  </div>

                  <SocialIcons/>


              </div>


          </div>
      </div>
    </div>
  );
}
