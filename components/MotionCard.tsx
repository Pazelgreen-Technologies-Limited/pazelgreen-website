import type { ComponentProps, ReactNode } from "react";

interface MotionCardProps extends ComponentProps<"div"> {
  children: ReactNode;
}

export default function MotionCard({ children, ...props }: MotionCardProps) {
  return <div {...props}>{children}</div>;
}
