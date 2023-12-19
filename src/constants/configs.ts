const isProduction = process.env.NODE_ENV === "production";

export const configuration = {
  site: {
    name: "Octolane AI",
    description: "LLM Powered B2B Data Enrichment API",
    image: "/assets/octolane-hero.png",
    themeColor: "#ffffff",
    themeColorDark: "#0a0a0a",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: "Octolane AI",
    twitterHandle: "octolane_app",
    githubHandle: "octolane-org",
  },
  isProduction,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  octolaneAPIKey: process.env.OCTOLANE_API_KEY,
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  posthog: {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_API_KEY,
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_API_HOST,
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET as string,
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
};

export const FINGERPRINT_HEADER = "x-fingerprint";
