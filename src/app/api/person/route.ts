import { configuration } from "@/constants/configs";
import { axios } from "@/lib/axios";
import type { PersonCSVData } from "@/types/PersonEnrich.type";
import { HttpStatusCode, type AxiosError } from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Get person data from body
  const personData = (await request.json()) as PersonCSVData;

  // Get fingerpring from header
  const fingerprint = request.headers.get("x-fingerprint");
  if (!fingerprint) {
    return NextResponse.json(
      { message: "Fingerprint is required" },
      { status: HttpStatusCode.Forbidden },
    );
  }

  try {
    const { data } = await axios.post(
      "https://enrich.octolane.com/v1/person-by-email",
      { email: personData.email },
      { headers: { "x-api-key": configuration.octolaneAPIKey } },
    );
    // store the data in DB with fingerprint
    return Response.json(data.data);
  } catch (err) {
    const error = err as AxiosError;

    if (error.response) {
      console.error(error.response.data);
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }

    return NextResponse.json(
      { error: "Couldn't enrich this data " },
      {
        status: HttpStatusCode.InternalServerError,
      },
    );
  }
}
