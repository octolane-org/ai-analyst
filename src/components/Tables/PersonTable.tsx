import { TypingEffect } from "@/components/TypingEffect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrichContext } from "@/contexts/enrich-context";
import { useFingerprint } from "@/hooks/fingerprint.hook";
import { axios } from "@/lib/axios";
import type {
  PersonCSVData,
  PersonEnrichData,
} from "@/types/PersonEnrich.type";
import { cn } from "@/utils/common";
import { SparklesIcon } from "@heroicons/react/20/solid";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Spinner } from "../Spinner";

type PersonTableProps = {
  rowData: PersonCSVData[];
  csrfToken: string | null;
};

export const PersonTable = ({ rowData, csrfToken }: PersonTableProps) => {
  const { setShowDownloadButton, setDownloadablePersonData } =
    useEnrichContext();

  const [enrichedData, setEnrichedData] = useState<PersonEnrichData[]>([]);
  const [processingEmails, setProcessingEmails] = useState<string[]>([]);
  const [dataMissingFor, setDataMissingFor] = useState<string[]>([]);

  const { getFingerprint } = useFingerprint();

  const isEnriching = useMemo(() => {
    const isEnriching = processingEmails.length > 0;
    setShowDownloadButton(!isEnriching);
    if (!isEnriching) {
      setDownloadablePersonData(enrichedData);
    }
    return isEnriching;
  }, [
    processingEmails.length,
    setShowDownloadButton,
    setDownloadablePersonData,
    enrichedData,
  ]);

  const updateEnrichedList = useCallback(
    (data: PersonEnrichData, success: boolean) => {
      setEnrichedData(prev => {
        setProcessingEmails(prev => prev.filter(email => email !== data.email));
        if (success) {
          return prev.map(row => {
            return row.email === data.email ? data : row;
          });
        } else {
          return prev.filter(row => row.email !== data.email);
        }
      });
    },
    [],
  );

  const getPersonEnrichedData = useCallback(
    async (personData: PersonCSVData) => {
      const fp = await getFingerprint();
      try {
        const { data } = await axios.post<PersonEnrichData>(
          "/api/person",
          personData,
          {
            headers: {
              "X-CSRF-Token": csrfToken,
              "x-fingerprint": fp,
            },
            timeout: 10000,
          },
        );
        updateEnrichedList(data, true);
      } catch (err) {
        updateEnrichedList(getDefaultPersonEnrichData(personData.email), false);
        setDataMissingFor(prev => [...prev, personData.email]);
      }
    },
    [csrfToken, getFingerprint, updateEnrichedList],
  );

  useEffect(() => {
    if (rowData) {
      const batchSize = 5;
      let index = 0;

      const processBatch = async () => {
        const batch = rowData.slice(index, index + batchSize);
        await Promise.all(batch.map(getPersonEnrichedData));

        index += batchSize;
        if (index < rowData.length) {
          processBatch();
        }
      };

      processBatch();
      setProcessingEmails(rowData.map(row => row.email));
      setEnrichedData(rowData);
    }
  }, [getPersonEnrichedData, rowData]);

  return (
    <div className="mt-8">
      <div className="w-full justify-center flex items-center gap-1">
        {isEnriching ? <Spinner /> : null}
        <h3 className="font-semibold leading-none tracking-tight">
          {isEnriching
            ? `Analysing ${rowData.length - dataMissingFor.length} out of ${
                rowData.length
              }`
            : `Found ${enrichedData.length} out of ${rowData.length}`}
        </h3>
      </div>
      <Table className="text-justify mt-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-2">#</TableHead>
            <TableHead className="w-1/5">Email</TableHead>
            <EnrichColumnHeader title="Name" isEnriching={isEnriching} />
            <EnrichColumnHeader title="Company" isEnriching={isEnriching} />
            <EnrichColumnHeader title="Domain" isEnriching={isEnriching} />
            <EnrichColumnHeader title="Job Title" isEnriching={isEnriching} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrichedData.slice(0, 10).map((row, index) => {
            const isProcessing = processingEmails.includes(row.email);
            return (
              <TableRow
                key={row.email}
                className={cn("transition-all", {
                  "bg-red-50": dataMissingFor.includes(row.email),
                })}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{row.email}</TableCell>
                <PersonEnrichedCell
                  data={row.full_name}
                  isProcessing={isProcessing}
                />
                <PersonEnrichedCell
                  data={row.current_company}
                  isProcessing={isProcessing}
                />
                <PersonEnrichedCell
                  data={row.current_company_domain}
                  isProcessing={isProcessing}
                />
                <PersonEnrichedCell
                  data={row.job_title}
                  isProcessing={isProcessing}
                />
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
}: {
  title: string;
  isEnriching: boolean;
}) => {
  return (
    <TableHead className="w-1/5">
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

const getDefaultPersonEnrichData = (email: string): PersonEnrichData => ({
  email,
  full_name: "--",
  contact_number: "--",
  current_company: "--",
  current_company_domain: "--",
  email_verified: false,
  first_name: "--",
  last_name: "--",
  job_title: "--",
  linkedin_url: "--",
  seniority: "--",
});
