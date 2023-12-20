"use client";

import Container from "@/components/Container";
import { POSTHOG_EVENTS } from "@/constants/analytics.constant";
import { CALENDAR_LINK } from "@/constants/configs";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

import GitHubIcon from "./icons/GitHub";
import TwitterIcon from "./icons/Twitter";
import { Button } from "./ui/button";

const SiteHeader = () => {
  const session = useSession();

  return (
    <div className="sticky top-0 z-20">
      <Container>
        <div className="flex py-6 px-1 relative items-center justify-between w-full">
          <Link href="/" className="flex items-center">
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
          </Link>

          <div className="flex-1 flex items-center justify-end gap-2">
            <a
              href="https://github.com/octolane-org/csv-to-enrich-app"
              target="_blank"
            >
              <GitHubIcon />
            </a>
            <a href="https://twitter.com/octolane_app" target="_blank">
              <TwitterIcon />
            </a>

            <a
              className="flex items-center justify-end space-x-4"
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
        </div>
      </Container>
    </div>
  );
};

export default SiteHeader;
