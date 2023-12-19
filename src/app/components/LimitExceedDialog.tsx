"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CALENDAR_LINK } from "@/constants/configs";
import {
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";

type Props = {
  open: boolean;
  limit: number;
  setOpen: (open: boolean) => void;
};

const LimitExceedDialog = ({ open, limit, setOpen }: Props) => {
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
            <a href={CALENDAR_LINK} target="_blank">
              Talk to Founders
            </a>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LimitExceedDialog;
