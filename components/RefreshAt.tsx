"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-read server data when a displayed vacancy reaches its deadline. */
export function RefreshAt({ timestamps }: { timestamps: (string | null | undefined)[] }) {
  const router = useRouter();
  const next = timestamps.filter((value): value is string => Boolean(value)).map(Date.parse).filter(Number.isFinite).sort((a, b) => a - b)[0];
  useEffect(() => {
    if (next === undefined) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const remaining = next - Date.now();
      if (remaining <= 0) { router.refresh(); return; }
      // Avoid overflowing browser timers for deadlines more than 24 days away.
      timer = setTimeout(schedule, Math.min(remaining + 50, 2147483647));
    };
    schedule();
    return () => clearTimeout(timer);
  }, [next, router]);
  return null;
}
