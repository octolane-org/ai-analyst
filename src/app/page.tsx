"use client";

import { ActionCard } from "@/components/ActionCard";
import Container from "@/components/Container";

// import { useSession } from "next-auth/react";

export default function Home() {
  // const session = useSession();

  return (
    <div className="flex min-h-screen flex-col items-center justify-between space-y-16 ">
      <Container>
        <div
          className={
            "my-12 flex flex-col items-center md:flex-row lg:my-16" +
            " mx-auto flex-1 justify-center  " +
            " duration-1000 slide-in-from-top-12" +
            "relative before:absolute before:inset-0 before:h-80 before:pointer-events-none before:bg-gradient-to-b before:from-zinc-100 before:-z-10"
          }
        >
          <div className="text-center ">
            <h1 className="font-inter-tight text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 via-zinc-900 to-zinc-900 pb-4">
              1-Click B2B Data Enrichment
            </h1>
            <p className="text-lg text-zinc-500 mb-2">
              Simply upload your file, and with one click and get the enriched
              data you need to drive your business forward.
            </p>
            <div className="pb-4">
              {" "}
              <span className={"text-xs text-gray-500 dark:text-gray-400 "}>
                No credit card required.
              </span>
            </div>
            <div className="flex space-x-5 pb-5">
              <ActionCard
                cardTitle="Enrich People"
                cardDescription="Upload a CSV or Excel of up to 500 people email and enrich their information for free."
                buttonText="Upload CSV"
              />

              <ActionCard
                cardTitle="Enrich Company"
                cardDescription="Upload a CSV or Excel of up to 500 company website and enrich information for free.."
                buttonText="Upload CSV"
              />
            </div>
            {/* <Button variant="cta">
              <Link href="/dashboard">Go to Dashboard</Link>
              <svg className="w-4 h-5 ml-2"></svg>
            </Button> */}
          </div>

          {/* {session.status === "authenticated" ? (
            <Button onClick={() => signOut()}>
              Logout as {session.data.user?.name}
            </Button>
          ) : (
            <GoogleLoginButton />
          )} */}
        </div>
      </Container>
    </div>
  );
}
