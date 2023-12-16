"use client";

import { configuration } from "@/constants/configs";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { Fragment, useEffect } from "react";

// app/providers.tsx

if (typeof window !== "undefined") {
  const posthogKey = configuration.posthog.apiKey;
  const posthogHost = configuration.posthog.apiHost;

  if (!posthogKey || !posthogHost) {
    throw new Error("PostHog key and host must be defined");
  }

  posthog.init(posthogKey, {
    api_host: posthogHost,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  });
}

export function PostHogPageview(): JSX.Element {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return <Fragment />;
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
