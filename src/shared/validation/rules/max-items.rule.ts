import { ValidationRule } from "../validation-rule.interface";

export class MaxItemsRule implements ValidationRule<unknown[]> {
  constructor(private readonly max: number) {}

  validate(value: unknown[]): string | null {
    if (!Array.isArray(value)) return null;
    return value.length <= this.max ? null : "max_items";
  }
}
