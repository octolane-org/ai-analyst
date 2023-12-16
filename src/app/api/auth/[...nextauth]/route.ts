import { configuration } from "@/constants/configs";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const authHandler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: configuration.auth.google.clientId,
      clientSecret: configuration.auth.google.clientSecret,
    }),
  ],
});

export { authHandler as GET, authHandler as POST };
