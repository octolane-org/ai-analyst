"use client";

import { Button } from "@/components/ui/button";
import { useEnrichContext } from "@/contexts/enrich-context";
import { useFingerprint } from "@/hooks/fingerprint.hook";
import { useFingerprintToUserMap } from "@/hooks/fingerprintToUser.hook";
import { signIn, useSession } from "next-auth/react";
import { toast } from "sonner";

export const DownloadButton = () => {
  useFingerprintToUserMap();
  const { showDownloadButton, enrichmentType } = useEnrichContext();
  const session = useSession();
  const { getFingerprint } = useFingerprint();

  const onDownloadClick = async () => {
    if (session.status === "unauthenticated") {
      const fingerprint = await getFingerprint();
      signIn("google", {
        callbackUrl: `/?fp=${fingerprint}&action=${enrichmentType}`,
      });
    } else {
      toast.info("Downloading...");
    }
  };

  return (
    <div className="pb-4 flex flex-col items-center gap-1">
      {showDownloadButton ? (
        <Button variant="cta" onClick={onDownloadClick}>
          {session.status === "unauthenticated"
            ? "Register to download"
            : "Download"}
        </Button>
      ) : null}
      <span className={"text-xs text-gray-500 dark:text-gray-400"}>
        {session.status === "unauthenticated" && showDownloadButton
          ? "Work email required!"
          : "No credit card required."}
      </span>
    </div>
  );
};
