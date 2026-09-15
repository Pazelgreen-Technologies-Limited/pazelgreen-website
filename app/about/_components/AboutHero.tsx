import AboutImagePlaceholder from "./AboutImagePlaceholder";

const galleryImages = [
  {
    src: "/images/about/hero-gallery-1.png",
    alt: "Farmer woman inspecting harvest produce",
    label: "hero-gallery-1.png",
  },
  {
    src: "/images/about/hero-gallery-2.png",
    alt: "Sustainable harvest and agricultural value creation",
    label: "hero-gallery-2.png",
  },
  {
    src: "/images/about/hero-gallery-3.png",
    alt: "Agronomist inspecting crop health in an orchard",
    label: "hero-gallery-3.png",
  },
  {
    src: "/images/about/hero-gallery-4.png",
    alt: "Farmers collaborating in agricultural field",
    label: "hero-gallery-4.png",
  },
];

export default function AboutHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#061E0E] text-white">
      {/* Background hero image with rich dark green overlay */}
      <div className="absolute inset-0 z-0">
        <AboutImagePlaceholder
          src="/images/about/hero-bg.png"
          alt="Pazelgreen agricultural modern infrastructure"
          fill
          priority
          label="hero-bg.png"
          className="opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#041A08]/90 via-[#06200D]/85 to-[#061E0E]" />
      </div>

      {/* Main hero content container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-14 sm:px-6 sm:pt-40 md:pb-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            About <span className="text-[#E5983A]">us</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-200 sm:text-base md:text-lg">
            "Solutions are not just products but movement towards achieving a robust and low-waste economy in Africa"
          </p>
        </div>

        {/* 4-Image horizontal gallery strip */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4 md:grid-cols-4 md:gap-5">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/30 sm:rounded-3xl"
            >
              <AboutImagePlaceholder
                src={img.src}
                alt={img.alt}
                fill
                label={img.label}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
