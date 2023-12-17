import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/utils/common";
import type { ChangeEventHandler } from "react";

type CardProps = React.ComponentProps<typeof Card> & {
  cardTitle: string;
  cardDescription: string;
  buttonText: string;
  onDataLoad: ChangeEventHandler<HTMLInputElement>;
};

export function ActionCard({
  className,
  cardTitle,
  cardDescription,
  buttonText,
  onDataLoad,
  ...props
}: CardProps) {
  const onClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xlxs";
    input.onchange = onDataLoad as any;
    input.click();
  };

  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>

      <CardFooter>
        <Button className="w-full" onClick={onClick}>
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
