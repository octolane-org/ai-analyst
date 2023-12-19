import { FINGERPRINT_HEADER } from "@/constants/configs";
import { nextAuthOptions } from "@/lib/next-auth-config";
import { prisma } from "@/lib/prisma";
import type { APILimitResponse } from "@/types/api.type";
import { HttpStatusCode } from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
      const user = await prisma.user.findFirst({
        where: { email },
        select: { fingerprint: true, enrichment_limit: true },
      });
      fingerprint = user?.fingerprint || headerFingerprint;
      enrichmentLimit = user?.enrichment_limit || 500;
    }

    const [totalPersonEnriched, totalCompanyEnriched] = await Promise.all([
      prisma.personForFingerprint.count({
        where: { fingerprint },
      }),
      prisma.companyForFingerprint.count({
        where: { fingerprint },
      }),
    ]);

    const result: APILimitResponse = {
      totalPersonEnriched,
      totalCompanyEnriched,
      userFingerprint: fingerprint,
      userEnrichmentLimit: enrichmentLimit,
    };

    return Response.json(result);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Cannot download enrich result now" },
      { status: HttpStatusCode.InternalServerError },
    );
  }
}
