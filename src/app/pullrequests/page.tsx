"use client"

import React, { useState } from 'react'
import PinnedSection from '../components/PinnedPRs/PinnedPRs';
import ShowcaseSelectedPR from '../components/ShowcaseSelectedPR/ShowcaseSelectedPR';
import SelectPRsToAdd from '../components/SelectPRsToAdd/SelectPRsToAdd';

const Pullrequest = () => {

    const [selectPRBoxIsOpen, setSelectPRBoxIsOpen] = useState(false);
    const [listOfSelectedPRs, setListofSelectedPRs] = useState([])
    const [repo_fullName, setRepo_fullName] = useState("")
    const [repositoryLink, setRepositoryLink] = useState("")
    const username = "vedansh2001"

    const handleOpenAddPRBox = () => {
      setSelectPRBoxIsOpen(!selectPRBoxIsOpen)
    }

  return (
    <div className='h-screen bg-gray-200' >

      {/* pinned section present on the top ..............................................................*/}
      <PinnedSection/>


      {/* button to add select PR to be added  ...........................................................*/}
      <div className='w-[80%] ml-[10%] my-6 flex justify-end'>
        <button 
          className='bg-green-500 border-2 border-black rounded-sm px-3 py-1' 
          onClick={handleOpenAddPRBox}
        >
          Add PR +
        </button>
      </div>


      {/* code of the selected PRs that will be displayed after being selected ..................................*/}
      <ShowcaseSelectedPR listOfSelectedPRs={listOfSelectedPRs} repositoryLink={repositoryLink} repo_fullName={repo_fullName}/>


      {/* code of the section where user which select which PRs they want to show/display  ......................*/}
      <SelectPRsToAdd selectPRBoxIsOpen={selectPRBoxIsOpen} setSelectPRBoxIsOpen={setSelectPRBoxIsOpen} listOfSelectedPRs={listOfSelectedPRs} repo_fullName={repo_fullName}
                      setRepo_fullName={setRepo_fullName} setRepositoryLink={setRepositoryLink} username={username} 
      />

    </div>
  )
}

export default Pullrequest