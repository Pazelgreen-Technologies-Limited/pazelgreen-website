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
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl text-center">
        {/* Section heading */}
        <h3 className="text-sm font-semibold tracking-wide text-orange-500">
          Flagship Product
        </h3>
        <h2 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
          PAGEX
        </h2>
        <p className="mt-1 text-base font-medium text-gray-700">
          Ecosystem Coordination & Market Intelligence Platform
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
          PAGEX is an ecosystem coordination platform that connects stakeholders
          across agricultural value chains, enabling structured coordination,
          improved transparency, and efficient value exchange.
        </p>

        {/* Feature checklist */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          {pagexFeatures.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 rounded-full border border-green-200 px-4 py-2 text-sm text-gray-700"
            >
              <CheckCircle size={16} className="text-green-500" />
              {feature}
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/pagex"
            className="flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-medium text-white hover:bg-green-600"
          >
            Explore PAGEX <ArrowRight size={16} />
          </Link>
          <Link
            href="/demo"
            className="flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
