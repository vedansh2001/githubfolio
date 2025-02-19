import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { MdLogin, MdLogout } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { signOut, useSession } from "next-auth/react";
// import { auth } from "../../auth";
import Image from "next/image";
// import Logout from "../Logout/Logout";
// import SignIn from "../LoginGithub/loginGithub";

interface FabarComponentProps {
  barisopen: boolean;
  setBarisopen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FabarComponent: React.FC<FabarComponentProps> = ({ barisopen, setBarisopen }) => {
  // const session = await auth();
  const boxRef = useRef<HTMLDivElement | null>(null);

  const { data: session } = useSession();

console.log("this is sessisin.image: ", session);


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
      <div
        ref={boxRef}
        className={`fixed top-0 right-0 h-screen w-[300px] bg-gray-300 shadow shadow-gray-500 flex flex-col justify-between transform transition-transform duration-300 ${
          barisopen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="flex justify-end w-[100%] pt-4 pr-6 text-4xl font-semibold mb-4 cursor-pointer">
            <RxCross2
              onClick={handleOnClick}
              className="bg-gray-200 p-1 flex justify-center items-center rounded-full"
            />
          </div>

          <div className="w-[100%] pb-4">
            <div className="bg-gray-300 px-3 shadow shadow-gray-500 py-1 text-xl font-semi-bold">
              <Link href="../pullrequests"> Edit PRs</Link>
            </div>

            <div className="bg-gray-300 px-3 shadow shadow-gray-500 py-1 text-xl font-semi-bold">
              <Link href="../repositories"> Edit Repos</Link>
            </div>
          </div>
        </div>

        <div className="bottom-0 bg-gray-300 h-15">
              {/* {isLoggedIn ? (
                <div className="relative group">
                  <Link href="../signup">
                  <div>
                    <MdLogout className="text-5xl pl-3 cursor-pointer" />
                  </div>
                  </Link>
                  <span className="absolute bottom-full translate-x-1/2 mb-1 hidden group-hover:inline-block bg-gray-500 text-white text-sm py-1 px-2 rounded shadow-md">
                    Logout
                  </span>
                </div>
              ) : (
                <div className="relative group">
                  <Link href="../login">
                    <div>
                      <MdLogin className="text-5xl pl-3 cursor-pointer" />
                    </div>
                  </Link>
                  <span className="absolute bottom-full translate-x-1/2 mb-1 hidden group-hover:inline-block bg-gray-500 text-white text-sm py-1 px-2 rounded shadow-md">
                    Login
                  </span>
                </div>
              )} */}

          {!session?.user ? (
                  <div className="relative group">
                    <Link href="/login">
                      <div>
                        <MdLogin className="text-5xl pl-3 cursor-pointer" />
                      </div>
                    </Link>
                    <span className="absolute bottom-full translate-x-1/2 mb-1 hidden group-hover:inline-block bg-gray-500 text-white text-sm py-1 px-2 rounded shadow-md">
                      Login
                    </span>
                  </div>
                ) : (
                  <div className="relative flex items-center gap-2">
                    <span className="ml-2 font-semibold">{session.user.name}</span>
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        width={30}
                        height={30}
                        alt="User Avatar"
                        className="rounded-full"
                      />
                    )}
                    
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="relative group flex items-center"
                    >
                      <MdLogout className="text-5xl pl-3 cursor-pointer" />
                      
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 ease-in-out bg-gray-500 text-white text-sm py-1 px-2 rounded shadow-md">
                        Logout
                      </span>
                    </button>
                  </div>

                )}
        </div>
      </div>

      <div className="w-[100%] flex justify-end items-center h-[7%] pt-4 pr-6">
        <div className="bg-gray-200 rounded-full p-2 text-2xl flex items-center justify-center cursor-pointer">
          <FaBars onClick={() => setBarisopen(!barisopen)} />
        </div>
      </div>
    </div>
  );
};

export default FabarComponent;
