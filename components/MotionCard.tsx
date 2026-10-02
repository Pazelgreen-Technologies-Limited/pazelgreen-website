"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ComponentProps, ReactNode } from "react";

interface MotionCardProps extends ComponentProps<typeof motion.div> {
  children: ReactNode;
  delay?: number;
  tiltOnHover?: boolean;
}

export default function MotionCard({
  children,
  delay = 0,
  tiltOnHover = false,
  ...props
}: MotionCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              y: -4,
              rotate: tiltOnHover ? 1.5 : 0,
              boxShadow: "0 16px 30px rgba(8, 80, 16, 0.12)",
              transition: {
                duration: 0.18,
                ease: "easeOut",
              },
            }
      }
      transition={{
        duration: 0.45,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      viewport={{ once: false, amount: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
