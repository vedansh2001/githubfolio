"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";
import { BiSolidError } from "react-icons/bi";
import { z } from "zod";

const SignupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  githubUsername: z.string().min(1, "GitHub username is required"),
});

export default function Signup() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [goterror, setGoterror] = useState(false);
  const [texterror, setTexterror] = useState("");
  const [githubLoading, setGithubLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.githubUsername) {
      router.push('/');
    }
  }, [session, router]);

  const handleSignup = async () => {
    const validation = SignupSchema.safeParse({ name, email, password, githubUsername });

    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Validation error";
      setGoterror(true);
      setTexterror(firstError);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password, githubUsername, email })
      });

      const data = await response.json();
      if (response.ok) {
        await signIn("credentials", {
          email,
          password,
          redirect: false
        });
        router.push('/');
      } else {
        setGoterror(true);
        setTexterror(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center py-8 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-center">Sign up</h1>
          </div>

          <LabelledInput label="Name" placeholder="John Yadav" onChange={(e) => setName(e.target.value)} />
          <LabelledInput label="Email" placeholder="John@gmail.com" onChange={(e) => setEmail(e.target.value)} />
          <LabelledInput label="Password" placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />
          <LabelledInput label="GitHub Username" placeholder="GitHub Username" onChange={(e) => setGithubUsername(e.target.value)} />

          <div className="pt-4 text-sm flex justify-center font-medium">
            Already have an account?
            <Link href="/login" className="text-blue-600 font-semibold ml-1 hover:text-blue-700 transition-colors">
              Log in
            </Link>
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            type="button"
            className={`mt-4 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 flex justify-center transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <LoadingIcon />
            ) : (
              "Sign up"
            )}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <div className="px-4 text-sm text-gray-500">or</div>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 flex justify-center transition-colors"
            onClick={async () => {
              setGithubLoading(true);
              try {
                const result = await signIn("github", { redirect: false });
                if (!result || result.error) throw new Error("GitHub authentication failed");
              } catch (error) {
                console.error("GitHub login failed:", error);
              } finally {
                setGithubLoading(false);
              }
            }}
            disabled={githubLoading}
          >
            {githubLoading ? <LoadingIcon /> : "Signin with Github"}
          </button>
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

function LabelledInput({ label, placeholder, type, onChange }: LabelledInputType) {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-semibold text-gray-700">{label}</label>
      <input
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

const LoadingIcon = () => (
  <svg
    className="animate-spin h-5 w-5 text-white mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
  </svg>
);

interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}
