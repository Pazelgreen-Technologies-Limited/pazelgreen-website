import Image from "next/image";
import Link from "next/link";
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
  return (
    <header className="w-full bg-gray-900 px-6 py-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo + brand name */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Pazelgreen logo" width={36} height={36} />
          <span className="text-lg font-semibold text-white">Pazelgreen</span>
        </Link>

        {/* Center nav links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm text-gray-200 transition-colors hover:text-green-400"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <Link
          href="/get-started"
          className="rounded-full bg-green-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-green-600"
        >
          Get Started
        </Link>
      </nav>
    </header>
  );
}
