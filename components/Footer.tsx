import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { companySocialLinks } from "@/lib/social-links";
import { formatWorkingHours, getCompanySettings } from "@/lib/company-settings";

// Footer link columns
const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Team", href: "/team" },
  { label: "Careers", href: "/careers" },
  { label: "News & Blogs", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const solutionLinks = [
  { label: "PAGEX Platform", href: "/pagex" },
  { label: "Market Intelligence", href: "/market-intelligence" },
  { label: "Supply Chain", href: "/supply-chain" },
  { label: "Quality Control", href: "/quality-control" },
  { label: "Analytics", href: "/analytics" },
];

export default async function Footer() {
  const company = await getCompanySettings();
  const socialLinks = companySocialLinks(company.socialLinks);
  return (
    <footer className="bg-white px-6 py-12 text-gray-900">
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
              <span className="text-base font-extrabold text-foreground">
                Pazelgreen
              </span>
            </div>
            <p className="mb-4 text-sm">
              Transforming agricultural value chains through innovative
              technology solutions. Building a sustainable future for farmers
              worldwide.
            </p>
            <ul className="space-y-2 text-sm">
              {company.email && <li className="flex items-center gap-2">
                <span className="bg-brand/20 text-brand p-2 rounded-md">
                  <Mail size={16} />
                </span>{" "}
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>}
              {company.phone && <li className="flex items-center gap-2">
                <span className="bg-brand/20 text-brand p-2 rounded-md">
                  <Phone size={16} />
                </span>{" "}
                <a href={`tel:${company.phone?.replace(/[^+\d]/g, "")}`}>{company.phone}</a>
              </li>}
              {company.address && <li className="flex items-center gap-2">
                <span className="bg-brand/20 text-brand p-2 rounded-md">
                  <MapPin size={16} />
                </span>{" "}
                <span className="whitespace-pre-line">{company.address}</span>
              </li>}
              {!!company.workingHours?.length && <li className="flex items-start gap-2">
                <span className="bg-brand/20 text-brand rounded-md p-2"><Clock size={16} /></span>
                <div><p>{company.timezone}</p>{formatWorkingHours(company.workingHours).map(row => <p key={row}>{row}</p>)}</div>
              </li>}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="mb-3 text-base font-extrabold text-foreground">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-green-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions links */}
          <div>
            <h3 className="mb-3 text-base font-extrabold text-foreground">
              Solutions
            </h3>
            <ul className="space-y-2 text-sm">
              {solutionLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-green-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter signup */}
          <div>
            <h3 className="mb-3 text-base font-extrabold text-foreground">
              Stay Connected
            </h3>
            <p className="mb-3 text-sm">
              Get the latest insights, reports and infrastructure updates for
              investors, agribusinesses, and ecosystem partners.
            </p>
            <form className="flex w-full max-w-md items-stretch">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-l-xl bg-gray-200 px-3 py-2 text-sm text-gray-800 outline-none"
              />
              <button
                type="submit"
                /* Changed rounded-md to rounded-r-md (right corners only) */
                className="rounded-r-xl bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 flex items-center justify-center"
              >
                →
              </button>
            </form>
            <p className="mt-3 text-xs">
              Trusted by agricultural investors, trade networks and
              sustainability leaders
            </p>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex flex-col items-center justify-between gap-4 mt-10 pt-6 border-t border-brand md:flex-row">
          <div className="">
            <p className="mb-3 text-sm font-extrabold text-foreground">
              CONNECT WITH US
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="rounded-full bg-brand/10 p-2 hover:bg-brand/20 text-brand transition-colors"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          <div className="text-foreground flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-700">
            {/* Item 1: ISO Certified */}
            <div className="w-full sm:w-1/3 flex items-center justify-center gap-2 px-4">
              <span className="text-3xl font-black tracking-tighter text-brand leading-none">
                ISO
              </span>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-bold uppercase tracking-wider text-brand">
                  Certified
                </span>
                <span className="text-[10px]  font-medium">9001:2015</span>
              </div>
            </div>

            {/* Item 2: 100% Secure */}
            <div className="w-full sm:w-1/3 flex items-center justify-center gap-3 px-4 pt-4 sm:pt-0">
              {/* Optional: Add a lock icon here from lucide-react if you want */}
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-sm font-bold tracking-wide uppercase text-brand">
                  100% Secure
                </span>
                <span className="text-xs ">Encrypted Payments</span>
              </div>
            </div>

            {/* Item 3: 24/7 Support */}
            <div className="w-full sm:w-1/3 flex items-center justify-center gap-3 px-4 pt-4 sm:pt-0">
              <div className="flex flex-col text-center sm:text-left">
                <span className="text-sm font-bold tracking-wide uppercase text-brand">
                  24/7 Support
                </span>
                <span className="text-xs ">Dedicated Assistance</span>
              </div>
            </div>
            {/* hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh */}
          </div>
        </div>

        {/* Bottom bar: copyright + legal links */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-brand-dark pt-6 text-xs text-gray-500 md:flex-row">
          <p>© 2026 Pazelgreen Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-green-400">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-green-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
