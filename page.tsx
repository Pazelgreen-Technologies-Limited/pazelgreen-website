"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DemoModal } from "@/components/DemoModal";
import { HomePage as ReferenceHomePage } from "./_components/mature-home/ReferenceHomePage";

export default function Home() {
  const router = useRouter();
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <>
      <ReferenceHomePage
        onNavigate={(path) => router.push(path)}
        onWatchDemo={() => setIsDemoOpen(true)}
      />
      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onNavigateToContact={() => {
          setIsDemoOpen(false);
          router.push("/contact?type=demo");
        }}
      />
    </>
  );
}
