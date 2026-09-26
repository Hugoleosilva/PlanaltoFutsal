import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/utils/cn";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-planalto-white outline-none placeholder:text-planalto-gray focus:border-planalto-red",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
