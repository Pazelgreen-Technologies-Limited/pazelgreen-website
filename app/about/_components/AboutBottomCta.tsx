import Button from "@/components/ui/Button";
import AboutImagePlaceholder from "./AboutImagePlaceholder";

const collageImages = [
  {
    src: "/images/about/cta-collage-1.png",
    alt: "Agricultural crop field rows",
    label: "cta-collage-1.png",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/about/cta-collage-2.png",
    alt: "Hands holding harvested agricultural grains",
    label: "cta-collage-2.png",
    aspect: "aspect-square",
  },
  {
    src: "/images/about/cta-collage-3.png",
    alt: "Irrigation water sprinkler on farm crops",
    label: "cta-collage-3.png",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/about/cta-collage-4.png",
    alt: "Farmer in hat working in vegetable field",
    label: "cta-collage-4.png",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/about/cta-collage-5.png",
    alt: "Farmer with harvest produce basket",
    label: "cta-collage-5.png",
    aspect: "aspect-square",
  },
  {
    src: "/images/about/cta-collage-6.png",
    alt: "Agricultural workers during harvest",
    label: "cta-collage-6.png",
    aspect: "aspect-[3/4]",
  },
];

export default function AboutBottomCta() {
  return (
    <section className="relative w-full overflow-hidden bg-[#06240F] py-20 text-white sm:py-24 md:py-28">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Copy & Actions */}
          <div className="flex flex-col items-start lg:col-span-6">
            <span className="mb-4 inline-block rounded-full border border-emerald-500/40 bg-emerald-950/60 px-4 py-1.5 text-xs font-bold tracking-widest text-[#12AB17] uppercase">
              Join Us Now
            </span>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:leading-tight">
              Get started today for a better future in agriculture
            </h2>

            <p className="mt-4 text-base text-gray-300 sm:text-lg">
              Partner with Pazelgreen and lead the agricultural revolution.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                href="/join-us"
                variant="white"
                className="rounded-full! px-8! py-3.5! font-semibold text-gray-900 shadow-lg transition-transform hover:scale-105"
              >
                Get Started
              </Button>
              <Button
                href="/contact"
                variant="solid"
                className="rounded-full! px-8! py-3.5! font-semibold transition-transform hover:scale-105"
              >
                Contact Us
              </Button>
            </div>
          </div>

          {/* Right Column: 6-Photo Mosaic Collage */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {/* Column 1 */}
              <div className="space-y-3 sm:space-y-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 shadow-lg sm:rounded-2xl">
                  <AboutImagePlaceholder
                    src={collageImages[0].src}
                    alt={collageImages[0].alt}
                    fill
                    label={collageImages[0].label}
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 shadow-lg sm:rounded-2xl">
                  <AboutImagePlaceholder
                    src={collageImages[3].src}
                    alt={collageImages[3].alt}
                    fill
                    label={collageImages[3].label}
                  />
                </div>
              </div>

              {/* Column 2 (offset downwards) */}
              <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 shadow-lg sm:rounded-2xl">
                  <AboutImagePlaceholder
                    src={collageImages[1].src}
                    alt={collageImages[1].alt}
                    fill
                    label={collageImages[1].label}
                  />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 shadow-lg sm:rounded-2xl">
                  <AboutImagePlaceholder
                    src={collageImages[4].src}
                    alt={collageImages[4].alt}
                    fill
                    label={collageImages[4].label}
                  />
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-3 sm:space-y-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 shadow-lg sm:rounded-2xl">
                  <AboutImagePlaceholder
                    src={collageImages[2].src}
                    alt={collageImages[2].alt}
                    fill
                    label={collageImages[2].label}
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 shadow-lg sm:rounded-2xl">
                  <AboutImagePlaceholder
                    src={collageImages[5].src}
                    alt={collageImages[5].alt}
                    fill
                    label={collageImages[5].label}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
