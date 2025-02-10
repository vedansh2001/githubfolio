"use server";

import { signIn, auth } from "@/auth";
// import { CredentialsSignin } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "../../db";
const credentialsLogin = async (email: string, password: string) => {
  try {
    await signIn("credentials", { email, password });

    // 🔹 Wait for session update
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Short delay to ensure session is refreshed

    // 🔹 Fetch the updated session
    const session = await auth();
    console.log("Session after login:", session);

    if (!session?.user?.email) {
      throw new Error("User session not found after login.");
    }

    // 🔹 Retrieve GitHub username from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { githubUsername: true },
    });

    if (!user?.githubUsername) {
      throw new Error("GitHub username not found in the database.");
    }

    // 🔹 Redirect to GitHub username page
    redirect(`/${user.githubUsername}`);
  } catch (error) {
    console.error("Login error:", error);
    // return error.message || "Login failed. Please try again.";
  }
};

export { credentialsLogin };
