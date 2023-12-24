"use client";

import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  aiAnalyzeForCompanyDomain,
  enrichCompanyByDomain,
} from "@/core/company/mutations";
import { useFingerprint } from "@/hooks/fingerprint.hook";
import type { CompanyEnrichData } from "@/types/PersonEnrich.type";
import type { AxiosError } from "axios";
import { Search, Sparkle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import AIGeneretedContent from "./AIGeneretedContent";

type FormValues = {
  domain: string;
  isAnalyzing: boolean;
};

const CompanyDomainForm = ({ csrfToken }: { csrfToken: string | null }) => {
  const [generatedContent, setGeneratedContent] = useState("");
  const [companyData, setCompanyData] = useState<CompanyEnrichData | null>(
    null,
  );

  const { getFingerprint } = useFingerprint();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      domain: "",
      isAnalyzing: false,
    },
  });
  const domainControl = register("domain", {
    required: true,
    maxLength: {
      value: 100,
      message: "Domain is too long",
    },
    pattern: {
      value:
        /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]{1,61}\.){1,}([a-zA-Z]{2,})/,
      message: "Invalid domain name",
    },
  });
  const isAnalyzing = watch("isAnalyzing");

  const onSubmit = async (formData: FormValues) => {
    setValue("isAnalyzing", true);
    setGeneratedContent("");
    setCompanyData(null);

    const fp = await getFingerprint();

    try {
      const { data } = await enrichCompanyByDomain({
        domain: formData.domain,
        fingerprint: fp,
        csrfToken: csrfToken as string,
      });
      setCompanyData(data);
    } catch (error) {}

    try {
      const reader = await aiAnalyzeForCompanyDomain(fp, formData.domain);

      if (!reader) {
        setError("domain", {
          message: "No data found for this domain",
        });
        setValue("isAnalyzing", false);
        return;
      }

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
        setError("domain", {
          message: error.response.data.error,
        });
      }
    }
    setValue("isAnalyzing", false);
  };

  return (
    <form
      className="flex flex-col items-center justify-center my-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-start mb-5">
        <div className="flex items-center">
          <div className="relative rounded-md shadow-md mr-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className=" text-gray-400 h-4 w-4" />
            </div>

            <Input
              className="disabled:text-gray-900 block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 "
              type="text"
              size={50}
              placeholder="databricks.com"
              disabled={isAnalyzing}
              {...domainControl}
            />
          </div>

          <Button variant="cta" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <Spinner className="mr-1" />
            ) : (
              <Sparkle className="h-4 w-4 mr-1" />
            )}
            {isAnalyzing ? "Analyzing..." : "AI Analyze"}
          </Button>
        </div>
        {errors.domain && (
          <p className="text-destructive text-xs">{errors.domain.message}</p>
        )}
      </div>
      <AIGeneretedContent
        companyData={companyData}
        content={generatedContent}
        isGenerating={isAnalyzing}
      />
    </form>
  );
};

export default CompanyDomainForm;
