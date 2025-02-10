import { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      githubUsername?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    githubUsername?: string;
  }

  interface JWT extends DefaultJWT {
    githubUsername?: string;
  }
}
