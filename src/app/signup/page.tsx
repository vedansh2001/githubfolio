"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";
import { BiSolidError } from "react-icons/bi";

export default function Signup() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [githubUsername, setGithubUsername] = useState("");
    const [email, setEmail] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [goterror, setGoterror] = useState(Boolean)
    const [texterror, setTexterror] = useState(String)
    const [githubLoading, setGithubLoading] = useState(false); 
    const { data: session } = useSession(); // ✅ Fe

    // ✅ Redirect only after the component is mounted
      useEffect(() => {
        if (session?.user?.githubUsername) {
          router.push(`/${session.user.githubUsername}`);
        }
      }, [session, router]); // ✅ Runs only when session updates

    

    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div className="block w-[25%] p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 ">
                    <div>
                        <div className="px-10">
                            <div className="text-3xl font-extrabold flex justify-center">Sign up</div>
                        </div>
                        <div className="pt-2">
                            <LabelledInput
                                onChange={(e) => setName(e.target.value)}
                                label="Name"
                                placeholder="John Yadav"
                                key="name"
                            />
                            <LabelledInput
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email"
                                placeholder="John@gmail.com"
                                key="email"
                            />
                            <LabelledInput
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                type="password"
                                placeholder="password"
                                key="password"
                            />
                            <LabelledInput
                                onChange={(e) => setGithubUsername(e.target.value)}
                                label="GitHub Username"
                                type="text"
                                placeholder="GitHub Username"
                                key="github_username"
                            />
                            <div className="pt-4 text-xs flex justify-center font-semibold" >Already have an account? 
                                <Link href="/login" className="text-blue-600 font-semibold ml-1">Log in
                                </Link>
                            </div>
                            <button
                                onClick={async () => {
                                    if (!name || !password || !githubUsername) {                                        
                                        setGoterror(true)
                                        setTexterror("Please fill in all fields")
                                        return;
                                    }
                                    setLoading(true);

                                    try {


                                        const response = await fetch("api/user",{ 
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({name, password, githubUsername, email})
                                        });
                                        const data = await response.json()
                                        

                                        if (!response.ok) {
                                          setGoterror(true)
                                          const errormessage = data.message
                                          setTexterror(errormessage)
                                          throw new Error(`Error: ${response.statusText}`);
                                        }
                                        const username = data.username;
                                        router.push(`/${username}`);

                                    } catch (error) {
                                        console.error("Error during signup:", error);
                                    } finally{
                                        setLoading(false);
                                    }
                                 }}
                                disabled={loading}
                                type="button"
                                className={`mt-2 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 flex justify-center
                                ${loading? "cursor-not-allowed opacity-50" : ""}
                                `}
                            >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-2 flex cursor-not-allowed"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  </>
                ) : (
                  "Sign up"
                )}
                            </button>


                    <div className="flex w-full justify-center">or</div>
                    
                                  {/* 🔹 GitHub Login Button with Animation */}
                                  <button
  className="mt-2 w-full text-white bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 flex justify-center"
  onClick={async () => {
    setGithubLoading(true);
    try {
      const result = await signIn("github", { redirect: false }); // Prevent default redirection
      
      if (!result || result.error) {
        throw new Error("GitHub authentication failed");
      }


    } catch (error) {
      console.error("GitHub login failed:", error);
    } finally {
      setGithubLoading(false);
    }
  }}
  disabled={githubLoading}
>
                      {githubLoading ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white mr-2 flex cursor-not-allowed"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          ></path>
                        </svg>
                      ) : (
                        "Signin with Github"
                      )}
                    </button>

                        </div>
                    </div>
                </div>
            </div>
            
                        {goterror && <div className="flex justify-center items-center text-gray-600 font-semibold mt-2" >
                        <BiSolidError className="mr-1 text-red-500 text-xl"/>
                        {texterror}
                        </div>
                        }
        </div>
    );
}

function LabelledInput({ label, placeholder, type, onChange }: LabelledInputType) {
    return (
        <div>
            <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
            <input
                onChange={onChange}
                type={type || "text"}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder}
                required
            />
        </div>
    );
}

// Add displayName explicitly if required
LabelledInput.displayName = "LabelledInput";

interface LabelledInputType {
    label: string;
    placeholder: string;
    type?: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}
