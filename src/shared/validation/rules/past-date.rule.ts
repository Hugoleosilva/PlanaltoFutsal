import { ValidationRule } from "../validation-rule.interface";
import { isEmptyValue } from "../rule.utils";

export class PastDateRule implements ValidationRule<Date> {
  validate(value: Date): string | null {
    if (isEmptyValue(value)) return null;
    return value.getTime() < Date.now() ? null : "must_be_past";
  }
}
