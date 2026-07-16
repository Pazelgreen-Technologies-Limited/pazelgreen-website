"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { usePathname } from "next/navigation";

// Nav links shown on desktop
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Solution", href: "/solutions" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Join Us", href: "/join-us" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  // Controls whether the mobile menu is open or closed
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full mt-4 z-50 text-white font-sans">
      <div className="bg-navbar px-6 py-4 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo + brand name */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Pazelgreen logo"
              width={36}
              height={36}
            />
            <span className="text-lg font-semibold text-brand md:text-white">
              Pazelgreen
            </span>
          </Link>

          {/* Center nav links */}
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-base font-normal transition-colors ${
                      isActive
                        ? "text-brand"
                        : "text-white hover:text-brand-dark"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {/* CTA button */}
            <Button href="/get-started" variant="solid">
              Get Started
            </Button>
          </ul>
          {/* ── Hamburger button — visible only on mobile ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            className="relative flex h-8 w-8 flex-col items-end justify-center gap-0 md:hidden"
          >
            {/*
            Each bar is a plain span.
            When isOpen is true, we apply Tailwind transform classes:

            Top bar:
              - translate-y-[7px]  → moves it down to the center
              - rotate-45          → rotates it 45° clockwise
            
            Bottom bar:
              - -translate-y-[7px] → moves it up to the center
              - -rotate-45         → rotates it 45° counter-clockwise

            Both bars now cross at the center → forms an X.
            transition-all duration-300 makes it animate smoothly.
          */}

            {/* Top bar */}
            <span
              className={`block h-0.5 w-8 rounded-full bg-brand transition-all duration-300
              ${isOpen ? "translate-y-2 rotate-45" : ""}`}
            />

            {/* Middle bar — fades out when open */}
            <span
              className={`my-1.5 block h-0.5 w-4 rounded-full bg-brand transition-all duration-300
              ${isOpen ? "opacity-0" : ""}`}
            />

            {/* Bottom bar */}
            <span
              className={`block h-0.5 w-2 rounded-full bg-brand transition-all duration-300
              ${isOpen ? "-translate-y-2 w-8 -rotate-45" : ""}`}
            />
          </button>
        </nav>

        {/* ========================================= */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden
          ${isOpen ? "max-h-96 border-t border-gray-800" : "max-h-0"}`}
        >
          <ul className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    // Close the menu when a link is tapped
                    onClick={() => setIsOpen(false)}
                    className={`text-base font-normal transition-colors ${
                      isActive
                        ? "text-brand"
                        : "text-white hover:text-brand-dark"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {/* Mobile CTA button */}
            <Button
              href="/get-started"
              variant="solid"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Button>
          </ul>
        </div>
      </div>
    </header>
  );
}
