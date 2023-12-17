import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  PersonCSVData,
  PersonEnrichData,
} from "@/types/PersonEnrich.type";
import { cn } from "@/utils/common";
import { useEffect, useState } from "react";

type PersonTableProps = {
  rowData: PersonCSVData[];
};

export const PersonTable = ({ rowData }: PersonTableProps) => {
  const [enrichedData, setEnrichedData] = useState<PersonEnrichData[]>([]);
  const [processingEmails, setProcessingEmails] = useState<string[]>([]);

  useEffect(() => {
    if (rowData) {
      const newData = rowData.map((row): PersonEnrichData => {
        setProcessingEmails(prev => [...prev, row.email]);
        mockRowProcess(row);

        return {
          email: row.email,
        };
      });
      setEnrichedData(newData);
    }
  }, [rowData]);

  const mockRowProcess = (data: PersonCSVData) => {
    // pause for 2 seconds
    return new Promise<PersonCSVData>(resolve => {
      setTimeout(
        () => {
          setEnrichedData(prev =>
            prev.map((row, index) => {
              if (row.email === data.email) {
                return {
                  email: data.email,
                  full_name: "John Doe " + (index + 1),
                  contact_number: "123456789",
                  current_company: "Acme Inc",
                  current_company_domain: "acme.com",
                  email_verified: true,
                  first_name: "John",
                  last_name: "Doe",
                  job_title: "Software Engineer",
                  linkedin_url: "https://linkedin.com/johndoe",
                  seniority: "Senior",
                };
              }
              return row;
            }),
          );
          setProcessingEmails(prev =>
            prev.filter(email => email !== data.email),
          );
          resolve(data);
        },
        Math.random() * 5000 + 1000,
      );
    });
  };

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">#</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Domain</TableHead>
          <TableHead>Job Title</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enrichedData.map((row, index) => {
          const isProcessing = processingEmails.includes(row.email);

          return (
            <TableRow key={row.email}>
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
  );
};

const PersonEnrichedCell = ({
  data,
  isProcessing,
}: {
  data?: string;
  isProcessing: boolean;
}) => {
  const [displayedValue, setDisplayedValue] = useState("");

  useEffect(() => {
    let i = 0;
    const typingEffect = setInterval(() => {
      if (!data) return;

      if (i < data.length) {
        setDisplayedValue(prevName => prevName + data[i]);
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, 100);

    return () => clearInterval(typingEffect);
  }, [data]);

  return (
    <TableCell>
      <div
        className={cn("px-1", {
          "animate-pulse bg-zinc-200 rounded-md": isProcessing,
        })}
      >
        {data}
      </div>
    </TableCell>
  );
};