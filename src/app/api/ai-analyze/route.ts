import { FINGERPRINT_HEADER } from "@/constants/configs";
import { OpenAIStream } from "@/lib/openai/stream";
import type { CompanyCSVData } from "@/types/PersonEnrich.type";
import type { OpenAIStreamPayload } from "@/types/openai.type";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  // Get fingerpring from header
  const fingerprint = request.headers.get(FINGERPRINT_HEADER);
  if (!fingerprint) {
    return NextResponse.json(
      { message: "Fingerprint is required" },
      { status: HttpStatusCode.Forbidden },
    );
  }

  const companyData = (await request.json()) as CompanyCSVData;

  // const content = await analyzeCompanyWithMetaPhore(companyData.domain);

  const apiKey = process.env.YOU_API;
  if (!apiKey) {
    throw new Error("API key is not defined");
  }

  const options = {
    method: "GET",
    headers: {
      "X-API-Key": apiKey,
    },
  };

  const websearch = await fetch(
    `https://api.ydc-index.io/search?query=in%20depth%20report%20on%20company%20${companyData.domain}`,
    options,
  );
  const content = await websearch.json();

  const payload: OpenAIStreamPayload = {
    model: "gpt-4-1106-preview",
    messages: [
      {
        role: "system",
        content:
          "You are a research assistant who creates in-depth research reports on companies in markdown format.",
      },
      {
        role: "user",
        content: `Always write in markdown format. \n Generate a comprehensive business analysis report with as many as citations possible for company **" 
        \n${companyData.domain}** Focus on **"${companyData.domain}** 
        covering its founding story, mission, products/services, market positioning, competitive landscape, financial performance, and future outlook. Highlight key milestones, management strategies, customer demographics, and industry trends. Include analytical graphs, executive summaries, and strategic recommendations. Update the content to reflect the latest developments up to the latest. Add necessary citations hyperlink inline using markdown format. Do not provide Note at the end because you are getting up to date information through our system to your prompt and use information:
          \n${JSON.stringify(content)} \n `,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  // Create a new response
  const response = new Response(stream);

  // Return the response
  return response;
}
