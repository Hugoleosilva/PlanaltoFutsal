import { ValidationRule } from "../validation-rule.interface";
import { isEmptyValue } from "../rule.utils";

export class InRule<T> implements ValidationRule<T> {
  constructor(private readonly allowed: readonly T[]) {}

  validate(value: T): string | null {
    if (isEmptyValue(value)) return null;
    return this.allowed.includes(value) ? null : "not_in_allowed_values";
  }
}
