"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Shared layouts survive navigation; refresh their approved CMS data as well. */
export function PublicContentRefresh() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const location = `${pathname}?${searchParams.toString()}`;
  const previous = useRef(location);
  const router = useRouter();
  useEffect(() => {
    if (previous.current !== location) {
      previous.current = location;
      router.refresh();
    }
  }, [location, router]);
  useEffect(() => {
    const onVisible = () => { if (document.visibilityState === "visible") router.refresh(); };
    const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) router.refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [router]);
  return null;
}
