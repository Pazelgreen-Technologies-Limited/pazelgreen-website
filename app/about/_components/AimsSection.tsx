import { Check } from "lucide-react";
import AboutImagePlaceholder from "./AboutImagePlaceholder";

const aims = [
  {
    title: "Reduce Post-Harvest Losses Through Smart Supply Chains",
    description:
      "Deploy data-driven logistics, temperature monitoring, and optimized routing to minimize spoilage between farm and market.",
  },
  {
    title: "Bridge the Market Divide for Smallholder Farmers",
    description:
      "Connect producers directly to premium buyers, processors, and institutional markets to guarantee fair pricing and predictable income.",
  },
  {
    title: "Promote Climate-Smart and Sustainable Agriculture",
    description:
      "Integrate eco-friendly practices, carbon offset tracking, and regenerative agriculture insights into accessible digital platforms.",
  },
  {
    title: "Empower Agricultural Stakeholders with Actionable Data",
    description:
      "Provide real-time market intelligence, price forecasts, and supply-demand analytics to drive informed decision-making across the ecosystem.",
  },
];

export default function AimsSection() {
  return (
    <section className="w-full bg-white py-14 sm:py-18 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Aims
        </h2>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left: Vendor Portrait */}
          <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-xl sm:rounded-3xl">
              <AboutImagePlaceholder
                src="/images/about/aims-vendor.png"
                alt="Agribusiness vendor and marketplace participant"
                fill
                label="aims-vendor.png"
              />
            </div>
          </div>

          {/* Right: 4 Aims List */}
          <div className="space-y-6 lg:col-span-7">
            {aims.map((aim, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-[#FAF9F6] p-5 shadow-xs transition-all duration-200 hover:border-emerald-200 hover:bg-white hover:shadow-md sm:p-6"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#12AB17] text-white shadow-xs">
                  <Check className="h-4 w-4 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 sm:text-lg">
                    {aim.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {aim.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
