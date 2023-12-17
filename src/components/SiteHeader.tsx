"use client";

import Container from "@/components/Container";
import Image from "next/image";

const SiteHeader = () => {
  return (
    <div className="sticky top-0 z-20">
      <Container>
        <div className="flex py-6 px-1 relative items-center border-b border-gray-50 dark:border-dark-800/70 justify-between">
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

          <div className={"flex flex-1 items-center justify-end space-x-4 "}>
            Talk to founders
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SiteHeader;
