"use client";

import { POSTHOG_EVENTS } from "@/constants/analytics.constant";
import { CALENDAR_LINK, FINGERPRINT_HEADER } from "@/constants/configs";
import {
  COMPANY_ENRICHED_CSV_HEADERS,
  PERSON_ENRICHED_CSV_HEADERS,
} from "@/constants/enrich.constants";
import { useFingerprint } from "@/hooks/fingerprint.hook";
import { axios } from "@/lib/axios";
import type {
  CompanyEnrichData,
  PersonEnrichData,
} from "@/types/PersonEnrich.type";
import type { APILimitResponse } from "@/types/api.type";
import type { EnrichmentType } from "@/types/app.type";
import { clearURLSearchParams } from "@/utils/common";
import { jsonToCSV } from "@/utils/jsonToCSV";
import type { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import LimitExceedDialog from "./LimitExceedDialog";

export const DownloadingData = ({
  downloadableData,
  downloadType = "person",
}: {
  downloadableData: PersonEnrichData[] | CompanyEnrichData[];
  downloadType: EnrichmentType;
}) => {
  const [downloading, setDownloading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [userEnrichLimit, setUserEnrichLimit] = useState(500);

  const session = useSession();
  const { getFingerprint } = useFingerprint();

  const checkLimit = useCallback(async () => {
    const fp = await getFingerprint();
    try {
      const { data } = await axios.get<APILimitResponse>("/api/limit", {
        headers: { [FINGERPRINT_HEADER]: fp },
      });

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
  }, [getFingerprint]);

  const downloadDataAsCSV = useCallback(async () => {
    setDownloading(true);

    const hasLimit = await checkLimit();

    if (!hasLimit) {
      posthog.capture(
        POSTHOG_EVENTS.LIMIT_EXCEEDED,
        session.status === "authenticated"
          ? { email: session.data.user?.email }
          : {},
      );
      setDownloading(false);
      clearURLSearchParams();
      return;
    }

    jsonToCSV(
      downloadType === "person"
        ? PERSON_ENRICHED_CSV_HEADERS
        : COMPANY_ENRICHED_CSV_HEADERS,
      downloadType === "person"
        ? (downloadableData as PersonEnrichData[]).map(
            person =>
              `"${person.full_name ?? ""}","${person.email}","${
                person.job_title ?? ""
              }","${person.linkedin_url ?? ""}","${
                person.current_company ?? ""
              }","${person.current_company_domain ?? ""}","${
                person.email_verified ?? ""
              }","${person.seniority ?? ""}","${person.contact_number ?? ""}"`,
          )
        : (downloadableData as CompanyEnrichData[]).map(
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
      `octolane-${downloadType}-enrichment.csv`,
    );

    posthog.capture(
      POSTHOG_EVENTS.REGISTER_TO_DOWNLOAD,
      session.status === "authenticated"
        ? { email: session.data.user?.email }
        : {},
    );

    setDownloading(false);
    clearURLSearchParams();
  }, [downloadType, checkLimit, downloadableData, session]);

  useEffect(() => {
    downloadDataAsCSV();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">
        {downloading ? "Downloading Data..." : "Downloaded Data"}
      </h2>

      <p>
        Email{" "}
        <a
          href="mailto:one@octolane.com"
          target="_blank"
          className="text-blue-600"
        >
          one@octolane.com
        </a>{" "}
        or book a{" "}
        <a href={CALENDAR_LINK} target="_blank" className="text-blue-600">
          quick 20 minutes call to talk to founders
        </a>
      </p>

      <LimitExceedDialog
        open={openDialog}
        setOpen={setOpenDialog}
        limit={userEnrichLimit}
      />
    </div>
  );
};
