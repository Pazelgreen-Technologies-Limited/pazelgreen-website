"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Nav links shown on desktop
const navLinks = [
  { label: "Home", href: "/" },
  { label: "Solution", href: "/solution" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Join Us", href: "/join-us" },
  { label: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();

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
            <span className="text-lg font-semibold">Pazelgreen</span>
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
            <Link
              href="/get-started"
              className="rounded-xl bg-brand px-4 py-3 text-sm font-medium transition-colors hover:bg-brand-dark"
            >
              Get Started
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
}
