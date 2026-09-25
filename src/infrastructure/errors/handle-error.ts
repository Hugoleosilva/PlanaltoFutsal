import { NextResponse } from "next/server";
import { AppError } from "./app-error";
import { ValidationException } from "./validation.exception";

export interface ErrorResponseBody {
  error: {
    code: string;
    message: string;
    fields?: string[];
  };
}

function toErrorBody(error: unknown): { body: ErrorResponseBody["error"]; statusCode: number } {
  if (error instanceof ValidationException) {
    return {
      body: { code: error.code, message: error.message, fields: error.fields },
      statusCode: error.statusCode,
    };
  }

  if (error instanceof AppError) {
    return {
      body: { code: error.code, message: error.message },
      statusCode: error.statusCode,
    };
  }

  console.error("[unhandled-error]", error);

  return {
    body: {
      code: "INTERNAL_ERROR",
      message: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
    },
    statusCode: 500,
  };
}

/**
 * Converts any thrown error into a stable JSON shape for Route Handlers.
 * Unknown (non-AppError) errors are logged and reported as a generic 500
 * so internal details never leak to the client.
 */
export function handleRouteError(error: unknown): NextResponse<ErrorResponseBody> {
  const { body, statusCode } = toErrorBody(error);
  return NextResponse.json({ error: body }, { status: statusCode });
}

/**
 * Same conversion for Server Actions, which can't return a NextResponse and
 * must instead return a plain serializable object to the client component.
 */
export function toActionError(error: unknown): ErrorResponseBody["error"] {
  return toErrorBody(error).body;
}
