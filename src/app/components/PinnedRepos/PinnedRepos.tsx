import React from 'react'

const PinnedRepos = ({TotalRepos}) => {
  return (
    <div className='h-[45%] bg-gray-300' >
        <p className='ml-[10%]' >Pinned Repos | Total no. of public repos: {TotalRepos}</p>
        <div className='w-[80%] ml-[10%] bg-gray-300 h-[80%] border-2 p-4 border-black rounded-sm grid grid-cols-2 gap-4' >
          <div className='border-2 border-gray-700' >Box 1</div>
          <div className='border-2 border-gray-700' >Box 2</div>
          <div className='border-2 border-gray-700' >Box 3</div>
          <div className='border-2 border-gray-700' >Box 4</div>
        </div>
      </div>
  )
}

export default PinnedRepos
