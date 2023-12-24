"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkle } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

type FormValues = {
  domain: string;
  isAnalyzing: boolean;
};

const CompanyDomainForm = ({ csrfToken }: { csrfToken: string | null }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  const onSubmit = useCallback(
    async (formData: FormValues) => {
      setValue("isAnalyzing", true);
      setValue("isAnalyzing", false);
    },
    [setValue],
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center my-4"
    >
      <div className="flex flex-col items-start">
        <div className="flex items-center">
          <div className="relative  rounded-md shadow-md mr-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className=" text-gray-400 h-4 w-4" />
            </div>

            <Input
              className="disabled:text-gray-900 block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 "
              type="text"
              size={50}
              placeholder="mintlify.com"
              {...domainControl}
            />
          </div>

          <Button variant="cta">
            <Sparkle className="h-4 w-4 mr-1" />
            {isAnalyzing ? "Analyzing..." : "AI Analyze"}
          </Button>
        </div>
        {errors.domain && (
          <p className="text-destructive text-xs">{errors.domain.message}</p>
        )}
      </div>
    </form>
  );
};

export default CompanyDomainForm;
