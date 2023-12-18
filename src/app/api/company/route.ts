import { configuration } from "@/constants/configs";
import { axios } from "@/lib/axios";
import { prisma } from "@/lib/prisma";
import type {
  CompanyCSVData,
  CompanyEnrichData,
} from "@/types/PersonEnrich.type";
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

  try {
    const { data } = await axios.post<{
      data: Omit<CompanyEnrichData, "founded_at">;
    }>(
      "https://enrich.octolane.com/v1/company",
      { domain: companyData.domain },
      { headers: { "x-api-key": configuration.octolaneAPIKey } },
    );

    const companyEnrichedData = data.data;

    // store the data in DB with fingerprint
    prisma.$transaction(async trx => {
      const company = await trx.companyEnrichment.upsert({
        where: { domain: companyEnrichedData.domain },
        create: companyEnrichedData,
        update: companyEnrichedData,
      });

      const companyForFingerprint = await trx.companyForFingerprint.findFirst({
        where: { fingerprint, companyId: company.id },
      });

      if (!companyForFingerprint) {
        await trx.companyForFingerprint.create({
          data: {
            fingerprint,
            companyId: company.id,
          },
        });
      }
    });

    return Response.json(companyEnrichedData);
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
      console.error(error.response.data);
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }

    return NextResponse.json(
      { error: "Couldn't enrich this data" },
      {
        status: HttpStatusCode.InternalServerError,
      },
    );
  }
}
