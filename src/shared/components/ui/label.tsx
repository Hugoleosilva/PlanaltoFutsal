import { LabelHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>): React.ReactElement {
  return <label className={cn("text-sm text-planalto-gray", className)} {...props} />;
}
