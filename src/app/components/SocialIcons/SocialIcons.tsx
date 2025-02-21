import React, { useState } from "react";
import { FaFacebook, FaLink, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SocialIcons = () => {
  const [showCopied, setShowCopied] = useState(false);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = "Check out My Github Portfolio!";

  const handleCopyLink = () => {
    setShowCopied(true);
    navigator.clipboard.writeText(url);
    setTimeout(() => {
      setShowCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-gray-300 border border-gray-400 rounded-lg shadow-lg p-5 py-3 text-xl mt-3 w-[80%] mx-auto">
      {/* Title */}
      <p className="font-semibold text-gray-800 text-2xl flex items-center justify-center mb-4">
        Share on Socials
      </p>

      {/* Social Icons Wrapper */}
      <div className="flex justify-center space-x-6">
        {/* LinkedIn */}
        <button
          className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-600 text-white text-2xl shadow-md hover:scale-110 hover:bg-blue-700 transition duration-300"
          onClick={() =>
            window.open(`https://www.linkedin.com/shareArticle?url=${url}`, "_blank")
          }
          aria-label="Share on LinkedIn"
        >
          <FaLinkedin />
        </button>

        {/* Twitter */}
        <button
          className="w-14 h-14 flex items-center justify-center rounded-full bg-black text-white text-2xl shadow-md hover:scale-110 hover:bg-gray-800 transition duration-300"
          onClick={() =>
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank")
          }
          aria-label="Share on Twitter"
        >
          <FaXTwitter />
        </button>

        {/* Facebook */}
        <button
          className="w-14 h-14 flex items-center justify-center rounded-full bg-blue-700 text-white text-2xl shadow-md hover:scale-110 hover:bg-blue-800 transition duration-300"
          onClick={() =>
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")
          }
          aria-label="Share on Facebook"
        >
          <FaFacebook />
        </button>

        {/* Copy Link */}
        <div className="relative group">
          <button
            className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-600 text-white text-2xl shadow-md hover:scale-110 hover:bg-gray-800 transition duration-300"
            onClick={handleCopyLink}
            aria-label="Copy Link"
          >
            <FaLink />
          </button>

          {/* Copied Tooltip */}
          {showCopied && (
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-blue-500 text-white text-xs py-1 px-2 rounded shadow-md transition-opacity duration-200">
              Copied!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialIcons;
