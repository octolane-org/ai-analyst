import { nextAuthOptions } from "@/lib/next-auth-config";
import NextAuth from "next-auth/next";

const authHandler = NextAuth(nextAuthOptions);

export { authHandler as GET, authHandler as POST };
