import { AppError } from "./app-error";

export class ForbiddenError extends AppError {
  constructor(message = "Você não tem permissão para executar esta ação.") {
    super(message, "FORBIDDEN", 403);
  }
}
