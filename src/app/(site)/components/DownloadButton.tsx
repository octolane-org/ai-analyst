"use client";

import { Button } from "@/components/ui/button";
import { POSTHOG_EVENTS } from "@/constants/analytics.constant";
import { COMPANY_ENRICHED_CSV_HEADERS } from "@/constants/enrich.constants";
import { useEnrichContext } from "@/contexts/enrich-context";
import { convertCompanyDataForCSV } from "@/core/company/actions";
import { getEnrichmentLimitByFingerprint } from "@/core/user/queries";
import { useFingerprint } from "@/hooks/fingerprint.hook";
import { useFingerprintToUserMap } from "@/hooks/fingerprintToUser.hook";
import { downloadCSV } from "@/utils/jsonToCSV";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import type { AxiosError } from "axios";
import { signIn, useSession } from "next-auth/react";
import posthog from "posthog-js";
import { useState } from "react";
import { toast } from "sonner";

import LimitExceedDialog from "./LimitExceedDialog";

export const DownloadButton = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [userEnrichLimit, setUserEnrichLimit] = useState(500);

  useFingerprintToUserMap();
  const { showDownloadButton, enrichmentType, downloadableCompanyData } =
    useEnrichContext();
  const session = useSession();
  const { getFingerprint } = useFingerprint();

  const onDownloadClick = async () => {
    if (session.status === "unauthenticated") {
      const fingerprint = await getFingerprint();
      signIn("google", {
        callbackUrl: `/?fp=${fingerprint}&action=${enrichmentType}`,
      });
    } else {
      const hasLimit = await checkLimit();

      if (!hasLimit) {
        posthog.capture(
          POSTHOG_EVENTS.LIMIT_EXCEEDED,
          session.status === "authenticated"
            ? { email: session.data.user?.email }
            : {},
        );
        return;
      }

      downloadCSV(
        COMPANY_ENRICHED_CSV_HEADERS,
        convertCompanyDataForCSV(downloadableCompanyData),
        `octolane-${enrichmentType}-enrichment.csv`,
      );

      posthog.capture(
        POSTHOG_EVENTS.DOWNLOAD,
        session.status === "authenticated"
          ? { email: session.data.user?.email }
          : {},
      );
    }
  };

  const checkLimit = async () => {
    const fp = await getFingerprint();
    try {
      const { data } = await getEnrichmentLimitByFingerprint(fp);

      if (data.totalCompanyEnriched >= data.userEnrichmentLimit) {
        setOpenDialog(true);
        setUserEnrichLimit(data.userEnrichmentLimit);
        return false;
      }
      return true;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        console.error(error.response.data);
        toast.error("Something went wrong. Please try again later.");
      }
      return false;
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {showDownloadButton ? (
        <Button variant="secondary" size="xs" onClick={onDownloadClick}>
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Export
        </Button>
      ) : null}

      <LimitExceedDialog
        open={openDialog}
        setOpen={setOpenDialog}
        limit={userEnrichLimit}
      />
    </div>
  );
};
