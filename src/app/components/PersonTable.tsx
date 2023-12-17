import { TypingEffect } from "@/components/TypingEffect";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFingerprint } from "@/hooks/fingerprint.hook";
import { axios } from "@/lib/axios";
import type {
  PersonCSVData,
  PersonEnrichData,
} from "@/types/PersonEnrich.type";
import { cn } from "@/utils/common";
import { useCallback, useEffect, useState } from "react";

type PersonTableProps = {
  rowData: PersonCSVData[];
  csrfToken: string | null;
};

export const PersonTable = ({ rowData, csrfToken }: PersonTableProps) => {
  const [enrichedData, setEnrichedData] = useState<PersonEnrichData[]>([]);
  const [processingEmails, setProcessingEmails] = useState<string[]>([]);
  const [dataMissingFor, setDataMissingFor] = useState<string[]>([]);

  const { getFingerprint } = useFingerprint();

  const updateEnrichedList = useCallback((data: PersonEnrichData) => {
    setEnrichedData(prev => {
      setProcessingEmails(prev => prev.filter(email => email !== data.email));
      return prev.map(row => {
        return row.email === data.email ? data : row;
      });
    });
  }, []);

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
          },
        );
        updateEnrichedList(data);
      } catch (err) {
        updateEnrichedList(getDefaultPersonEnrichData(personData.email));
        setDataMissingFor(prev => [...prev, personData.email]);
      }
    },
    [csrfToken, getFingerprint, updateEnrichedList],
  );

  useEffect(() => {
    if (rowData) {
      const newData = rowData.map((row): PersonEnrichData => {
        setProcessingEmails(prev => [...prev, row.email]);
        getPersonEnrichedData(row);
        return row;
      });
      setEnrichedData(newData);
    }
  }, [getPersonEnrichedData, rowData]);

  // const mockRowProcess = (data: PersonCSVData) => {
  //   // pause for 2 seconds
  //   return new Promise<PersonCSVData>(resolve => {
  //     setTimeout(
  //       () => {
  //         setEnrichedData(prev => {
  //           setProcessingEmails(prev =>
  //             prev.filter(email => email !== data.email),
  //           );

  //           return prev.map((row, index) => {
  //             if (row.email === data.email) {
  //               return {
  //                 email: data.email,
  //                 full_name: "John Doe " + (index + 1),
  //                 contact_number: "123456789",
  //                 current_company: "Acme Inc",
  //                 current_company_domain: "acme.com",
  //                 email_verified: true,
  //                 first_name: "John",
  //                 last_name: "Doe",
  //                 job_title: "Software Engineer",
  //                 linkedin_url: "https://linkedin.com/johndoe",
  //                 seniority: "Senior",
  //               };
  //             }
  //             return row;
  //           });
  //         });
  //         resolve(data);
  //       },
  //       Math.random() * 5000 + 1000,
  //     );
  //   });
  // };

  return (
    <div className="mt-8">
      <h3 className="font-semibold leading-none tracking-tight">
        {processingEmails.length > 0
          ? `Analysing ${rowData.length - dataMissingFor.length} out of ${
              rowData.length
            }`
          : `Found ${dataMissingFor.length} out of ${rowData.length}`}
      </h3>
      <Table className="text-justify mt-8">
        <TableHeader>
          <TableRow>
            <TableHead className="w-2">#</TableHead>
            <TableHead className="w-1/5">Email</TableHead>
            <TableHead className="w-1/5">Name</TableHead>
            <TableHead className="w-1/6">Company</TableHead>
            <TableHead className="w-1/6">Domain</TableHead>
            <TableHead className="w-1/4">Job Title</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrichedData.map((row, index) => {
            const isProcessing = processingEmails.includes(row.email);
            return (
              <TableRow key={row.email} className="transition-all">
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
