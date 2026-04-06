"use client";

import { useEffect, useState } from "react";

import { readProgress } from "@/lib/progress-storage";
import type { ProgressMap } from "@/types/progress";

export function useProgressOverview() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    const sync = () => {
      setProgress(readProgress());
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("progress-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("progress-updated", sync);
    };
  }, []);

  return progress;
}
