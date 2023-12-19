"use client";

import Container from "@/components/Container";
import { POSTHOG_EVENTS } from "@/constants/analytics.constant";
import { CALENDAR_LINK } from "@/constants/configs";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import posthog from "posthog-js";

import { Button } from "./ui/button";

const SiteHeader = () => {
  const session = useSession();

  return (
    <div className="sticky top-0 z-20">
      <Container>
        <div className="flex py-6 px-1 relative items-center justify-between">
          <div className="shrink-0 mr-4">
            <Image
              src={"/assets/SquareOctolaneLogo.svg"}
              width={24}
              height={24}
              alt="Octolane AI Logo"
            />
          </div>
          <h1 className="font-inter-tight text-xl md:text-xl  bg-clip-text text-transparent bg-gradient-to-r from-zinc-500 via-zinc-900 to-zinc-900 font-semibold">
            Octolane AI
          </h1>

          <a
            className={"flex flex-1 items-center justify-end space-x-4 "}
            href={CALENDAR_LINK}
            target="_blank"
            onClick={() => {
              posthog.capture(
                POSTHOG_EVENTS.TALK_TO_FOUNDERS.NAVBAR,
                session.status === "authenticated"
                  ? { email: session.data.user?.email }
                  : {},
              );
            }}
          >
            Talk to founders
          </a>

          {session.status === "authenticated" ? (
            <Button
              className="ml-5"
              variant="outline"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          ) : null}
        </div>
      </Container>
    </div>
  );
};

export default SiteHeader;
