export class ValidationError extends Error {
  constructor(readonly field: string) {
    super(field);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
