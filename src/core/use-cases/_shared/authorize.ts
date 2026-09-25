import { ForbiddenError } from "@/infrastructure/errors";
import { Role } from "@/shared/types/role";

export interface AuthenticatedActor {
  id: string;
  role: Role;
}

export function assertRole(actor: AuthenticatedActor | null, allowed: readonly Role[]): void {
  if (!actor || !allowed.includes(actor.role)) {
    throw new ForbiddenError();
  }
}
