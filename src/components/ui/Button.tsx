import Link from "next/link";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-[var(--bg-deep)] hover:bg-accent",
  secondary: "bg-[var(--bg-deep)] text-foreground hover:bg-accent-light",
  ghost: "bg-transparent text-foreground hover:bg-[var(--bg-elevated)]",
  danger: "bg-red-600 text-foreground hover:bg-red-700",
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
