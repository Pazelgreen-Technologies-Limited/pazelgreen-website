"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface StreamingTextProps extends React.HTMLAttributes<HTMLElement> {
  children: string;
  as?: React.ElementType;
  characterDelay?: number;
  threshold?: number;
}

export function StreamingText({
  children,
  as: Component = "span",
  characterDelay = 18,
  threshold = 0.15,
  className = "",
  ...props
}: StreamingTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const isVisible = prefersReducedMotion || hasEnteredViewport;
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const element = elementRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setHasEnteredViewport(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredViewport(true);
          observer.unobserve(element);
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReducedMotion, threshold]);

  return (
    <Component
      ref={elementRef}
      aria-label={children}
      className={`streaming-text ${className}`}
      data-visible={isVisible}
      {...props}
    >
      {Array.from(children).map((character, index) => (
        <span
          key={`${index}-${character}`}
          aria-hidden="true"
          className="streaming-text__character"
          style={{ animationDelay: `${index * characterDelay}ms` }}
        >
          {character}
        </span>
      ))}
    </Component>
  );
}
