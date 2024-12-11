"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PinnedRepos from "./components/PinnedRepos/PinnedRepos";
import PinnedPRs from "./components/PinnedPRs/PinnedPRs";

import { FaFacebook, FaLink, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";
import { RiGitRepositoryFill, RiUserFollowFill } from "react-icons/ri";
import { LuDot } from "react-icons/lu";
import FabarComponent from "./components/FabarComponent/FabarComponet";

export default function Home() {

  const [userdata, setUserdata] = useState({})
  const[img_URL, setImg_URL] = useState("")
  const username = "vedansh2001";
  const [barisopen, setBarisopen] = useState(false)
  const [isLoggedIn, setIsloggedIn] = useState(true);

    

 useEffect(() => {
      const fetchdata = async () => {
        const username = "vedansh2001"
      
        try {
          const res = await fetch(`https://api.github.com/users/${username}`)
          const data = await res.json();
          setImg_URL(data.avatar_url)
          console.log(data);
          setUserdata(data)
          
        } catch (error) {
          console.log("Error: ", error);    
        }
      }
      fetchdata()
  },[])

   
  const TotalRepos = userdata.public_repos;
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = "Check out this amazing website!"; // Replace with your text


 
  return (
    <div className=" h-screen bg-gray-300" >

      <FabarComponent barisopen={barisopen} setBarisopen={setBarisopen} isLoggedIn={isLoggedIn} />


      {/* <div className="h-[18%] bg-gray-300 flex pl-[10%]" >

          <div className="w-[60%] flex justify-start items-center" >
              <div className="bg-gray-300" >

                    <div className="flex gap-4">
                        <div className="" >
                          <Image src={img_URL} alt="GitHub Avatar" className="rounded-full" width={110} height={110} />
                            
                        </div>
                        <div className="">
                            <div className="flex justify-start items-center font-semibold text-2xl ml-1" >
                            {userdata.name}
                            </div>
                            <div className="flex justify-start items-center text-md ml-1" >
                              {userdata.bio} 
                            </div>
                            <div className="flex justify-start items-center text-md" >
                            <IoLocation className="mr-1" /> 
                            {userdata.location}
                            </div>
                            <div className="flex items-center text-md" >
                            <RiUserFollowFill className="mr-1" /> {userdata.followers} Followers<LuDot />{userdata.following}  Following
                            </div>
                        </div>
                    </div>

                    

              </div>
          </div>

        <div className="w-[30%] flex justify-end items-end bg-gray-300 pb-4" >
                <div className="bg-green-500 border-black border-2 px-3 py-1 mr-3 rounded-[3px] text-xl font-semi-bold" >
                <Link href="../pullrequests"> Edit PRs</Link>
                </div>

                <div className="bg-green-500 border-black border-2 px-3 py-1 mr-4 rounded-[3px] text-xl font-semi-bold" >
                <Link href="../repositories"> Edit Repos</Link>
                </div>
        </div>

      </div> */}

      <div className="h-[90%] bg-gray-300 flex justify-between w-[80%] p-4 mx-[10%] border-2 border-dashed border-black" >
        <div className="bg-gray-300 ">





          <div className="flex gap-4 mb-5 border-dashed border-gray-700 border-2 p-4">
                        <div className="flex items-center justify-center" >
                          <Image src={img_URL} alt="GitHub Avatar" className="rounded-full" width={110} height={110} />
                            
                        </div>
                        <div className="">
                            <div className="flex justify-start items-center font-semibold text-2xl ml-1" >
                            {userdata.name}
                            </div>
                            <div className="flex justify-start items-center text-md ml-1" >
                              {userdata.bio} 
                            </div>
                            <div className="flex justify-start items-center text-md" >
                            <IoLocation className="mr-1" /> 
                            {userdata.location}
                            </div>
                            <div className="flex items-center text-md" >
                            <RiUserFollowFill className="mr-1" /> {userdata.followers} Followers<LuDot />{userdata.following}  Following
                            </div>
                            <div className="flex justify-start items-center text-md" >
                              <RiGitRepositoryFill className="mr-1" />
                              Public repos: {TotalRepos}
                            </div>
                        </div>
          </div>







         <div className="bg-gray-300 border-dashed border-gray-700 border-2 p-3 text-xl mb-2">
            {/* GitHub Stats Graph */}
            {username && (
              <Image
                src={`https://github-readme-stats.vercel.app/api?username=${username}&hide_title=false&hide_rank=false&show_icons=true&include_all_commits=true&count_private=true&disable_animations=false&theme=dracula&locale=en&hide_border=false&border_color=000000&text_color=000000&bg_color=D1D5DB&icon_color=000000&hide=contribs`}
                height={150}
                width={500}
                className="mb-1"
                alt="Stats Graph"
                unoptimized
              />
            )}

            {/* GitHub Languages Graph */}
            {username && (
              <Image
                src={`https://github-readme-stats.vercel.app/api/top-langs?username=${username}&locale=en&hide_title=false&layout=compact&card_width=320&langs_count=5&theme=dracula&hide_border=false&border_color=000000&text_color=000000&bg_color=D1D5DB&icon_color=000000`}
                height={150}
                width={500}
                alt="Languages Graph"
                unoptimized
              />
            )}
          </div>



            
        </div>


        <div className="border-gray-700 border-2 border-dashed ml-4">


              <div className='h-[90%] bg-gray-300 w-[600px] pt-5' >

                 <PinnedPRs/>

                  <div className='w-[80%] ml-[10%] flex -mt-5 justify-end'>
                    <Link 
                      className='bg-green-500 border-2 border-black rounded-sm px-3 py-1'
                      href="/pullrequests"
                    >
                      More
                    </Link>
                  </div>


                 <PinnedRepos TotalRepos={TotalRepos} />

                  <div className='w-[80%] ml-[10%] flex justify-end -mt-5'>
                    <Link 
                      className='bg-green-500 border-2 border-black rounded-sm px-3 py-1' 
                      href="/repositories"
                    >
                      More
                    </Link>
                  </div>

                  <div className="bg-gray-300 border-dashed border-gray-700 border-2 p-3 text-xl mt-6 w-[80%] ml-[10%]" >
              <p className="font-bold text-gray-800 text-2xl flex items-center justify-center mb-4" >Share on socials</p>           
              <div className="flex justify-between px-[20%] pt-2" >
              <button
                    className="text-blue-600 text-4xl"
                    onClick={() =>
                      window.open(`https://www.linkedin.com/shareArticle?url=${url}`, "_blank")
                    }
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedin />
              </button>
              <button
                    className="text-black text-4xl"
                    onClick={() =>
                      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank")
                    }
                    aria-label="Share on Twitter"
                  >
                    <FaXTwitter />
              </button>
                  <button
                    className="text-blue-700 text-4xl"
                    onClick={() =>
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")
                    }
                    aria-label="Share on Facebook"
                  >
                    <FaFacebook />
              </button>
              <button
                    className="text-gray-700 text-4xl"
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                      alert("Link copied to clipboard!");
                    }}
                    aria-label="Copy Link"
                  >
                    <FaLink />
              </button>
              </div>
                  </div>

              </div>


          </div>
      </div>
    </div>
  );
}
