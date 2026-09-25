import { ValidationRule } from "../validation-rule.interface";
import { isEmptyValue } from "../rule.utils";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class EmailRule implements ValidationRule<string> {
  validate(value: string): string | null {
    if (isEmptyValue(value)) return null;
    return EMAIL_REGEX.test(value) ? null : "invalid_email";
  }
}
