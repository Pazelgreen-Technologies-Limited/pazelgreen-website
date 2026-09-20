// BACKEND: wire this form to → POST /api/newsletter/subscribe
// Expected request body: { email: string }
// On success: show a confirmation message and clear the input
// Note: same endpoint as the hero subscribe form — different UI, same action

"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function StayUpdatedBanner() {
  const [email, setEmail] = useState("");

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    // BACKEND: replace with real API call
    console.log("Subscribe:", email);
    setEmail("");
  }

  return (
    <section className="relative h-75 w-full overflow-hidden">
      <Image
        src="/blog/stay-updated-bg.jpg"
        alt="Stay updated background"
        fill
        className="object-cover"
      />
      {/* Darker overlay than the hero for contrast */}
      <div className="absolute inset-0 bg-linear-to-b from-[#14532D00] via-[#14532DB2] to-[#052E16E5]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h2 className="max-w-lg text-2xl font-bold text-white md:text-3xl">
          Stay Updated on Agricultural Innovation
        </h2>
        <p className="mt-2 max-w-md text-sm text-gray-300">
          Subscribe to our newsletter and receive the latest insights on
          sustainable farming and agritech trends.
        </p>

        {/* Subscribe form */}
        <form
          onSubmit={handleSubscribe}
          className="mt-6 flex w-full p-1 max-w-md overflow-hidden rounded-xl border border-[#379E234D] bg-[#379E2326] backdrop-blur-sm"
        >
          <input
            type="email"
            placeholder="danielsantos@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-transparent px-2 text-sm text-white outline-none placeholder:text-white/70"
          />
          <Button type="submit" variant="solid" showArrow>
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
