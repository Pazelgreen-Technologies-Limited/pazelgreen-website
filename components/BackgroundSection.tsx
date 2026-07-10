import Image from "next/image";
import { ReactNode } from "react";

interface BackgroundSectionProps {
  imageSrc: string;
  imageAlt: string;
  overlayColor?: string; // Tailwind class e.g. "bg-black/50" or "bg-green-950/60"
  height?: string; // Tailwind class e.g. "h-[400px]"
  children: ReactNode;
}

export default function BackgroundSection({
  imageSrc,
  imageAlt,
  overlayColor = "bg-black/50",
  height = "h-[400px]",
  children,
}: BackgroundSectionProps) {
  return (
    <section className={`relative ${height} w-full overflow-hidden`}>
      {/* Background image */}
      <Image src={imageSrc} alt={imageAlt} fill className="object-cover" />
      {/* Configurable dark overlay */}
      <div className={`absolute inset-0 ${overlayColor}`} />

      {/* Centered content slot */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        {children}
      </div>
    </section>
  );
}
