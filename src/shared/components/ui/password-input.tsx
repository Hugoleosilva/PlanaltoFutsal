"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type">
>(({ className, ...props }, ref) => {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={visivel ? "text" : "password"}
        className={cn(
          "w-full rounded-md border border-surface/10 bg-transparent px-3 py-2 pr-10 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-planalto-red",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisivel((prev) => !prev)}
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
      >
        {visivel ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
