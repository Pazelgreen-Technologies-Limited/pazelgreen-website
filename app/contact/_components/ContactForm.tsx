import { Mail, Building2, Handshake, Sprout, User } from "lucide-react";
import Button from "@/components/ui/Button";
import { socialLinks } from "@/lib/social-links";
import Link from "next/link";

// Direct contact cards shown on the right column
const contactCards = [
  {
    icon: Mail,
    title: "General Inquiries",
    email: "hello@pazelgreen.com",
    description: "For any general questions or information.",
  },
  {
    icon: Handshake,
    title: "Partnerships",
    email: "partners@pazelgreen.com",
    description: "Explore partnership and collaboration opportunities.",
  },
  {
    icon: Sprout,
    title: "PAGEX Inquiry",
    email: "pagex@pazelgreen.com",
    description:
      "Want to learn more about Pazelgreen's flagship platform? Request a product conversation.",
  },
];

// Dropdown options for the Inquiry Type field
const inquiryOptions = [
  "General Question",
  "Partnership Opportunity",
  "PAGEX Product Demo",
];

export default function ContactForm() {
  return (
    <section id="contact-form" className="bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* ── Left column: contact form ── */}
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            {/* Form header */}
            <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-green-500">
              <span className="h-px w-6 bg-green-400" /> GET IN TOUCH
            </p>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Send us a message
            </h2>

            {/*
              Pure frontend form — no backend wired yet.
              Add an onSubmit handler + API call when ready.
            */}
            <form className="space-y-4">
              {/* Full Name + Email row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                    <User size={14} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      required
                      className="w-full text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                    <Mail size={14} className="text-gray-400" />
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      required
                      className="w-full text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Organisation */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Organisation{" "}
                  <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                  <Building2 size={14} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Company or Institution Name"
                    className="w-full text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Inquiry type dropdown */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Inquiry Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none"
                >
                  <option value="" disabled>
                    Select an option...
                  </option>
                  {inquiryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message textarea */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  required
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 resize-none"
                />
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="solid"
                className="w-full justify-center"
              >
                <Mail size={15} /> Send Message
              </Button>
            </form>
          </div>

          {/* ── Right column: direct contacts + social card ── */}
          <div className="flex flex-col gap-6">
            {/* Direct Contact header */}
            <div>
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-green-500">
                <span className="h-px w-6 bg-green-400" /> REACH OUT
              </p>
              <h2 className="text-2xl font-bold text-gray-900">
                Direct Contact
              </h2>
            </div>

            {/* Contact cards */}
            {contactCards.map(({ icon: Icon, title, email, description }) => (
              <div
                key={title}
                className="flex gap-4 rounded-xl bg-green-50 p-4"
              >
                <div className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                  <Icon size={16} className="text-green-900" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm font-medium text-green-600 hover:underline"
                  >
                    {email}
                  </a>
                  <p className="mt-1 text-xs text-gray-500">{description}</p>
                </div>
              </div>
            ))}

            {/* Connect with Pazelgreen dark card */}
            <div className="rounded-xl bg-green-900 p-6 text-white">
              <p className="mb-1 flex items-center gap-2 text-xs font-semibold text-green-300">
                <span className="h-px w-6 bg-green-400" /> FOLLOW US
              </p>
              <h3 className="text-lg font-bold">Connect with Pazelgreen</h3>
              <p className="mt-1 mb-4 text-sm text-green-200">
                Follow our journey transforming agricultural technology across
                emerging markets.
              </p>
              {/* Shared social links component */}
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className={`rounded-full p-2 transition-colors hover:bg-green-800/50 focus:outline-none focus:ring-2 focus:ring-green-400`}
                  >
                    <div className=" rounded-full border border-white p-3">
                      <Icon size={16} className="text-white" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
