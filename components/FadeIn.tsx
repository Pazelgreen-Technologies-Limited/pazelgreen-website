"use client";

import React, { useRef, useEffect, useState } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface FadeInProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  direction?: "up" | "none";
  threshold?: number;
  rootMargin?: string;
  className?: string;
  as?: React.ElementType;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 600,
  direction = "up",
  threshold = 0.1,
  rootMargin = "0px 0px -40px 0px",
  className = "",
  as: Component = "div",
  ...props
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(prefersReducedMotion);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const currentEl = elementRef.current;
    if (!currentEl) return;

    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(currentEl);
        }
      },
      {
        threshold,
        rootMargin,
      },
    );

    observer.observe(currentEl);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, prefersReducedMotion]);

  // When prefersReducedMotion is true, no transform or transition
  if (prefersReducedMotion) {
    return (
      <Component ref={elementRef} className={className} {...props}>
        {children}
      </Component>
    );
  }

  const initialTransform = direction === "up" ? "translate-y-6" : "";

  return (
    <Component
      ref={elementRef}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : `opacity-0 ${initialTransform}`
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
