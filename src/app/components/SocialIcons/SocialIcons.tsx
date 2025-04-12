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
    <div className="w-full mt-4 pb-6">
      <div className="bg-white border p-6 rounded-2xl shadow-md max-w-xl mx-auto">
        <p className="text-xl font-semibold text-center text-gray-800 mb-4">
          Share on Socials
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={() =>
              window.open(`https://www.linkedin.com/shareArticle?url=${url}`, "_blank")
            }
            aria-label="Share on LinkedIn"
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl shadow hover:scale-110 transition"
          >
            <FaLinkedin />
          </button>

          <button
            onClick={() =>
              window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank")
            }
            aria-label="Share on Twitter"
            className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl shadow hover:scale-110 transition"
          >
            <FaXTwitter />
          </button>

          <button
            onClick={() =>
              window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")
            }
            aria-label="Share on Facebook"
            className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center text-xl shadow hover:scale-110 transition"
          >
            <FaFacebook />
          </button>

          <div className="relative group">
            <button
              onClick={handleCopyLink}
              aria-label="Copy Link"
              className="w-12 h-12 rounded-full bg-gray-700 text-white flex items-center justify-center text-xl shadow hover:scale-110 transition"
            >
              <FaLink />
            </button>
            {showCopied && (
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-green-600 text-white text-xs rounded shadow">
                Copied!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialIcons;
