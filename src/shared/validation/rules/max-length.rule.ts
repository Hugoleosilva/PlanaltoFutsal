import { ValidationRule } from "../validation-rule.interface";
import { isEmptyValue } from "../rule.utils";

export class MaxLengthRule implements ValidationRule<string> {
  constructor(private readonly max: number) {}

  validate(value: string): string | null {
    if (isEmptyValue(value)) return null;
    return value.length <= this.max ? null : "max_length";
  }
}
