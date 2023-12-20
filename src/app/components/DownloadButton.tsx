"use client";

import { Button } from "@/components/ui/button";
import { POSTHOG_EVENTS } from "@/constants/analytics.constant";
import { FINGERPRINT_HEADER } from "@/constants/configs";
import {
  COMPANY_ENRICHED_CSV_HEADERS,
  PERSON_ENRICHED_CSV_HEADERS,
} from "@/constants/enrich.constants";
import { useEnrichContext } from "@/contexts/enrich-context";
import { useFingerprint } from "@/hooks/fingerprint.hook";
import { useFingerprintToUserMap } from "@/hooks/fingerprintToUser.hook";
import { axios } from "@/lib/axios";
import type { APILimitResponse } from "@/types/api.type";
import { jsonToCSV } from "@/utils/jsonToCSV";
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
  const {
    showDownloadButton,
    enrichmentType,
    downloadablePersonData,
    downloadableCompanyData,
  } = useEnrichContext();
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

      jsonToCSV(
        enrichmentType === "person"
          ? PERSON_ENRICHED_CSV_HEADERS
          : COMPANY_ENRICHED_CSV_HEADERS,
        enrichmentType === "person"
          ? downloadablePersonData.map(
              person =>
                `"${person.full_name ?? ""}","${person.email}","${
                  person.job_title ?? ""
                }","${person.linkedin_url ?? ""}","${
                  person.current_company ?? ""
                }","${person.current_company_domain ?? ""}","${
                  person.email_verified ?? ""
                }","${person.seniority ?? ""}","${
                  person.contact_number ?? ""
                }"`,
            )
          : downloadableCompanyData.map(
              company =>
                `"${company.company_name ?? ""}","${company.domain}","${
                  `https://linkedin.com/${company.linkedin_url}` ?? ""
                }","${company.employee_size_range ?? ""}","${
                  company.estimated_annual_revenue ?? ""
                }","${company.twitter_url ?? ""}","${
                  company.twitter_followers ?? ""
                }","${company.primary_location ?? ""}","${
                  company.founded_at ?? ""
                }","${company.industry ?? ""}"`,
            ),
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
      const { data } = await axios.get<APILimitResponse>("/api/limit", {
        headers: { [FINGERPRINT_HEADER]: fp },
      });

      if (
        data.totalCompanyEnriched + data.totalPersonEnriched >=
        data.userEnrichmentLimit
      ) {
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
    <div className="pb-4 flex flex-col items-center gap-1">
      {showDownloadButton ? (
        <Button variant="cta" size="lg" onClick={onDownloadClick}>
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Download
        </Button>
      ) : null}
      <span className={"text-xs text-gray-500 dark:text-gray-400"}>
        {session.status === "unauthenticated" && showDownloadButton
          ? "Work email required!"
          : "No credit card required. Work email required!"}
      </span>

      <LimitExceedDialog
        open={openDialog}
        setOpen={setOpenDialog}
        limit={userEnrichLimit}
      />
    </div>
  );
};
