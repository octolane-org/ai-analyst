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
    convertKitFormId: "",
    locale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  },
  isProduction,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  posthog: {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_API_KEY,
    apiHost: process.env.NEXT_PUBLIC_POSTHOG_API_HOST,
  },
};
