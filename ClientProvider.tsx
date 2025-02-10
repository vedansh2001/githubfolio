"use client";

import { SessionProvider } from "next-auth/react";

export default function ClientProvider({
  session,
  children,
}: {
  session: any,
  children: React.ReactNode;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
