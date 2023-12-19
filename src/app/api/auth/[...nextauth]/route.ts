import { configuration } from "@/constants/configs";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const nextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: configuration.auth.google.clientId,
      clientSecret: configuration.auth.google.clientSecret,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: configuration.auth.secret,
};

const authHandler = NextAuth(nextAuthOptions);

export { authHandler as GET, authHandler as POST };
