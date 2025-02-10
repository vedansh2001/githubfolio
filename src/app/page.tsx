"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectPage() {

  const { data: session, status } = useSession();
  const router = useRouter();

    useEffect(() => {
        if (status === "loading") return; // ⏳ Wait until session is determined

        if (session?.user?.githubUsername) {
        router.push(`/${session.user.githubUsername}`);
        } else {
        router.push("/login");
        }
    }, [session, status, router]); 

  return <div className="h-screen w-screen flex justify-center items-center" >
    Redirecting...
    </div>;
}
