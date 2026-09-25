import { ValidationRule } from "../validation-rule.interface";
import { isEmptyValue } from "../rule.utils";

export class DateRule implements ValidationRule<Date | null | undefined> {
  validate(value: Date | null | undefined): string | null {
    if (isEmptyValue(value)) return null;
    return value instanceof Date && !Number.isNaN(value.getTime()) ? null : "invalid_date";
  }
}
