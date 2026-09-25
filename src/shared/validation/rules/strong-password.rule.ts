import { ValidationRule } from "../validation-rule.interface";
import { isEmptyValue } from "../rule.utils";

export class StrongPasswordRule implements ValidationRule<string> {
  validate(value: string): string | null {
    if (isEmptyValue(value)) return null;

    const hasMinLength = value.length >= 8;
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);

    return hasMinLength && hasLowerCase && hasUpperCase && hasNumber ? null : "weak_password";
  }
}
