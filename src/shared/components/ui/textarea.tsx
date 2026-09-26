import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/utils/cn";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md border border-white/10 bg-transparent px-3 py-2 text-sm text-planalto-white outline-none placeholder:text-planalto-gray focus:border-planalto-red",
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
