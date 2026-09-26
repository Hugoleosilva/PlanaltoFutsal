import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/utils/cn";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-md border border-white/10 bg-planalto-black px-3 py-2 text-sm text-planalto-white outline-none focus:border-planalto-red",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";
