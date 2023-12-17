import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/utils/common";

type CardProps = React.ComponentProps<typeof Card> & {
  cardTitle: string;
  cardDescription: string;
  buttonText: string;
};

export function ActionCard({
  className,
  cardTitle,
  cardDescription,
  buttonText,
  ...props
}: CardProps) {
  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>

      <CardFooter>
        <Button className="w-full">{buttonText}</Button>
      </CardFooter>
    </Card>
  );
}
