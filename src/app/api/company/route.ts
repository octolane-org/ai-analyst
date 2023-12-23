import {
  getCompanyEnrichmentFromOctolane,
  saveCompanrEnrichmentDataToDBByFingerprint,
} from "@/core/company/mutations";
import { captureApiException } from "@/lib/sentry/sentry-browser";
import type { CompanyCSVData } from "@/types/PersonEnrich.type";
import { HttpStatusCode, type AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Get person data from body
  const companyData = (await request.json()) as CompanyCSVData;

  // Get fingerpring from header
  const fingerprint = request.headers.get("x-fingerprint");
  if (!fingerprint) {
    return NextResponse.json(
      { message: "Fingerprint is required" },
      { status: HttpStatusCode.Forbidden },
    );
  }

  // pause for 1 second to prevent abuse
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const { data } = await getCompanyEnrichmentFromOctolane(companyData.domain);

    const companyEnrichedData = data.data;

    // store the data in DB with fingerprint
    saveCompanrEnrichmentDataToDBByFingerprint(
      companyEnrichedData,
      fingerprint,
    );

    return Response.json(companyEnrichedData);
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
      console.error(error.response.data);
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }

    captureApiException(error, {
      fingerprint,
      companyData,
    });

    return NextResponse.json(
      { error: "Couldn't enrich this data" },
      {
        status: HttpStatusCode.InternalServerError,
      },
    );
  }
}
