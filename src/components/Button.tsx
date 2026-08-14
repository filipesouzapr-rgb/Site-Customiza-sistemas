import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  className?: string;
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 hover:shadow-blue-600/30",
  secondary:
    "bg-white text-navy-900 border border-navy-900/15 hover:border-blue-600/40 hover:text-blue-700",
  ghost: "bg-white/10 text-white border border-white/25 hover:bg-white/15",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2";

export function Button({
  children,
  variant = "primary",
  icon,
  className = "",
  to,
  href,
  onClick,
  type = "button",
  disabled,
}: ButtonProps) {
  const classes = `${base} ${variantClasses[variant]} ${
    disabled ? "pointer-events-none opacity-50" : ""
  } ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
        {icon}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
        {icon}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
      {icon}
    </button>
  );
}
