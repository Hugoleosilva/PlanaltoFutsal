import { AppError } from "./app-error";
import { ValidationError } from "./validation.error";

export class ValidationException extends AppError {
  readonly fields: string[];

  constructor(errors: ValidationError[]) {
    super("Um ou mais campos são inválidos.", "VALIDATION_ERROR", 422);
    this.fields = errors.map((error) => error.field);
  }
}
