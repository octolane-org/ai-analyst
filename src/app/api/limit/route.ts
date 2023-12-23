import { FINGERPRINT_HEADER } from "@/constants/configs";
import { getCompanyEnrichmentCountByFingerprint } from "@/core/company/queries";
import { getUserByEmail } from "@/core/user/queries";
import { captureApiException } from "@/lib/sentry/sentry-browser";
import type { APILimitResponse } from "@/types/api.type";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { nextAuthOptions } from "../auth/[...nextauth]/options";

export async function GET(request: Request, response: Response) {
  // Get fingerpring from header
  const headerFingerprint = request.headers.get(FINGERPRINT_HEADER);
  if (!headerFingerprint) {
    return NextResponse.json(
      { message: "Fingerprint is required" },
      { status: HttpStatusCode.Forbidden },
    );
  }

  try {
    const session = await getServerSession(nextAuthOptions);
    const email = session ? session.user?.email : null;
    let fingerprint = headerFingerprint;
    let enrichmentLimit = 500;

    if (email) {
      const user = await getUserByEmail(email);
      fingerprint = user?.fingerprint || headerFingerprint;
      enrichmentLimit = user?.enrichment_limit || 500;
    }

    const totalCompanyEnriched =
      await getCompanyEnrichmentCountByFingerprint(fingerprint);

    const result: APILimitResponse = {
      totalCompanyEnriched,
      userFingerprint: fingerprint,
      userEnrichmentLimit: enrichmentLimit,
    };

    return Response.json(result);
  } catch (err) {
    console.error(err);

    captureApiException(err, {
      fingerprint: headerFingerprint,
    });

    return NextResponse.json(
      { error: "Cannot download enrich result now" },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
