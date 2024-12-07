"use client"

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

//////////////////
// import PinnedSection from '../components/PinnedSection/PinnedSection';
// import ShowcaseSelectedPR from '../components/ShowcaseSelectedPR/ShowcaseSelectedPR';
// import SelectPRsToAdd from '../components/SelectPRsToAdd/SelectPRsToAdd';
import PinnedSection from "./components/PinnedPRs/PinnedPRs";
import PinnedRepos from "./components/PinnedRepos/PinnedRepos";
import PinnedPRs from "./components/PinnedPRs/PinnedPRs";
/////////////////////////////////

export default function Home() {

  const [userdata, setUserdata] = useState({})
  const[img_URL, setImg_URL] = useState("")

    

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


 
  return (
    <div className=" h-screen" >
      <div className="h-[20%] bg-gray-500 flex justify-center items-center" >
        <div className="bg-gray-100" >
          <div className="flex gap-4">
            <div className="" >
              <Image src={img_URL} alt="GitHub Avatar" className="rounded-full" width={65} height={65} />
            </div>
            <div className="flex justify-center items-center" >
              {userdata.login}
            </div>
          </div>
          <div className="flex justify-center items-center" >
            {userdata.bio} 
          </div>
        </div>

      </div>

      <div className="flex justify-end bg-gray-500 pr-[5%] pb-2" >
        <div className="bg-green-500 border-black border-2 px-3 py-1 mr-1 rounded-[3px] text-xl font-semi-bold" >
        <Link href="../pullrequests"> Edit PRs</Link>
        </div>

        <div className="bg-green-500 border-black border-2 px-3 py-1 rounded-[3px] text-xl font-semi-bold" >
        <Link href="../repositories"> Edit Repos</Link>
        </div>
      </div>

      <div className="h-[80%] bg-gray-300 flex items-center justify-between w-[90%] ml-[5%]" >
        <div className="">
          <div className="h-[70%] bg-slate-100 text-xl">
            <p>Name: {userdata.name}</p>
            <p>location: {userdata.location}</p>
            <p>Followers: {userdata.followers}</p>
            <p>Following: {userdata.following}</p>
            <p>no. of public repositories: {userdata.public_repos}</p>
          </div>
          <div className="h-[30%] bg-slate-200">
          </div>
        </div>


        <div className="h-[100%]">
          <div className="" >
          {/* <Link href="/repositories">
            <div className="border-2 rounded border-black px-8 py-5 text-4xl mb-2" >Repositories</div>
          </Link>
          <Link href="/pullrequests">
            <div className="border-2 rounded border-black px-8 py-5 text-4xl mt-2" >Pull Requests</div>
          </Link> */}

          





              <div className='h-[100%] bg-gray-200 w-[600px]' >

              {/* pinned section present on the top ..............................................................*/}
              <PinnedPRs/>


              {/* button to add select PR to be added  ...........................................................*/}
              <div className='w-[80%] ml-[10%] my-6 flex justify-end'>
                <Link 
                  className='bg-green-500 border-2 border-black rounded-sm px-3 py-1'
                  href="/pullrequests"
                >
                  Detail
                </Link>
              </div>


              <PinnedRepos/>

              {/* button to add select PR to be added  ...........................................................*/}
              <div className='w-[80%] ml-[10%] my-6 flex justify-end'>
                <Link 
                  className='bg-green-500 border-2 border-black rounded-sm px-3 py-1' 
                  href="/repositories"
                >
                  Detail
                </Link>
              </div>

              </div>

















          </div>
        </div>
      </div>
    </div>
  );
}
