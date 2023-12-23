"use client";

import { POSTHOG_EVENTS } from "@/constants/analytics.constant";
import { CALENDAR_LINK } from "@/constants/configs";
import { COMPANY_ENRICHED_CSV_HEADERS } from "@/constants/enrich.constants";
import { convertCompanyDataForCSV } from "@/core/company/actions";
import { getEnrichmentLimitByFingerprint } from "@/core/user/queries";
import { useFingerprint } from "@/hooks/fingerprint.hook";
import type { CompanyEnrichData } from "@/types/PersonEnrich.type";
import type { EnrichmentType } from "@/types/app.type";
import { clearURLSearchParams } from "@/utils/common";
import { downloadCSV } from "@/utils/downloadCSV";
import type { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import LimitExceedDialog from "./LimitExceedDialog";

export const DownloadingData = ({
  downloadableData,
  downloadType = "company",
}: {
  downloadableData: CompanyEnrichData[];
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

    downloadCSV(
      COMPANY_ENRICHED_CSV_HEADERS,
      convertCompanyDataForCSV(downloadableData),
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
          className="text-blue-600"
          href="mailto:one@octolane.com"
          target="_blank"
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
