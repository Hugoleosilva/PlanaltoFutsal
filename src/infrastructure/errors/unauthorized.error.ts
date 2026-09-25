import { AppError } from "./app-error";

export class UnauthorizedError extends AppError {
  constructor(message = "Autenticação necessária.") {
    super(message, "UNAUTHORIZED", 401);
  }
}
