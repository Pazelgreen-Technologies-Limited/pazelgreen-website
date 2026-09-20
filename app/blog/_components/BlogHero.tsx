// BACKEND: wire the subscribe form to → POST /api/newsletter/subscribe
// Expected request body: { email: string }
// On success: show a confirmation message and clear the input

"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function BlogHero() {
  const [email, setEmail] = useState("");

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    // BACKEND: replace with real API call
    console.log("Subscribe:", email);
    setEmail("");
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Static hero background */}
      <Image
        src="/blog/blog-hero-bg.jpg"
        alt="Blog hero background"
        fill
        priority
        className="object-cover"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Hero content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1 className="max-w-4xl text-3xl font-bold text-white md:text-5xl">
          Unlock Bold Ideas, Fresh Perspectives &{" "}
          <span className="text-brand">Endless Possibilities</span>
        </h1>

        <p className="mt-4 max-w-xl text-sm text-gray-300">
          Explore the latest trends, technologies, and practices shaping the
          future of sustainable agriculture. From smart irrigation to precision
          farming, discover how innovation is transforming the agricultural
          industry.
        </p>

        {/* Subscribe form */}
        <form
          onSubmit={handleSubscribe}
          className="mt-6 flex w-full max-w-md overflow-hidden rounded-xl border border-white/20 bg-white backdrop-blur-sm"
        >
          <input
            type="email"
            placeholder="danielsantos@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-transparent px-5 py-3 text-sm text-black outline-none placeholder:text-gray-500"
          />
          <Button type="submit" variant="solid" showArrow>
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
