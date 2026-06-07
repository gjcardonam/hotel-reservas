import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "dark"
  | "outline"
  | "ghost"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-50 active:scale-[.98] whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gold-500 text-white shadow-soft hover:bg-gold-600 focus-visible:ring-gold-200",
  dark: "bg-night-900 text-white shadow-soft hover:bg-night-800 focus-visible:ring-night-200",
  outline:
    "border border-night-200 bg-white text-night-800 hover:bg-night-50 focus-visible:ring-night-100",
  ghost: "text-night-700 hover:bg-night-100 focus-visible:ring-night-100",
  danger:
    "bg-red-600 text-white shadow-soft hover:bg-red-700 focus-visible:ring-red-200",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string
) {
  return cn(base, variants[variant], sizes[size], className);
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={buttonClass(variant, size, className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
