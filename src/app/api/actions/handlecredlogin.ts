"use server"

import { credentialsLogin } from "@/actions/login";

export async function handleLoginSubmission(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      error: "Please provide all fields"
    };
  }

  try {
    const error = await credentialsLogin(email, password);
    
    if (!error) {
      return { success: true };
    } else {
      return { error: String(error) };
    }
  } catch (error) {
    console.log("error",error);
    
    return { error: "An unexpected error occurred" };
  }
}