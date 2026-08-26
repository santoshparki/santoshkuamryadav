"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import clsx from "clsx";

const variantClasses: Record<string, string> = {
  primary: "button-primary",
  secondary: "button-secondary",
  ghost: "button-ghost",
};

export function buttonClassName(variant: keyof typeof variantClasses = "primary") {
  return variantClasses[variant] ?? variantClasses.primary;
}

export function Button({
  variant = "primary",
  asChild = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantClasses;
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={clsx(buttonClassName(variant), className)} {...props} />;
}
