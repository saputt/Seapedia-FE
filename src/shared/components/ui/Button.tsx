import Spinner from "./Spinner";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonProps = {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<string, string> = {
  primary:
    "bg-brand-deep text-white border-brand-deep shadow-[4px_4px_0px_0px_var(--color-brand-deep)] hover:bg-brand-mid hover:shadow-[6px_6px_0px_0px_var(--color-brand-deep)] hover:-translate-x-px hover:-translate-y-px active:shadow-[2px_2px_0px_0px_var(--color-brand-deep)] active:translate-x-[2px] active:translate-y-[2px]",
  ghost:
    "bg-white text-brand-deep border-brand-deep shadow-[4px_4px_0px_0px_var(--color-brand-deep)] hover:bg-brand-subtle hover:shadow-[6px_6px_0px_0px_var(--color-brand-deep)] hover:-translate-x-px hover:-translate-y-px active:shadow-[2px_2px_0px_0px_var(--color-brand-deep)] active:translate-x-[2px] active:translate-y-[2px]",
  danger:
    "bg-danger text-white border-danger shadow-[4px_4px_0px_0px_#7F1D1D] hover:shadow-[6px_6px_0px_0px_#7F1D1D] hover:-translate-x-px hover:-translate-y-px active:shadow-[2px_2px_0px_0px_#7F1D1D] active:translate-x-[2px] active:translate-y-[2px]",
};

const sizeStyles: Record<string, string> = {
  sm: "text-xs !py-1.5 !px-3",
  md: "text-sm !py-2 !px-5",
  lg: "text-base !py-3 !px-6",
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  children,
  className = "",
  ...props
}: ButtonProps) => (
  <button
    className={[
      "font-bold border-[3px] cursor-pointer transition-all duration-100",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "inline-flex items-center justify-center gap-2",
      variantStyles[variant],
      sizeStyles[size],
      fullWidth ? "w-full" : "",
      className,
    ].join(" ")}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading && <Spinner size="sm" />}
    {children}
  </button>
);

export default Button;
