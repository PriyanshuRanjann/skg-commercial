import Link from "next/link";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-orange cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-primary-orange text-white hover:bg-orange-600",
  secondary: "bg-primary-blue text-white hover:bg-blue-900",
  ghost: "bg-transparent text-primary-blue hover:bg-light-gray",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", fullWidth, className = "", children, ...rest },
  ref
) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`;
  return (
    <button ref={ref} className={cls} {...rest}>
      {children}
    </button>
  );
});

type LinkButtonProps = CommonProps & {
  href: string;
};

export function LinkButton({
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  href,
  children,
}: LinkButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`;
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
