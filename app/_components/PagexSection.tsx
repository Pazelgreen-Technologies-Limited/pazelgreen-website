import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PlayCircle, CheckCircle } from "lucide-react";

// Feature checkmarks displayed below the PAGEX description
const pagexFeatures = [
  "Real-time market intelligence and pricing data",
  "Secure and transparent transaction facilitation",
  "End-to-end supply-chain traceability",
];

export default function PagexSection() {
  return (
    <section className="bg-white px-6 py-16 font-sans text-gray-900">
      <div className="mx-auto max-w-5xl text-center">
        {/* Section heading */}
        <h3 className="text-2xl font-extrabold tracking-wide text-orange-500">
          Flagship Product
        </h3>
        <h2 className="mt-2 text-3xl font-inter font-extrabold text-gray-900 md:text-5xl">
          PAGEX
        </h2>
        <p className="mt-1 text-base font-bold text-green-800">
          Ecosystem Coordination & Market Intelligence Platform
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
          PAGEX is an ecosystem coordination platform that connects stakeholders
          across agricultural value chains, enabling structured coordination,
          improved transparency, and efficient value exchange.
        </p>

        {/* Feature checklist */}
        <div className="mt-8 flex flex-col items-center gap-4 justify-between md:flex-row ">
          {pagexFeatures.map((feature) => (
            <div
              key={feature}
              className=" flex-1 rounded-xl border-y-4 border-x-2 border-t-0 border-brand px-4 py-4  text-base font-semibold text-gray-700 max-w-lg"
            >
              <div className="flex items-start gap-2 px-2 justify-center">
                <CheckCircle size={16} className="text-green-800" />
                {feature}
              </div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/pagex"
            className="flex items-center gap-2 rounded-2xl bg-green-500 px-6 py-3 text-base font-extrabold text-white hover:bg-brand-dark"
          >
            Explore PAGEX <ArrowRight size={16} />
          </Link>
          <Link
            href="/demo"
            className="flex items-center gap-2 rounded-2xl border border-gray-300 px-6 py-3 text-base font-extrabold text-brand hover:bg-gray-200"
          >
            <PlayCircle size={16} /> Watch Demo
          </Link>
        </div>

        {/* Dashboard mockup image */}
        <div className="mt-12 overflow-hidden rounded-2xl shadow-lg">
          <Image
            src="/pagex-chart.png"
            alt="PAGEX dashboard preview"
            width={1200}
            height={600}
            className="w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
