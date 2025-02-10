import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";
import prisma from "../db";
// import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_AUTH_ID,
      clientSecret: process.env.GITHUB_AUTH_SECRET,
    }),
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;

        if (!email || !password)
          throw new CredentialsSignin("Invalid Email or Password");

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new CredentialsSignin("Invalid Email or Password");

        if (!user.password)
          throw new CredentialsSignin("Invalid Email or Password");

        // const isMatch = await compare(password, user.password);
        const isMatch = password === user.password
        if (!isMatch) throw new CredentialsSignin("Invalid Email or Password");

        // return { id: user.id, name: user.name, email: user.email, githubUsername: user.githubUsername };
        return {
          ...user,
          id: user.id.toString(), // ✅ Ensure id is a string
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
        if (account?.provider === "github") {
            try {
                // const githubProfile = profile as any;
                const githubUsername = profile?.login;
                console.log("this is the githubprofile data so that you know what you get -----------------------", profile);
                
                const email = profile?.email;  // Get email if available
                
                console.log("GitHub Username:", githubUsername);
                console.log("GitHub Email:", email);
    
                if (!githubUsername) {
                    console.error("GitHub authentication failed: No username provided.");
                    throw new AuthError("GitHub authentication failed: No username found.");
                }
    
                // 🔹 Check if user already exists in the database by email or GitHub username
                const existingUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: email || "" }, // Only check if email exists
                            { githubUsername }
                        ]
                    }
                });
    
                // 🔹 If the user doesn't exist, create a new entry
                if (!existingUser) {
                    // existingUser = await prisma.user.create({
                    //     data: {
                    //         githubUsername,
                    //         email: email || "",  // Store email if available, otherwise empty string
                    //         password: "",  // GitHub users don't need passwords
                    //     }
                    // });
              //       existingUser = await fetch("api/user",{ 
              //         method: "POST",
              //         headers: {
              //             "Content-Type": "application/json"
              //         },
              //         body: JSON.stringify({githubProfile?.name, githubUsername, githubProfile?.email?})
              // });
              const url = process.env.WEBSITE_URL;
              // const url = "http://localhost:3000/";
              console.log("this is the url------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- :", url);
              
               await fetch(`${url}/api/user`, { 
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({  
                  name: profile?.name,  // ✅ Fixed JSON formatting
                  githubUsername: githubUsername,
                  email: profile?.email || "not_provided", // ✅ Fallback if email is missing
                  password: null,
                }),
              });
              
                } else if (!existingUser.githubUsername) {
                    // If user exists but doesn't have a GitHub username, update it
                    await prisma.user.update({
                        where: { email: existingUser.email },
                        data: { githubUsername }
                    });
                }
    
                return true;  // ✅ Authentication successful
            } catch (error) {
                console.error("Error creating/updating user:", error);
                throw new AuthError("Error while creating user");
            }
        }
    
        return account?.provider === "credentials";
    },
    

    async jwt({ token, user, account, profile }) {
  if (account?.provider === "github") {
    token.githubUsername = profile?.login;
  }
  if (user?.githubUsername) {
    token.githubUsername = user.githubUsername;
  }
  return token;
},


async session({ session, token }) {
  if (token.githubUsername) {
    session.user = session.user || {}; // Ensure `user` exists
    session.user.githubUsername = token.githubUsername as string; // Explicitly cast as string
  }
  return session;
},

    
  },
});
