import { Briefcase, Star } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Current open roles
const openings = [
  "Full Stack Engineers",
  "Agricultural Scientists",
  "Product Managers",
  "Business Development",
];

// Reasons to join — placeholder, replace with real copy
const whyJoinUs = [
  "Work on cutting-edge agri-tech solutions",
  "Collaborative and mission-driven team",
  "Flexible remote-first environment",
  "Competitive salary and equity options",
];

export default function CareersSection() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-2xl bg-gray-50 p-8 md:p-12 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)]">
        {/* Section heading */}
        <div className="text-center">
          <h3 className="text-normal font-extrabold tracking-wide text-orange-500">
            Join the core team
          </h3>
          <h2 className="mt-2 text-2xl font-extrabold text-gray-900 md:text-4xl">
            Careers at Pazelgreen
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
            We&apos;re building a team of innovators, technologists, and
            agriculture enthusiasts who share our passion for sustainable
            farming. We offer competitive compensation, professional growth, and
            the opportunity to work on problems that matter.
          </p>
          {/* View positions CTA */}
          <Link
            href="/join-us/careers"
            className="mt-4 inline-flex items-center gap-1 text-2xl font-bold text-green-800 hover:underline"
          >
            View Open Positions{" "}
            <span className="bg-[#17913B33] p-2 rounded-full">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        {/* Two info cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Current Openings card */}
          <div className="rounded-xl bg-green-50 p-6 pr-16 transition-colors">
            <div className="mb-3 inline-flex rounded-xl bg-white p-2">
              <Briefcase size={24} className="text-green-600" />
            </div>
            <div className="pr-20">
              <h4 className="text-normal font-bold text-gray-900">
                Current Openings
              </h4>
            </div>

            <ul className="mt-2 space-y-2">
              {openings.map((role) => (
                <li
                  key={role}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {role}
                </li>
              ))}
            </ul>
          </div>

          {/* Why Join Us card */}
          <div className="rounded-xl bg-green-50 p-6 pr-16 transition-colors">
            <div className="mb-3 inline-flex rounded-xl bg-white p-2">
              <Star size={24} className="text-green-600" />
            </div>
            <h3 className="text-normal font-bold text-gray-900">
              Why Join Us?
            </h3>
            <ul className="mt-2 space-y-2">
              {whyJoinUs.map((item) => (
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
