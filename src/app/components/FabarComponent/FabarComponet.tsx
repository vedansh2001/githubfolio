import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { MdLogin, MdLogout } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FabarComponentProps {
  barisopen: boolean;
  setBarisopen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FabarComponent: React.FC<FabarComponentProps> = ({
  barisopen,
  setBarisopen,
}) => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handleOnClick = () => {
    setBarisopen(false);
  };

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setBarisopen(false);
      }
    },
    [setBarisopen]
  );
  const handleHomePage = () => {
    router.push("/");
  }
  const handleViewMyPortfolio = () => {
    if (session?.user?.githubUsername) {
      router.push(`/${session.user.githubUsername}`);
    } else {
      // Should redirect to sign in page
      router.push("/login");
    }
  };
  const handleViewMyGitHubAnalysis = () => {
    if (session?.user?.githubUsername) {
      router.push(`/${session?.user?.githubUsername}/GitHubAnalysis`);
    } else {
      // Should redirect to sign in page
      router.push("/login");
    }
  };

  useEffect(() => {
    if (barisopen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [barisopen, handleOutsideClick]);

  return (
    <div>
      {/* Sidebar */}
      <div
        ref={boxRef}
        className={`fixed top-0 right-0 h-screen w-64 bg-blue-100 shadow-lg flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-50 ${
          barisopen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header section */}
        <div className="flex flex-col">
          <div className="flex justify-end w-full pt-4 pr-4 mb-6">
            <button
              onClick={handleOnClick}
              className="p-2 bg-blue-200 hover:bg-blue-200 rounded-full transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <RxCross2 className="text-blue-600 text-xl" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2 px-4">
            <button
              onClick={handleHomePage}
              className="py-3 px-4 text-blue-800 font-medium bg-blue-200 hover:bg-blue-300 rounded-lg transition-colors duration-200"
            >
              Home
            </button>
            <button
              onClick={handleViewMyPortfolio}
              className="py-3 px-4 text-blue-800 font-medium bg-blue-200 hover:bg-blue-300 rounded-lg transition-colors duration-200"
            >
              My Portfolio
            </button>

            <button
              onClick={handleViewMyGitHubAnalysis}
              className="py-3 px-4 text-blue-800 font-medium bg-blue-200 hover:bg-blue-300 rounded-lg transition-colors duration-200"
            >
              Ai Analysis
            </button>
          </div>
        </div>

        {/* User info and logout section */}
        <div className="p-4 border-t border-blue-100">
          {!session?.user ? (
            <Link
              href="/login"
              className="flex items-center justify-center p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <MdLogin className="mr-2" />
              <span>Login</span>
            </Link>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    width={36}
                    height={36}
                    alt="User Avatar"
                    className="rounded-full"
                  />
                )}
                <span className="font-medium text-blue-800">
                  {session.user.name}
                </span>
              </div>
              
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center justify-center w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                <MdLogout className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toggle button */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setBarisopen(!barisopen)}
          className="p-3 bg-blue-300 text-white rounded-full shadow-md hover:bg-blue-400 transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <FaBars className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default FabarComponent;