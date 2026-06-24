import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, BarChart2 } from "lucide-react";

export default function PagexFeature() {
  return (
    <section className="bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Rounded card */}
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-center">
            {/* Left: text content */}
            <div className="flex-1">
              {/* Featured badge */}
              <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                ★ Featured Solution
              </span>

              <h2 className="text-4xl font-black text-gray-900">PAGEX</h2>
              <p className="mt-1 text-sm font-medium text-gray-700">
                Ecosystem Coordination & Market Intelligence Platform
              </p>

              <p className="mt-4 text-sm text-gray-600">
                PAGEX connects stakeholders across agricultural value chains,
                enabling structured coordination, improved transparency, and
                efficient market interactions.
              </p>

              <Link
                href="/pagex"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-500 px-6 py-3 text-sm font-medium text-white hover:bg-green-600"
              >
                Explore PAGEX <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: network diagram + floating badges */}
            <div className="relative flex-1 justify-center">
              <Image
                src="/pagex-network-visual.png"
                alt="PAGEX network diagram"
                width={600}
                height={600}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
