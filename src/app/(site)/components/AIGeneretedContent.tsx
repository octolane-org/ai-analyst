"use client";

import LinkedInIcon from "@/components/icons/LinkedIn";
import TwitterIcon from "@/components/icons/Twitter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CompanyEnrichData } from "@/types/PersonEnrich.type";
import { cn, currencyFormat } from "@/utils/common";
import {
  Banknote,
  Blocks,
  Building,
  CircleDollarSign,
  Copy,
  MapPin,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const AIGeneretedContent = ({
  content,
  companyData,
  isGenerating,
}: {
  content: string;
  isGenerating: boolean;
  companyData: CompanyEnrichData | null;
}) => {
  const [textSize, setTextSize] = useState<"text-sm" | "text-md">("text-sm");

  if (content.trim().length < 1) return null;

  const copyAiContent = () => {
    navigator.clipboard.writeText(content);
    toast.success("AI content copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-3 items-end border border-dashed p-2 rounded-lg">
      <div className="w-full flex items-start justify-between border-b border-dashed pb-5">
        {companyData ? (
          <div className="flex flex-col items-start gap-3">
            <div className="flex">
              <Image
                className="h-12 w-12 rounded-md mr-1"
                height={48}
                width={48}
                src={`https://logo.clearbit.com/${companyData?.domain}`}
                alt={companyData?.company_name || "Company Logo"}
              />
              <div className="flex flex-col items-start ml-2">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium text-gray-900">
                    {companyData.company_name}
                  </p>
                  {companyData.linkedin_url ? (
                    <a
                      href={`https://linkedin.com/company/${companyData.linkedin_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedInIcon className="h-5 w-5" />
                    </a>
                  ) : null}
                  {companyData.twitter_url ? (
                    <a
                      href={`https://twitter.com/${companyData.twitter_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TwitterIcon className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
                <a
                  href={companyData.domain}
                  target="_blank"
                  className="truncate text-sm text-gray-500"
                >
                  {companyData.domain}
                </a>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {companyData.estimated_total_fund_raised ? (
                <span className="mr-2 inline-flex items-center gap-x-1.5 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                  <Banknote className="h-4 w-4" />
                  {currencyFormat(companyData.estimated_total_fund_raised)}{" "}
                  raised
                </span>
              ) : null}
              {companyData.estimated_annual_revenue ? (
                <span className="inline-flex items-center gap-x-1.5 rounded-md bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700">
                  <CircleDollarSign className="h-4 w-4" />
                  {companyData.estimated_annual_revenue} ARR
                </span>
              ) : null}
              {companyData.founded_at ? (
                <span className="inline-flex items-center gap-x-1.5 rounded-md bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700">
                  <Blocks className="h-4 w-4" />
                  Founded at {companyData.founded_at}
                </span>
              ) : null}
              {companyData.employee_size_range ? (
                <span className="inline-flex items-center gap-x-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  <Users className="h-4 w-4" />
                  {companyData.employee_size_range} headcount
                </span>
              ) : null}
              {companyData.industry ? (
                <span className="inline-flex items-center gap-x-1.5 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                  <Building className="h-4 w-4" />
                  {companyData.industry}
                </span>
              ) : null}
              {companyData.primary_location ? (
                <span className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                  <MapPin className="h-4 w-4" />
                  {companyData.primary_location}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <Tabs value={textSize}>
            <TabsList>
              <TabsTrigger
                value="text-sm"
                onClick={() => setTextSize("text-sm")}
              >
                a
              </TabsTrigger>
              <TabsTrigger
                value="text-md"
                onClick={() => setTextSize("text-md")}
              >
                A
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button
            size="xs"
            variant="secondary"
            disabled={isGenerating}
            onClick={copyAiContent}
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy AI Content
          </Button>
        </div>
      </div>
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => {
            const href = props.href
              ? props.href.startsWith("http")
                ? props.href
                : `https://${props.href}`
              : "";
            return (
              <span className="inline-flex items-center text-blue-500">
                <a
                  className="text-blue-500 font-medium hover:underline"
                  {...props}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="3"
                  stroke="currentColor"
                  className="w-4 h-4 ml-1"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </span>
            );
          },
        }}
        className={cn(
          "whitespace-normal leading-7 text-slate-700 text-left transition-all",
          {
            "text-sm": textSize === "text-sm",
            "text-md": textSize === "text-md",
          },
        )}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default AIGeneretedContent;
