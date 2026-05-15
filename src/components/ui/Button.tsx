import type { ButtonHTMLAttributes } from "react";
import type { ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "link";
  children: ReactNode;
};

const variantClass = {
  primary: "btn btn-primary",
  ghost: "btn btn-ghost",
  link: "link-button",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`${variantClass[variant]} ${className}`.trim()}
    />
  );
}
