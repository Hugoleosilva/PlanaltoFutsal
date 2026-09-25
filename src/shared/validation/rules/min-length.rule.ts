import { ValidationRule } from "../validation-rule.interface";
import { isEmptyValue } from "../rule.utils";

export class MinLengthRule implements ValidationRule<string> {
  constructor(private readonly min: number) {}

  validate(value: string): string | null {
    if (isEmptyValue(value)) return null;
    return value.length >= this.min ? null : "min_length";
  }
}
