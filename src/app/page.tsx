"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PinnedRepos from "./components/PinnedRepos/PinnedRepos";
import PinnedPRs from "./components/PinnedPRs/PinnedPRs";
import FabarComponent from "./components/FabarComponent/FabarComponet";
import SocialIcons from "./components/SocialIcons/SocialIcons";

import { IoLocation } from "react-icons/io5";
import { RiGitRepositoryFill, RiUserFollowFill } from "react-icons/ri";
import { LuDot } from "react-icons/lu";


export default function Home() {


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
  const [isLoggedIn, setIsloggedIn] = useState(false);

    

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
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
  }, []);
  

   


 
  return (
    <div className=" h-screen bg-gray-300" >

      <FabarComponent barisopen={barisopen} setBarisopen={setBarisopen} isLoggedIn={isLoggedIn} />


      <div className="h-[90%] bg-gray-300 flex justify-between w-[80%] p-4 mx-[10%] border-2 border-dashed border-black" >
        <div className="bg-gray-300 ">



        <div className="flex gap-4 mb-5 border-dashed border-gray-700 border-2 p-4">
    <div className="flex items-center justify-center">
      {userdata.imageURL ? (
        <Image
          src={userdata.imageURL}
          alt="GitHub Avatar"
          className="rounded-full"
          width={110}
          height={110}
          priority
        />
      ) : (
        <div
          className="rounded-full bg-gray-400"
          style={{ width: 110, height: 110 }}
        />
      )}
    </div>


    <div>
      <div className="flex justify-start items-center font-semibold text-2xl ml-1">
        {userdata.name || "Anonymous"}
      </div>
      <div className="flex justify-start items-center text-md ml-1">
        {userdata.bio || "No bio available"}
      </div>
      <div className="flex justify-start items-center text-md">
        <IoLocation className="mr-1" />
        {userdata.location || "Location not specified"}
      </div>
      <div className="flex items-center text-md">
        <RiUserFollowFill className="mr-1" />
        {userdata.followers} Followers
        <LuDot />
        {userdata.following} Following
      </div>
      <div className="flex justify-start items-center text-md">
        <RiGitRepositoryFill className="mr-1" />
        Public repos: {userdata.publicRepos}
      </div>
    </div>
</div>




         <div className="bg-gray-300 border-dashed border-gray-700 border-2 p-3 text-xl mb-2">
            {/* GitHub Stats Graph */}
            {userdata.githubUsername && (
              <Image
                src={`https://github-readme-stats.vercel.app/api?username=${userdata.githubUsername}&hide_title=false&hide_rank=false&show_icons=true&include_all_commits=true&count_private=true&disable_animations=false&theme=dracula&locale=en&hide_border=false&border_color=000000&text_color=000000&bg_color=D1D5DB&icon_color=000000&hide=contribs`}
                height={150}
                width={500}
                className="mb-1"
                alt="Stats Graph"
                unoptimized
                priority
              />
            )}

            {/* GitHub Languages Graph */}
            {userdata.githubUsername && (
              <Image
                src={`https://github-readme-stats.vercel.app/api/top-langs?username=${userdata.githubUsername}&locale=en&hide_title=false&layout=compact&card_width=320&langs_count=5&theme=dracula&hide_border=false&border_color=000000&text_color=000000&bg_color=D1D5DB&icon_color=000000`}
                height={150}
                width={500}
                alt="Languages Graph"
                unoptimized
                priority
              />
            )}
          </div>



            
        </div>


        <div className="border-gray-700 border-2 border-dashed ml-4">


              <div className='h-[90%] bg-gray-300 w-[600px] pt-5' >

                 <PinnedPRs/>

                  <div className='w-[80%] ml-[10%] flex -mt-2 justify-end'>
                    <Link 
                      className='bg-green-500 border-2 border-black rounded-sm px-3 py-1'
                      href="/pullrequests"
                    >
                      More
                    </Link>
                  </div>


                 <PinnedRepos />

                  <div className='w-[80%] ml-[10%] flex justify-end -mt-2'>
                    <Link 
                      className='bg-green-500 border-2 border-black rounded-sm px-3 py-1' 
                      href="/repositories"
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
