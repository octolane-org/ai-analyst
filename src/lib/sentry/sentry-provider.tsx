"use client";

import useSentry from "@/hooks/useSentry.hook";
import type { ReactComponentProps } from "@/types/common.type";
import { Fragment } from "react";

const SentryBrowserWrapper = ({ children }: ReactComponentProps) => {
  useSentry();

  return <Fragment>{children}</Fragment>;
};

export default SentryBrowserWrapper;
