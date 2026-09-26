import { ValidationRule } from "../validation-rule.interface";
import { isEmptyValue } from "../rule.utils";

const PHONE_BR_REGEX = /^\+?(55)?\s?\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

export class PhoneBrRule implements ValidationRule<string> {
  validate(value: string): string | null {
    if (isEmptyValue(value)) return null;
    return PHONE_BR_REGEX.test(value.replace(/\s/g, " ").trim()) ? null : "invalid_phone_br";
  }
}
