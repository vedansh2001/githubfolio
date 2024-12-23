import React, { useState } from 'react'

const ShowcaseSelectedPR = ({listOfSelectedPRs, repositoryLink, repo_fullName}) => {
    const[descriptionDropdown, setDescriptionDropdown] = useState(false)

    const handleAddDescription = () => {
        setDescriptionDropdown(!descriptionDropdown)
    }
    

  return (
    <>
    <div>
      {listOfSelectedPRs.map((item, index) => (
        <div 
          className='w-[70%] h-[60px] ml-[15%] border-2 mb-4 border-black rounded-sm flex justify-between px-4' 
          key={index}
        >
          <div>
            <p className='text-sm text-sky-600'><a href={repositoryLink}>{repo_fullName}</a> </p>
            <p>{item.title} <a className='text-sky-600 ml-2' href={item.html_url}> Link</a></p>
          </div>
          <div>
            <div className='flex gap-4' >
              <div>Status: {item.state}</div>
              <div>Pin</div>
            </div>
            <button 
            className='bg-gray-200 px-2 flex justify-center items-center'
            onClick={handleAddDescription}
            >
                v
            </button>
          </div>
        </div>
      ))}





       <div 
          className='w-[70%] h-[60px] ml-[15%] border-2 mb-4 border-black rounded-sm flex justify-between px-4' 
        >
          <div>
            <p className='text-sm text-sky-600'><a href={repositoryLink}>{repo_fullName}</a> </p>
            <p>hello, this is 1 <a className='text-sky-600 ml-2' href="jkgkg"> Link</a></p>
          </div>
          <div>
            <div className='flex gap-4' >
              <div>Status: TRUE</div>
              <div>Pin</div>
            </div>
            <button 
            className='bg-gray-200 px-2 flex justify-center items-center'
            onClick={handleAddDescription}
            >
                v
            </button>
          </div>
        </div>
        <div 
          className='w-[70%] h-[60px] ml-[15%] border-2 mb-4 border-black rounded-sm flex justify-between px-4' 
        >
          <div>
            <p className='text-sm text-sky-600'><a href={repositoryLink}>{repo_fullName}</a> </p>
            <p>hello, this is 2 <a className='text-sky-600 ml-2' href="jkgkg"> Link</a></p>
          </div>
          <div>
            <div className='flex gap-4' >
              <div>Status: TRUE</div>
              <div>Pin</div>
            </div>
            <button 
            className='bg-gray-200 px-2 flex justify-center items-center'
            onClick={handleAddDescription}
            >
                v
            </button>
          </div>
        </div>
        <div 
          className='w-[70%] h-[60px] ml-[15%] border-2 mb-4 border-black rounded-sm flex justify-between px-4' 
        >
          <div>
            <p className='text-sm text-sky-600'><a href={repositoryLink}>{repo_fullName}</a> </p>
            <p>hello, this is 3 <a className='text-sky-600 ml-2' href="jkgkg"> Link</a></p>
          </div>
          <div>
            <div className='flex gap-4' >
              <div>Status: TRUE</div>
              <div>Pin</div>
            </div>
            <button 
            className='bg-gray-200 px-2 flex justify-center items-center'
            onClick={handleAddDescription}
            >
                v
            </button>
          </div>
        </div>
        <div 
          className='w-[70%] h-[60px] ml-[15%] border-2 mb-4 border-black rounded-sm flex justify-between px-4' 
        >
          <div>
            <p className='text-sm text-sky-600'><a href={repositoryLink}>{repo_fullName}</a> </p>
            <p>hello, this is 4 <a className='text-sky-600 ml-2' href="jkgkg"> Link</a></p>
          </div>
          <div>
            <div className='flex gap-4' >
              <div>Status: TRUE</div>
              <div>Pin</div>
            </div>
            <button 
            className='bg-gray-200 px-2 flex justify-center items-center'
            onClick={handleAddDescription}
            >
                v
            </button>
          </div>
        </div>













      
      
      
      <div>
        {descriptionDropdown && <div 
          className='h-[150px] w-[70%] ml-[15%] bg-gray-300'
        >
            helo
        </div>}
      </div>
    </div>
    </>
  )
}

export default ShowcaseSelectedPR
