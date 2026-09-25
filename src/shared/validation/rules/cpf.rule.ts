import { ValidationRule } from "../validation-rule.interface";
import { isEmptyValue } from "../rule.utils";

export class CpfRule implements ValidationRule<string> {
  validate(value: string): string | null {
    if (isEmptyValue(value)) return null;
    return isValidCpf(value) ? null : "invalid_cpf";
  }
}

function isValidCpf(rawCpf: string): boolean {
  const cpf = rawCpf.replace(/\D/g, "");

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const digits = cpf.split("").map(Number);

  const checkDigit = (length: number): number => {
    const sum = digits
      .slice(0, length)
      .reduce((total, digit, index) => total + digit * (length + 1 - index), 0);
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return checkDigit(9) === digits[9] && checkDigit(10) === digits[10];
}
