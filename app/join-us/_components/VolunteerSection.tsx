import { GitMerge, Gift } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Ways contributors can get involved
const ways = [
  "Open source development",
  "Research and insights",
  "Community building",
  "Content creation & education",
];

// Benefits of volunteering — placeholder, replace with real copy
const benefits = [
  "Build your portfolio",
  "Network with professionals",
  "Get real-world experience",
  "Contribute to global impact",
];

export default function VolunteerSection() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-2xl bg-green-50 p-8 md:p-12 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.1)]">
        {/* Section heading */}
        <div className="text-center">
          {/* Section heading */}
          <div className="text-center">
            <h3 className="text-normal font-extrabold tracking-wide text-orange-500">
              Support innovation initiatives
            </h3>
            <h2 className="mt-2 text-2xl font-extrabold text-gray-900 md:text-4xl">
              Volunteer & Contribute
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
              You don&apos;t need to be on our team to help shape the future of
              agriculture. We welcome contributions from developers, designers,
              researchers, and agriculture professionals worldwide.
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
        </div>

        {/* Two info cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Ways to Contribute */}
          <div className="rounded-xl bg-white p-6 pr-16 transition-colors">
            <div className="mb-3 inline-flex rounded-xl bg-green-50 p-2">
              <GitMerge size={24} className="text-green-600" />
            </div>
            <div className="pr-20">
              <h4 className="text-normal font-bold text-gray-900">
                Ways to Contribute
              </h4>
            </div>
            <ul className="mt-2 space-y-2">
              {ways.map((item) => (
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

          {/* Benefits */}
          <div className="rounded-xl bg-white p-6 pr-16 transition-colors">
            <div className="mb-3 inline-flex rounded-xl bg-green-50 p-2">
              <Gift size={24} className="text-green-600" />
            </div>
            <div className="pr-20">
              <h4 className="text-normal font-bold text-gray-900">Benefits</h4>
            </div>
            <ul className="mt-2 space-y-2">
              {benefits.map((item) => (
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
