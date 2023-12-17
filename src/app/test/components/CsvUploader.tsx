import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ChangeEventHandler } from "react";

export const CsvUploader = ({
  onDataLoad,
  title,
}: {
  title: string;
  onDataLoad: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">{title}</Label>
      <Input
        id="picture"
        type="file"
        accept=".csv,.xlxs"
        onChange={onDataLoad}
      />
    </div>
  );
};
