import Image from "next/image";
import BackgroundSection from "@/components/BackgroundSection";

export default function VisionSection() {
  return (
    <BackgroundSection
      imageSrc="/vision-bg.jpg"
      imageAlt="Sunrise over agricultural field"
      overlayColor="bg-[#052E16E5]/60"
      height="h-[500px]"
    >
      <span className="mb-4 rounded-full bg-white/20 px-4 py-1 text-normal font-bold tracking-wide text-white">
        Our Vision
      </span>
      <div className="my-4 h-1 rounded-full w-12 bg-orange-500/60" />
      <p className="max-w-4xl text-2xl py-4 font-bold text-white md:text-4xl">
        &quot;To become a global leader in developing innovative solutions that
        drive sustainable agricultural transformation and resilient food systems
        across emerging markets.&quot;
      </p>
      <div className="mt-4 h-1 rounded-full w-12 bg-orange-500/60" />
    </BackgroundSection>
  );
}
