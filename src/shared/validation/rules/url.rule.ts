import { ValidationRule } from "../validation-rule.interface";
import { isEmptyValue } from "../rule.utils";

export class UrlRule implements ValidationRule<string> {
  validate(value: string): string | null {
    if (isEmptyValue(value)) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return "invalid_url";
    }
  }
}
