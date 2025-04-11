"use client";

import { signIn, useSession } from "next-auth/react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";
import { BiSolidError } from "react-icons/bi";

export default function Login() { 
  const [password, setPassword] = useState("GuestAccount");
  const [email, setEmail] = useState("vedanshmdev@gmail.com");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [goterror, setGoterror] = useState(false);
  const [texterror, setTexterror] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.githubUsername) {
      router.push(`/`);
    }
  }, [session, router]);

  return (
    <div className="min-h-screen flex justify-center items-center py-8 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div>
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-center">Log In</h1>
            </div>
            <div>
              <LabelledInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                placeholder="John@gmail.com"
                key="email"
              />
              <LabelledInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
                type="password"
                placeholder="password"
                key="password"
              />
              <div className="pt-4 text-sm flex justify-center font-medium">
                Create account?
                <Link href="/signup" className="text-blue-600 font-semibold ml-1 hover:text-blue-700 transition-colors">
                  Sign Up
                </Link>
              </div>

              {/* Sign-in Button */}
              <button
                onClick={async () => {
                  if (!password || !email) {
                    setGoterror(true);
                    setTexterror("Please fill in all fields");
                    return;
                  }
                  setLoading(true);

                  try {
                    const result = await signIn("credentials", { email, password, redirect: false });
                    if (!result || result.error) throw new Error(result?.error || "Invalid credentials");

                    console.log("GitHub login successful. Fetching session...");

                    const response = await fetch("/api/auth/session", { cache: "no-store" });
                    const session = await response.json();

                    console.log("Updated Session:", session);

                    if (!session?.user?.githubUsername) throw new Error("GitHub username not found");

                    router.push(`/`);
                  } catch (error) {
                    console.error("Error during Login:", error);
                    setTexterror("Login failed. Please try again.");
                    setGoterror(true);
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                type="button"
                className={`mt-4 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 flex justify-center transition-colors
                  ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
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
                  "Sign in"
                )}
              </button>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <div className="px-4 text-sm text-gray-500">or</div>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* GitHub Login Button with Animation */}
              <button
                className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 flex justify-center transition-colors"
                onClick={async () => {
                  setGithubLoading(true);
                  try {
                    await signIn("github");
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
                    className="animate-spin h-5 w-5 text-white mr-2"
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
                  "Login with Github"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {goterror && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center text-yellow-800 shadow-md">
          <BiSolidError className="mr-2 text-red-500 text-xl flex-shrink-0" />
          <span>{texterror}</span>
        </div>
      )}
    </div>
  );
}

function LabelledInput({ label, placeholder, type, value, onChange }: LabelledInputType) {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-semibold text-gray-700">{label}</label>
      <input
        value={value}
        onChange={onChange}
        type={type || "text"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-colors"
        placeholder={placeholder}
        required
      />
    </div>
  );
}

LabelledInput.displayName = "LabelledInput";

interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}