"use client";

import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const AIGeneretedContent = ({
  content,
  isGenerating,
}: {
  content: string;
  isGenerating: boolean;
}) => {
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
        className="whitespace-normal leading-7 text-slate-700 text-left"
      >
        {content}
      </ReactMarkdown>
      <div>
        <Button
          size="xs"
          variant="secondary"
          disabled={isGenerating}
          onClick={copyAiContent}
        >
          Copy AI Content
        </Button>
      </div>
    </div>
  );
};

export default AIGeneretedContent;
