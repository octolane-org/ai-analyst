"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/utils/common";
import { Copy } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const AIGeneretedContent = ({
  content,
  isGenerating,
}: {
  content: string;
  isGenerating: boolean;
}) => {
  const [textSize, setTextSize] = useState<"text-sm" | "text-md">("text-sm");

  if (content.trim().length < 1) return null;

  const copyAiContent = () => {
    navigator.clipboard.writeText(content);
    toast.success("AI content copied to clipboard");
  };

  return (
    <div className="flex flex-col gap-3 items-end border border-dashed p-2 rounded-lg">
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => {
            const href = props.href
              ? props.href.startsWith("http")
                ? props.href
                : `https://${props.href}`
              : "";
            return (
              <span className="inline-flex items-center text-blue-400">
                <a
                  className="text-blue-400 font-medium hover:underline"
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
      <div className="flex items-center gap-2">
        <Tabs value={textSize}>
          <TabsList>
            <TabsTrigger value="text-sm" onClick={() => setTextSize("text-sm")}>
              a
            </TabsTrigger>
            <TabsTrigger value="text-md" onClick={() => setTextSize("text-md")}>
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
  );
};

export default AIGeneretedContent;
