import type { ButtonHTMLAttributes } from "react";
import type { ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "link";
  size?: "sm" | "md";
  children: ReactNode;
};

const variantClass = {
  primary: "btn btn-primary",
  ghost: "btn btn-ghost",
  link: "link-button",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const sizeClass = size === "sm" ? "btn-sm" : "";
  return (
    <button
      {...props}
      className={`${variantClass[variant]} ${sizeClass} ${className}`.trim()}
    />
  );
}
