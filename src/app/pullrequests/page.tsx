"use client"

import React, { useEffect, useState } from 'react'

const pullrequest = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [isdropdownRepo, setIsdropdownRepo] = useState(false);  
  const [isdropdownPR, setIsdropdownPR] = useState(false);
  const [repos, setRepos] = useState([])
  const [reposPR, setReposPR] = useState([])
  const [selectingRepo, setSelectingRepo] = useState("")
  const [selectedRepo, setSelectedRepo] = useState("Select repository...")
  const [selectedPR, setSelectedPR] = useState("Select pull request...")
  const [owner, setowner] = useState("")
  const [addedPRs, setAddedPRs] = useState([])


  const username = "vedansh2001"

  const handleAddPRPlus = () => {
    setIsOpen(!isOpen)
  }
  const handleCrossAddPR = () => {
    setIsOpen(!isOpen)
  }
  const handleDropDownofRepo = () => {
    setIsdropdownRepo(!isdropdownRepo)
  }
  const handleDropDownofRepoPR = () => {
    setIsdropdownPR(!isdropdownPR)
  }
  const handleToSelectRepo = (name) => {
    setSelectingRepo(name)
    setSelectedRepo(name)
    setIsdropdownRepo(!isdropdownRepo)
    fetchdataforPR(name)
  }
  const handleToSelectPR = (title) => {
    setSelectedPR(title)
    setIsdropdownPR(!isdropdownPR)
  }
  const handleAddPR = () => {
    addedPRs.push(selectedPR)
    setIsOpen(!isOpen)
    
  }

  useEffect(() => {
  const fetchdata = async () => {
    try {
      const res = await fetch(`https://api.github.com/users/${username}/repos`)
      const data = await res.json();
      const RepoNameExtracted = data.map(item => item.name)
      setRepos(RepoNameExtracted)
      
    } catch (error) {
      console.log("error: ", error);      
    }
  }
  fetchdata()
  },[])



    const fetchdataforPR = async (name) => {
    try {
    const fetchOwnerName = await fetch(`https://api.github.com/repos/${username}/${name}`)
    const ownerdata = await fetchOwnerName.json();

    let full_name;

    if(ownerdata.fork){
      full_name = ownerdata.parent?.full_name;
    } else{
      full_name = ownerdata.full_name;
    }
    
    if(full_name){
    fetchdataforPR2(full_name) 
    }
    } catch (error) {
      console.log("error: ", error)
    }
   }

   const fetchdataforPR2 = async (full_name) => {
    try {
      const fetchPRdata = await fetch(`https://api.github.com/search/issues?q=type:pr+author:${username}+repo:${full_name}`)
    const PRdata = await fetchPRdata.json();

    const PRlist = PRdata.items.map(item => item.title)
    setReposPR(PRlist)
    console.log(PRlist)
    } catch (error) {
      console.log("error: ", error)
    }
   }



  return (
    <div className='h-screen bg-gray-200' >
      <div className='h-[45%] bg-gray-200' >
        <p className='ml-[10%] pt-8' >Pinned</p>
        <div className='w-[80%] ml-[10%] bg-gray-300 h-[80%] border-2 p-4 border-black rounded-sm grid grid-cols-2 gap-4' >
          <div className='border-2 border-gray-700' >Box 1</div>
          <div className='border-2 border-gray-700' >Box 2</div>
          <div className='border-2 border-gray-700' >Box 3</div>
          <div className='border-2 border-gray-700' >Box 4</div>
        </div>

      </div>

      <div className='w-[80%] ml-[10%] my-6 flex justify-end'>
        <button 
        className='bg-green-500 border-2 border-black rounded-sm px-3 py-1' 
        onClick={handleAddPRPlus}
        >
          Add PR +
        </button>
      </div>

    {addedPRs.map((title, index) => (
      <div 
      className='w-[70%] h-[60px] ml-[15%] border-2 mb-4 border-black rounded-sm flex justify-between px-4' 
      key={index}
      >
        <div>
          <p className='text-sm text-sky-600' >Repository name</p>
          <p>{title}</p>
        </div>
        <div>
          <div>LINK</div>
          <button
            className='bg-gray-200 px-2 flex justify-center items-center'
          >v</button>
        </div>
      </div>
    ))}

      {isOpen && <div 
          className="absolute top-[20%] right-[25%] w-[50%] h-[50%] bg-[#FFFFFF] p-5 border-2 border-black rounded-sm">

            <div className='flex justify-end' >
              <button 
              className='px-3 py-1 flex justify-center items-center bg-gray-200'
              onClick={handleCrossAddPR} 
              >
                X
              </button></div>

          
        <div >
          <p className='ml-[7.5%] mb-2' >Add PRs</p>
          <div className='w-[85%] ml-[7.5%] h-[60px] border-2 border-black text-gray-600 flex items-center justify-between px-4' >
            
            <p>{selectedRepo}</p>
            <button 
            onClick={handleDropDownofRepo}
            className='bg-gray-200 px-2 flex justify-center items-center'
            >
              v
            </button>
          </div>

          {isdropdownRepo &&<div className='w-[85%] ml-[7.5%] h-40 max-h-40 overflow-y-auto' >
          
          {repos.map((name, index) => (
          <div 
          className='h-[40px] border-2 border-black text-gray-500 flex items-center justify-between px-4 -mt-[1px]
                     hover:bg-gray-200
          ' 
          key={index}
          onClick={() => handleToSelectRepo(name)}
          >
            {name}
          </div>
          ))}
          
          </div>
         }

        </div>


        <div >
          <div className='w-[85%] ml-[7.5%] mt-8 h-[60px] border-2 border-black text-gray-600 flex items-center justify-between px-4' >
            
            <p>{selectedPR}</p>
            <button 
            onClick={handleDropDownofRepoPR}
            className='bg-gray-200 px-2 flex justify-center items-center'
            >
              v
            </button>
          </div>

          {isdropdownPR &&<div className='w-[85%] ml-[7.5%] max-h-40 overflow-y-auto' >
            {reposPR.map((title, index) => (
          <div 
          className='h-[40px] border-2 border-black text-gray-500 flex items-center justify-between px-4 -mt-1
                     hover:bg-gray-200 ' 
          key={index}
          onClick={() => handleToSelectPR(title)}
          >
            {title}
          </div>
           ))}
          
          
          </div>
         }

        </div>


        <div className='flex justify-center pt-6' >
          <button 
          className='bg-green-500 border-2 border-black rounded-sm px-4 py-1' 
          onClick={handleAddPR}
          >
            Add</button>
        </div>


      </div>} 

      

    </div>
  )
}

export default pullrequest
