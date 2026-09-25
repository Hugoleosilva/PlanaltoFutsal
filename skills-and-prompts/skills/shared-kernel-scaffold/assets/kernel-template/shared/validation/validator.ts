import { ValidationException, ValidationError } from "@/infrastructure/errors";
import { ValidationField } from "./validation-field.interface";

export class Validator {
  static validate(fields: ValidationField[]): void {
    const errors: ValidationError[] = [];

    for (const field of fields) {
      for (const rule of field.rules) {
        const errorCode = rule.validate(field.value);

        if (errorCode !== null) {
          errors.push(new ValidationError(`${field.code}.${errorCode}`));
        }
      }
    }

    if (errors.length > 0) {
      throw new ValidationException(errors);
    }
  }
}
