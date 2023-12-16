"use client";

import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {session.status === "authenticated" ? (
        <Button onClick={() => signOut()}>
          Logout as {session.data.user?.name}
        </Button>
      ) : (
        <GoogleLoginButton />
      )}
    </main>
  );
}
