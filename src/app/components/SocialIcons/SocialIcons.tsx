import React, { useState } from 'react'

import { FaFacebook, FaLink, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SocialIcons = () => {

  const [showCopied, setShowCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = "Check out this amazing website!"; // Replace with your text

  const handleCopyLink = () => {
    setShowCopied(true); // Explicitly set to true
    setTimeout(() => {
      setShowCopied(false); // Explicitly set to false after 3 seconds
    }, 2000);
  };
  

  return (
    <div className="bg-gray-300 border-dashed border-gray-700 border-2 p-2 text-xl mt-5 w-[80%] ml-[10%]" >
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
              {/* <button
                    className="text-gray-700 text-4xl"
                    onClick={() => {
                      navigator.clipboard.writeText(url);
                      alert("Link copied to clipboard!");
                    }}
                    aria-label="Copy Link"
                  >
                    <FaLink />
              </button> */}
              <div className="relative group">
              <button
                    className="text-gray-700 text-4xl"
                    onClick={handleCopyLink}
                    aria-label="Copy Link"
                  >
                    <FaLink />
              </button>
                    {showCopied && <span className="absolute bottom-full mb-1 group-hover:inline-block bg-blue-500 text-white text-sm py-2 px-3 rounded shadow-md">
                        Copied
                    </span>}
              </div>
        </div>
                  </div>
  )
}

export default SocialIcons;
