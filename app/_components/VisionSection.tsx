import BackgroundSection from "@/components/BackgroundSection";

export default function VisionSection() {
  return (
    <BackgroundSection
      imageSrc="/vision-bg.jpg"
      imageAlt="Sunrise over agricultural field"
      overlayColor="bg-primary-darker/75"
      height="h-[440px] md:h-[500px]"
    >
      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-background/80">
        Our Vision
      </p>
      <h2 className="max-w-4xl text-3xl font-bold leading-tight text-background md:text-4xl lg:text-5xl">
        &quot;To become a global leader in developing innovative solutions that
        drive sustainable agricultural transformation and resilient food systems
        across emerging markets.&quot;
      </h2>
    </BackgroundSection>
  );
}
