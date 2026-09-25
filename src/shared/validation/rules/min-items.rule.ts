import { ValidationRule } from "../validation-rule.interface";

export class MinItemsRule implements ValidationRule<unknown[]> {
  constructor(private readonly min: number) {}

  validate(value: unknown[]): string | null {
    if (!Array.isArray(value)) return null;
    return value.length >= this.min ? null : "min_items";
  }
}
