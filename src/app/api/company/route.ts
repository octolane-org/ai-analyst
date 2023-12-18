import { configuration } from "@/constants/configs";
import { axios } from "@/lib/axios";
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
    const { data } = await axios.post<{ data: CompanyEnrichData }>(
      "https://enrich.octolane.com/v1/company",
      { domain: companyData.domain },
      { headers: { "x-api-key": configuration.octolaneAPIKey } },
    );

    const personEnrichedData = data.data;

    // // store the data in DB with fingerprint
    // prisma.$transaction(async trx => {
    //   const person = await trx.personEnrichment.upsert({
    //     where: { email: personEnrichedData.domain },
    //     create: personEnrichedData,
    //     update: personEnrichedData,
    //   });

    //   const personForFingerprint = await trx.personForFingerprint.findFirst({
    //     where: { fingerprint, personId: person.id },
    //   });

    //   if (!personForFingerprint) {
    //     await trx.personForFingerprint.create({
    //       data: {
    //         fingerprint,
    //         personId: person.id,
    //       },
    //     });
    //   }
    // });

    return Response.json(personEnrichedData);
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
