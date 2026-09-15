"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

interface AboutImagePlaceholderProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  label?: string;
  objectFit?: "cover" | "contain";
}

export default function AboutImagePlaceholder({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  priority = false,
  label,
  objectFit = "cover",
}: AboutImagePlaceholderProps) {
  const [hasError, setHasError] = useState(false);

  const fileName = src.split("/").pop() || src;
  const displayLabel = label || fileName;

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center border border-dashed border-emerald-300/40 bg-gradient-to-br from-emerald-950/20 via-emerald-900/10 to-stone-900/20 p-4 text-center text-gray-400 ${
          fill ? "absolute inset-0 h-full w-full" : ""
        } ${className}`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <ImageIcon className="mb-2 h-7 w-7 text-emerald-500/70" />
        <span className="font-mono text-xs font-semibold text-emerald-400">
          {displayLabel}
        </span>
        <span className="mt-1 text-[10px] text-gray-400">
          Drop in public{src}
        </span>
      </div>
    );
  }

  if (fill) {
    return (
      <div className={`relative h-full w-full ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={`object-${objectFit}`}
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 600}
      height={height || 400}
      priority={priority}
      className={`${className} object-${objectFit}`}
      onError={() => setHasError(true)}
    />
  );
}
