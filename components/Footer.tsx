import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { socialLinks } from "@/lib/social-links";

// Footer link columns
const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Careers", href: "/careers" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

const solutionLinks = [
  { label: "PAGEX Platform", href: "/pagex" },
  { label: "Market Intelligence", href: "/market-intelligence" },
  { label: "Supply Chain", href: "/supply-chain" },
  { label: "Quality Control", href: "/quality-control" },
  { label: "Analytics", href: "/analytics" },
];

export default function Footer() {
  return (
    <footer className="bg-foreground px-6 py-12 text-inverse-foreground">
      <div className="mx-auto max-w-7xl">
        {/* Top grid: brand, company links, solutions, newsletter */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand + description */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Pazelgreen logo"
                width={32}
                height={32}
              />
              <span className="text-base font-extrabold text-primary-light">
                Pazelgreen
              </span>
            </div>
            <p className="mb-4 text-sm text-inverse-foreground/90">
              Transforming agricultural value chains through innovative
              technology solutions. Building a sustainable future for farmers
              worldwide.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="rounded-md bg-primary-light p-2 text-foreground">
                  <Mail size={16} />
                </span>{" "}
                Pazelgreentech@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-md bg-primary-light p-2 text-foreground">
                  <Phone size={16} />
                </span>{" "}
                +234 813 381 1594
              </li>
              <li className="flex items-center gap-2">
                <span className="rounded-md bg-primary-light p-2 text-foreground">
                  <MapPin size={16} />
                </span>{" "}
                Ikorodu, Lagos Nigeria
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="mb-3 text-base font-extrabold text-primary-light">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions links */}
          <div>
            <h3 className="mb-3 text-base font-extrabold text-primary-light">
              Solutions
            </h3>
            <ul className="space-y-2 text-sm">
              {solutionLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter signup */}
          <div>
            <h3 className="mb-3 text-base font-extrabold text-primary-light">
              Stay Connected
            </h3>
            <p className="mb-3 text-sm text-inverse-foreground/90">
              Get the latest insights, reports and infrastructure updates for
              investors, agribusinesses, and ecosystem partners.
            </p>
            <form className="flex w-full max-w-md items-stretch">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-l-xl bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-r-xl bg-primary px-4 py-2 text-sm font-medium text-inverse-foreground transition-colors hover:bg-primary-hover"
              >
                →
              </button>
            </form>
            <p className="mt-3 text-xs text-inverse-foreground/60">
              Trusted by agricultural investors, trade networks and
              sustainability leaders
            </p>
          </div>
        </div>

        {/* Social icons */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-inverse-foreground/15 pt-6 md:flex-row">
          <div>
            <p className="mb-3 text-sm font-extrabold text-primary-light">
              CONNECT WITH US
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-full bg-primary-light p-2.5 text-foreground transition-colors hover:bg-primary-hover"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 divide-y divide-inverse-foreground/15 text-primary-light sm:flex-row sm:gap-0 sm:divide-x sm:divide-y-0">
            {/* Item 1: ISO Certified */}
            <div className="flex w-full items-center justify-center gap-2 px-4 sm:w-1/3">
              <span className="text-3xl leading-none tracking-tighter text-primary-light">
                ISO
              </span>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-bold tracking-wider text-primary-light uppercase">
                  Certified
                </span>
                <span className="text-[10px] font-medium text-inverse-foreground/80">
                  9001:2015
                </span>
              </div>
            </div>

            {/* Item 2: 100% Secure */}
            <div className="flex w-full items-center justify-center gap-3 px-4 pt-4 sm:w-1/3 sm:pt-0">
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-sm font-bold tracking-wide text-primary-light uppercase">
                  100% Secure
                </span>
                <span className="text-xs text-inverse-foreground/80">
                  Encrypted Payments
                </span>
              </div>
            </div>

            {/* Item 3: 24/7 Support */}
            <div className="flex w-full items-center justify-center gap-3 px-4 pt-4 sm:w-1/3 sm:pt-0">
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-sm font-bold tracking-wide text-primary-light uppercase">
                  24/7 Support
                </span>
                <span className="text-xs text-inverse-foreground/80">
                  Dedicated Assistance
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar: copyright + legal links */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-inverse-foreground/15 pt-6 text-xs text-inverse-foreground/60 md:flex-row">
          <p>© 2026 Pazelgreen Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-primary-light"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="transition-colors hover:text-primary-light"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
