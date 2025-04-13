import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialProvider from "next-auth/providers/credentials";
import prisma from "../db";
import { compare } from "bcryptjs";
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

        if (!email || !password) {
          console.warn("[Credentials] Missing email or password");
          throw new CredentialsSignin("Invalid Email or Password");
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
          console.warn("[Credentials] User not found or missing password");
          throw new CredentialsSignin("Invalid Email or Password");
        }

        const isMatch = await compare(password, user.password);
        
        if (!isMatch) {
          console.warn("[Credentials] Password mismatch");
          throw new CredentialsSignin("Invalid Email or Password");
        }

        return {
          ...user,
          id: user.id.toString(), // Ensure ID is a string
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
          const githubUsername = profile?.login;
          const email = profile?.email;

          console.log("[GitHub] Profile received:", profile);
          console.log("[GitHub] Username:", githubUsername);
          console.log("[GitHub] Email:", email);

          if (!githubUsername) {
            console.error("[GitHub] Missing GitHub username");
            throw new AuthError("GitHub authentication failed: No username found.");
          }

          // Check if the user already exists
          const existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                { email: email || "" }, // Only if email exists
                { githubUsername },
              ],
            },
          });

          if (!existingUser) {
            const url = process.env.WEBSITE_URL;
            console.log("[GitHub] Creating new user at:", url);

            await fetch(`${url}/api/user`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: profile?.name,
                githubUsername,
                email: profile?.email || "not_provided",
                password: null,
              }),
            });
          } else if (!existingUser.githubUsername) {
            console.log("[GitHub] Updating existing user with GitHub username");
            await prisma.user.update({
              where: { email: existingUser.email },
              data: { githubUsername },
            });
          }

          return true;
        } catch (error) {
          console.error("[GitHub] Error creating/updating user:", error);
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
        session.user = session.user || {};
        session.user.githubUsername = token.githubUsername as string;
      }
      return session;
    },
  },
});
