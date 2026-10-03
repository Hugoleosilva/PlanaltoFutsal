import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/utils/cn";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-md border border-surface/10 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-planalto-red",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";
