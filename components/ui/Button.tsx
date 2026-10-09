import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ReactNode } from "react";

type ButtonVariant = "solid" | "outline" | "white" | "ghost";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  children: ReactNode;
  showArrow?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

// Variant styles map
const variantStyles: Record<ButtonVariant, string> = {
  // Green filled — primary CTA
  solid: "bg-primary text-background hover:bg-primary-dark",
  // White filled — on dark backgrounds
  white: "bg-background text-gray-900 hover:bg-gray-100",
  // White border — secondary on dark backgrounds
  outline: "border border-background text-background hover:bg-background/10",
  // Light border — secondary on light backgrounds
  ghost:
    "bg-[#FFFFFF3D] border border-gray-300 text-background hover:bg-gray-500",
};

export default function Button({
  href,
  onClick,
  variant = "solid",
  children,
  showArrow = false,
  className = "",
  type = "button",
  disabled = false,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-60";
  const styles = `${base} ${variantStyles[variant]} ${className}`;

  // Render as a link if href is provided
  if (href) {
    return (
      <Link href={href} className={styles}>
        {children}
        {showArrow && <ArrowRight size={16} />}
      </Link>
    );
  }

  // Otherwise render as a button element
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={styles}
    >
      {children}
      {showArrow && <ArrowRight size={16} />}
    </button>
  );
}
