"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { POSTHOG_EVENTS } from "@/constants/analytics.constant";
import { CALENDAR_LINK } from "@/constants/configs";
import {
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { useSession } from "next-auth/react";
import posthog from "posthog-js";

type Props = {
  open: boolean;
  limit: number;
  setOpen: (open: boolean) => void;
};

const LimitExceedDialog = ({ open, limit, setOpen }: Props) => {
  const session = useSession();

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold">
            You have reached the limit of {limit}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you loving the product? Let&apos;s have a chat about how we can
            help you scale your business.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="w-full flex-row flex justify-center sm:justify-center">
          <Button variant="cta" asChild onClick={() => setOpen(false)}>
            <a
              href={CALENDAR_LINK}
              target="_blank"
              onClick={() => {
                posthog.capture(
                  POSTHOG_EVENTS.TALK_TO_FOUNDERS.LIMIT_EXCEEDED,
                  session.status === "authenticated"
                    ? { email: session.data.user?.email }
                    : {},
                );
              }}
            >
              Talk to Founders
            </a>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LimitExceedDialog;
