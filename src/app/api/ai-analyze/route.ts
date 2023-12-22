import { FINGERPRINT_HEADER } from "@/constants/configs";
import { analyzeCompanyWithMetaPhore } from "@/lib/metaphore";
import type { OpenAIStreamPayload } from "@/lib/openai/stream";
import { OpenAIStream } from "@/lib/openai/stream";
import type { CompanyCSVData } from "@/types/PersonEnrich.type";
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

  const content = await analyzeCompanyWithMetaPhore(companyData.domain);

  const payload: OpenAIStreamPayload = {
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: `Always answer in markdown format and make concise summary of these contents:
          ${content}`,
      },
    ],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  // Create a new response
  const response = new Response(stream);

  // Set CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE",
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  // Return the response
  return response;
}
