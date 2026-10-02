import { ValidationRule } from "../validation-rule.interface";
import { isEmptyValue } from "../rule.utils";

export class NonNegativeRule implements ValidationRule<number> {
  validate(value: number): string | null {
    if (isEmptyValue(value)) return null;
    return value >= 0 ? null : "must_be_non_negative";
  }
}
