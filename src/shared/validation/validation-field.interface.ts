import { ValidationRule } from "./validation-rule.interface";

export interface ValidationField<T = unknown> {
  code: string;
  value: T;
  rules: ValidationRule<T>[];
}
