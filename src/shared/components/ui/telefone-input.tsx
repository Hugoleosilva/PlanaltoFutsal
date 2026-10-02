"use client";

import { InputHTMLAttributes, forwardRef, useState } from "react";
import { Input } from "./input";

function formatarTelefoneBr(valorBruto: string): string {
  const digitos = valorBruto.replace(/\D/g, "").slice(0, 11);

  if (digitos.length === 0) return "";
  if (digitos.length <= 2) return `(${digitos}`;
  if (digitos.length <= 7) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export const TelefoneInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ defaultValue, ...props }, ref) => {
    const [valor, setValor] = useState(() => formatarTelefoneBr(String(defaultValue ?? "")));

    return (
      <Input
        ref={ref}
        type="tel"
        inputMode="numeric"
        placeholder="(81) 99999-9999"
        value={valor}
        onChange={(event) => setValor(formatarTelefoneBr(event.target.value))}
        {...props}
      />
    );
  },
);

TelefoneInput.displayName = "TelefoneInput";
