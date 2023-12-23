"use client";

import { DownloadButton } from "@/app/components/DownloadButton";
import { TypingEffect } from "@/components/TypingEffect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FINGERPRINT_HEADER } from "@/constants/configs";
import { useEnrichContext } from "@/contexts/enrich-context";
import { useFingerprint } from "@/hooks/fingerprint.hook";
import { axios } from "@/lib/axios";
import type {
  CompanyCSVData,
  CompanyEnrichData,
} from "@/types/PersonEnrich.type";
import { cn, currencyFormat } from "@/utils/common";
import { SparklesIcon } from "@heroicons/react/20/solid";
import type { AxiosError } from "axios";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Spinner } from "../../components/Spinner";
import LinkedInIcon from "../../components/icons/LinkedIn";
import TwitterIcon from "../../components/icons/Twitter";
import { Button } from "../../components/ui/button";

import AIGeneretedContent from "./AIGeneretedContent";

type CompanyTableProps = {
  csrfToken: string | null;
};

export const CompanyTable = ({ csrfToken }: CompanyTableProps) => {
  const { setShowDownloadButton, setDownloadableCompanyData, companyCSVData } =
    useEnrichContext();

  const [enrichedData, setEnrichedData] = useState<CompanyEnrichData[]>([]);
  const [processingDomains, setProcessingDomains] = useState<string[]>([]);
  const [dataMissingFor, setDataMissingFor] = useState<string[]>([]);
  const [generating, setGenerating] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>("");

  const { getFingerprint } = useFingerprint();

  const isEnriching = useMemo(() => {
    const isEnriching = processingDomains.length > 0;
    setShowDownloadButton(!isEnriching);
    if (!isEnriching) {
      setDownloadableCompanyData(enrichedData);
    }
    return isEnriching;
  }, [
    processingDomains.length,
    setShowDownloadButton,
    setDownloadableCompanyData,
    enrichedData,
  ]);

  const updateEnrichedList = useCallback(
    (data: CompanyEnrichData, success: boolean) => {
      setEnrichedData(prev => {
        setProcessingDomains(prev =>
          prev.filter(email => email !== data.domain),
        );
        if (success) {
          return prev.map(row => {
            return row.domain === data.domain ? data : row;
          });
        } else {
          return prev.filter(row => row.domain !== data.domain);
        }
      });
    },
    [],
  );

  const getCompanyEnrichedData = useCallback(
    async (companyData: CompanyCSVData) => {
      const fp = await getFingerprint();
      try {
        const { data } = await axios.post<CompanyEnrichData>(
          "/api/company",
          companyData,
          {
            headers: {
              "X-CSRF-Token": csrfToken,
              "x-fingerprint": fp,
            },
            timeout: 20000,
          },
        );
        updateEnrichedList(data, true);
      } catch (err) {
        updateEnrichedList(
          getDefaultCompanyEnrichData(companyData.domain),
          false,
        );
        setDataMissingFor(prev => [...prev, companyData.domain]);
      }
    },
    [csrfToken, getFingerprint, updateEnrichedList],
  );

  useEffect(() => {
    if (companyCSVData) {
      const batchSize = 5;
      let index = 0;

      const processBatch = async () => {
        const batch = companyCSVData.slice(index, index + batchSize);
        await Promise.all(batch.map(getCompanyEnrichedData));

        index += batchSize;
        if (index < companyCSVData.length) {
          processBatch();
        }
      };

      processBatch();
      setProcessingDomains(companyCSVData.map(row => row.domain));
      setEnrichedData(companyCSVData);
    }
  }, [getCompanyEnrichedData, companyCSVData]);

  const aiAnalyze = async (domain: string) => {
    setGeneratedContent("");
    setGenerating(domain);

    try {
      const response = await fetch("/api/ai-analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [FINGERPRINT_HEADER]: await getFingerprint(),
        },
        body: JSON.stringify({ domain }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      // This data is a ReadableStream
      const data = response.body;
      if (!data) {
        return;
      }

      const reader = data.getReader();

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        setGeneratedContent(prev => prev + chunkValue);
      }
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      if (error.response) {
        toast.error(error.response.data.error);
      }
    }

    setGenerating(null);
  };

  if (!companyCSVData) return null;

  return (
    <div className="mt-8 max-w-3xl min-h-[500px]">
      <AIGeneretedContent
        content={generatedContent}
        isGenerating={generating !== null}
      />
      <div className="w-full flex justify-between items-center mt-8 mb-2 text-zinc-500">
        <div className="flex items-center gap-1">
          {isEnriching && companyCSVData ? (
            <div className="flex items-center gap-2">
              {isEnriching ? <Spinner /> : null}
              <p className="font-semibold leading-none tracking-tight text-sm">
                Analysing {companyCSVData.length - dataMissingFor.length} out of{" "}
                {companyCSVData.length}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-start">
              <DownloadButton />
              <Sparkles className="w-4" />
              <p className="font-semibold leading-none tracking-tight text-sm">
                Found {enrichedData.length} out of {companyCSVData?.length}
              </p>
            </div>
          )}
        </div>
        <p className="text-sm text-zinc-600">Scroll right to see more data</p>
      </div>
      <Table className="text-justify overflow-auto w-max">
        <TableHeader>
          <TableRow>
            <TableHead className="w-2">#</TableHead>
            <TableHead className="sticky left-0 bg-white">Domain</TableHead>
            <EnrichColumnHeader
              title="Company Name"
              isEnriching={isEnriching}
            />
            <EnrichColumnHeader
              title="Social Presense"
              isEnriching={isEnriching}
            />
            <EnrichColumnHeader
              title="Est. Employee Range"
              isEnriching={isEnriching}
            />
            <EnrichColumnHeader
              title="Est. Fund Raised"
              isEnriching={isEnriching}
            />
            <EnrichColumnHeader title="Industry" isEnriching={isEnriching} />
            <EnrichColumnHeader
              title="Primary Location"
              isEnriching={isEnriching}
            />
            <EnrichColumnHeader
              title="Est. Annual Revenue"
              isEnriching={isEnriching}
            />
            <EnrichColumnHeader title="Founded At" isEnriching={isEnriching} />
            <TableHead className="sticky right-0 bg-white shadow-lg"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrichedData.slice(0, 10).map((row, index) => {
            const isProcessing = processingDomains.includes(row.domain);
            return (
              <TableRow
                key={row.domain}
                className={cn("transition-all", {
                  "group bg-red-50 hover:bg-muted": dataMissingFor.includes(
                    row.domain,
                  ),
                })}
              >
                <TableCell className="font-medium">{index + 1}.</TableCell>
                <TableCell
                  className={cn(
                    "sticky left-0 bg-white z-[2] shadow-xl hover:bg-muted",
                    {
                      "bg-red-50 group-hover:bg-muted": dataMissingFor.includes(
                        row.domain,
                      ),
                    },
                  )}
                >
                  {row.domain}
                </TableCell>
                <PersonEnrichedCell
                  data={row.company_name}
                  isProcessing={isProcessing}
                />
                <TableCell>
                  <div className="flex items-center gap-2 justify-center">
                    <a
                      href={`https://linkedin.com/company/${row.linkedin_url}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <LinkedInIcon className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://twitter.com/${row.twitter_url}`}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <TwitterIcon className="w-5 h-5" />
                    </a>
                  </div>
                </TableCell>
                <PersonEnrichedCell
                  data={row.employee_size_range}
                  isProcessing={isProcessing}
                />
                <PersonEnrichedCell
                  data={
                    row.estimated_total_fund_raised
                      ? currencyFormat(row.estimated_total_fund_raised)
                      : ""
                  }
                  isProcessing={isProcessing}
                />
                <PersonEnrichedCell
                  data={row.industry}
                  isProcessing={isProcessing}
                />
                <PersonEnrichedCell
                  data={row.primary_location}
                  isProcessing={isProcessing}
                />
                <PersonEnrichedCell
                  data={row.estimated_annual_revenue}
                  isProcessing={isProcessing}
                />
                <PersonEnrichedCell
                  data={row.founded_at?.toString()}
                  isProcessing={isProcessing}
                />
                <TableCell className="sticky right-0 bg-white flex justify-center shadow-xl">
                  <Button
                    variant={
                      generating && generating !== row.domain
                        ? "secondary"
                        : "default"
                    }
                    size="sm"
                    onClick={() => aiAnalyze(row.domain)}
                    disabled={generating !== null}
                    className="flex items-center gap-1"
                  >
                    {generating === row.domain ? <Spinner /> : null}
                    AI Analyze
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const PersonEnrichedCell = ({
  data,
  isProcessing,
}: {
  data?: string;
  isProcessing: boolean;
}) => {
  return (
    <TableCell>
      <div
        className={cn("px-1", {
          "h-5 w-full animate-pulse bg-zinc-200 rounded-md": isProcessing,
        })}
      >
        {data ? <TypingEffect text={data} /> : null}
      </div>
    </TableCell>
  );
};

const EnrichColumnHeader = ({
  title,
  isEnriching,
  className,
}: {
  className?: string;
  title: string;
  isEnriching: boolean;
}) => {
  return (
    <TableHead className={className}>
      <div className="flex items-center gap-1">
        <SparklesIcon
          className={cn("h-3", {
            "animate-bounce": isEnriching,
          })}
        />
        {title}
      </div>
    </TableHead>
  );
};

const getDefaultCompanyEnrichData = (domain: string): CompanyEnrichData => ({
  domain,
  company_name: "--",
  employee_size_range: "--",
  estimated_annual_revenue: "--",
  industry: "--",
  linkedin_url: "--",
  primary_location: "--",
  tags: ["--"],
  twitter_followers: "--",
  twitter_url: "--",
});
