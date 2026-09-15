import Button from "@/components/ui/Button";
import AboutImagePlaceholder from "./AboutImagePlaceholder";

export default function JoinWaitlistCard() {
  return (
    <section className="w-full bg-white pb-16 sm:pb-20 md:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A481E] via-[#0E6329] to-[#13842C] p-8 text-white shadow-2xl sm:p-12 lg:p-16">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left: Message + CTA button */}
            <div className="flex flex-col items-start lg:col-span-7">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Join the Waitlist
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-emerald-100 sm:text-base md:text-lg">
                Be among the first to experience PAGEX when we launch in your
                region. Whether you&apos;re a farmer, off-taker, or logistics
                provider, we have tailored solutions for your growth.
              </p>

              <div className="mt-8">
                <Button
                  href="/join-us"
                  variant="white"
                  showArrow
                  className="rounded-full! px-8! py-3.5! font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105"
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Right: Farmer in crop field photo */}
            <div className="mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/20 shadow-xl sm:rounded-3xl">
                <AboutImagePlaceholder
                  src="/images/about/waitlist-farmer.png"
                  alt="Farmer tending lush green crops"
                  fill
                  label="waitlist-farmer.png"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
