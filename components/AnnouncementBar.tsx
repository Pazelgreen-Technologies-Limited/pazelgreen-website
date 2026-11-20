"use client";

import { useEffect, useRef, useState } from "react";
import type { AnnouncementSnapshot } from "@/cms/announcement-rules";

export function AnnouncementBar({ initial }: { initial: AnnouncementSnapshot }) {
  const [snapshot, setSnapshot] = useState(initial);
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let current = initial, active = true;
    let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    const schedule = () => {
      clearTimeout(timer);
      const boundary = current.nextChangeAt ? Date.parse(current.nextChangeAt) - Date.now() + 50 : 60000;
      timer = setTimeout(refresh, Math.max(1000, Math.min(60000, boundary)));
    };
    async function refresh() {
      try {
        const response = await fetch("/api/announcements/active", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error();
        current = await response.json();
      } catch {
        // Expire locally even if the schedule refresh is temporarily unavailable.
        if (current.notice?.endsAt && Date.parse(current.notice.endsAt) <= Date.now()) current = { ...current, notice: null };
        current = { ...current, nextChangeAt: null };
      }
      if (active) { setSnapshot(current); schedule(); }
    }
    schedule();
    const onVisible = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { active = false; clearTimeout(timer); controller.abort(); document.removeEventListener("visibilitychange", onVisible); };
  }, [initial]);
  useEffect(() => {
    const bar = element.current;
    const update = () => document.documentElement.style.setProperty("--announcement-height", `${bar?.getBoundingClientRect().height ?? 0}px`);
    update();
    const observer = new ResizeObserver(update);
    if (bar) observer.observe(bar);
    return () => { observer.disconnect(); document.documentElement.style.setProperty("--announcement-height", "0px"); };
  }, [snapshot.notice]);
  if (!snapshot.notice) return null;
  const notice = snapshot.notice;
  return <div ref={element} role="region" aria-label="Site announcement" className="bg-green-950 px-5 py-3 text-center text-sm leading-relaxed text-white">
    <p className="mx-auto max-w-5xl break-words">{notice.message}{notice.linkURL && notice.linkLabel && <> <a href={notice.linkURL} className="ml-2 font-bold underline underline-offset-4 focus:outline-2 focus:outline-offset-2 focus:outline-white">{notice.linkLabel}</a></>}</p>
  </div>;
}
