import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

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

const socialLinks = [
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaXTwitter, href: "#", label: "Twitter/X" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 px-6 py-12 text-gray-300">
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
              <span className="text-base font-semibold text-white">
                Pazelgreen
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-400">
              Transforming agricultural value chains through innovative
              technology solutions. Building a sustainable future for farmers
              worldwide.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} /> Pazelgreentech@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} /> +234 813 381 1594
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} /> Ikorodu, Lagos Nigeria
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-white">Company</h3>
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
            <h3 className="mb-3 text-sm font-semibold text-white">Solutions</h3>
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
            <h3 className="mb-3 text-sm font-semibold text-white">
              Stay Connected
            </h3>
            <p className="mb-3 text-sm text-gray-400">
              Get the latest insights, reports and infrastructure updates for
              investors, agribusinesses, and ecosystem partners.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md bg-gray-800 px-3 py-2 text-sm text-white outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
              >
                →
              </button>
            </form>
            <p className="mt-3 text-xs text-gray-500">
              Trusted by agricultural investors, trade networks and
              sustainability leaders
            </p>
          </div>
        </div>

        {/* Social icons */}
        <div className="mt-10 border-t border-gray-800 pt-6">
          <p className="mb-3 text-sm font-semibold text-white">
            Connect with us
          </p>
          <div className="flex gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="rounded-full bg-gray-800 p-2 hover:bg-green-500"
              >
                <Icon size={16} />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar: copyright + legal links */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-6 text-xs text-gray-500 md:flex-row">
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
