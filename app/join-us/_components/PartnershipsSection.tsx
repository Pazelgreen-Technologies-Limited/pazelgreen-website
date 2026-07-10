import { Puzzle, Search } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Types of partnerships Pazelgreen seeks
const partnershipTypes = [
  "Technology integrations",
  "Research collaborations",
  "Go-to-market partnerships",
  "Investment opportunities",
];

// What Pazelgreen looks for in partners — placeholder, replace with real copy
const whatWeLookFor = [
  "Mission-aligned organizations",
  "Commitment to innovation",
  "Global or regional reach",
  "Focus on sustainable impact",
];

export default function PartnershipsSection() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-2xl bg-gray-50 p-8 md:p-12 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)]">
        {/* Section heading */}
        <div className="text-center">
          <h3 className="text-normal font-extrabold tracking-wide text-orange-500">
            Collaborate on an agricultural transformation
          </h3>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-900 md:text-4xl">
            Strategic Partnerships
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
            We believe in the power of collaboration. Whether you&apos;re a
            technology provider, research institution, or agricultural
            organization, let&apos;s explore how we can work together to create
            meaningful change.
          </p>
          {/* View positions CTA */}
          <Link
            href="/join-us/careers"
            className="mt-4 inline-flex items-center gap-1 text-2xl font-bold text-green-800 hover:underline"
          >
            View all openings{" "}
            <span className="bg-[#17913B33] p-2 rounded-full">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        {/* Two info cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Partnership Types */}
          <div className="rounded-xl bg-green-50 p-6 pr-16 transition-colors">
            <div className="mb-3 inline-flex rounded-xl bg-white p-2">
              <Puzzle size={24} className="text-green-600" />
            </div>
            <div className="pr-20">
              <h4 className="text-normal font-bold text-gray-900">
                Partnership Types
              </h4>
            </div>
            <ul className="mt-2 space-y-2">
              {partnershipTypes.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* What We Look For */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <div className="mb-4 inline-flex rounded-xl bg-green-50 p-3">
              <Search size={24} className="text-green-600" />
            </div>
            <div className="pr-20">
              <h4 className="text-normal font-bold text-gray-900">
                What We Look For
              </h4>
            </div>
            <ul className="mt-2 space-y-2">
              {whatWeLookFor.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
