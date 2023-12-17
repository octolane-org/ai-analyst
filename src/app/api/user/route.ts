import { prisma } from "@/lib/prisma";
import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const userData = (await request.json()) as {
    fingerprint: string;
    email: string;
  };

  if (!userData.email || !userData.fingerprint) {
    return NextResponse.json(
      { message: "Email and fingerprint is required" },
      { status: HttpStatusCode.Forbidden },
    );
  }

  try {
    await prisma.user.update({
      where: {
        email: userData.email,
      },
      data: {
        fingerprint: userData.fingerprint,
      },
    });

    return Response.json({ message: "User mapped" });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Couldn't mapped this user" },
      {
        status: HttpStatusCode.InternalServerError,
      },
    );
  }
}
