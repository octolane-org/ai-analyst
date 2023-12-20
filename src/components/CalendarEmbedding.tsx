"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export const CalendarEmbedding = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: { branding: { brandColor: "#f3f4f6" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <Cal
        calLink="octolane/20min"
        style={{ width: "100%", height: "100%", overflow: "scroll" }}
        config={{ layout: "month_view" }}
      />
    </div>
  );
};
