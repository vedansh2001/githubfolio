import Link from 'next/link';
import React from 'react'
import { FaBars } from 'react-icons/fa'
import { MdLogin, MdLogout } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';

const FabarComponent = ({barisopen, setBarisopen, isLoggedIn}) => {

  const handleOnClick = () => {
    setBarisopen(!barisopen);
  }

  return (
    <div>    

      <div className={`fixed top-0 right-0 h-screen w-[300px] bg-gray-300 shadow shadow-gray-500 flex flex-col justify-between transform transition-transform duration-300 ${
                       barisopen ? 'translate-x-0' : 'translate-x-full'
                     }`}
      >

        
        <div>

        <div className='flex justify-end w-[100%] pt-4 pr-6 text-4xl font-semibold mb-4 cursor-pointer
        '>
              <RxCross2 
              onClick={handleOnClick} 
              className='bg-gray-200 p-1 flex justify-center items-center rounded-full' 
              />
        </div>

        <div className="w-[100%] pb-4" >
                <div className="bg-gray-300 px-3 shadow shadow-gray-500 py-1 text-xl font-semi-bold" >
                <Link href="../pullrequests"> Edit PRs</Link>
                </div>

                <div className="bg-gray-300 px-3 shadow shadow-gray-500 py-1 text-xl font-semi-bold" >
                <Link href="../repositories"> Edit Repos</Link>
                </div>
                

        </div>
        </div>


        <div className='bottom-0 bg-gray-300 h-15' >
          
        <div className="bottom-0 bg-gray-300 h-15">
  {isLoggedIn ? (
    // Show Logout when logged in
    <div className="relative group">
      <div>
        <MdLogout className="text-5xl pl-3 cursor-pointer" />
      </div>
      <span className="absolute bottom-full translate-x-1/2 mb-1 hidden group-hover:inline-block bg-gray-500 text-white text-sm py-1 px-2 rounded shadow-md">
        Logout
      </span>
    </div>
  ) : (
    // Show Login when not logged in
    <div className="relative group">
      <div>
        <MdLogin className="text-5xl pl-3 cursor-pointer" />
      </div>
      <span className="absolute bottom-full translate-x-1/2 mb-1 hidden group-hover:inline-block bg-gray-500 text-white text-sm py-1 px-2 rounded shadow-md">
        Login
      </span>
    </div>
  )}
</div>



        </div>
      </div>
      

      <div className=" w-[100%] flex justify-end items-center h-[7%] pt-4 pr-6" >
          <div className="bg-gray-200 rounded-full p-2 text-2xl flex items-center justify-center cursor-pointer
          " >
            <FaBars 
             onClick={handleOnClick}
            />
          </div>
      </div>
    </div>
  )
}

export default FabarComponent
