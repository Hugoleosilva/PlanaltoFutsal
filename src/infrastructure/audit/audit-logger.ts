import { AuditLog, AuditAction } from "@/core/domain/audit/audit-log.entity";
import { MongoAuditLogRepository } from "@/infrastructure/database/repositories/audit-log.repository.mongo";

const auditLogRepository = new MongoAuditLogRepository();

export interface LogCriticalActionInput {
  action: AuditAction;
  actorUserId: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}

/**
 * Single entry point used by Route Handlers/Server Actions that don't go
 * through a use-case's own audit call (use-cases that mutate critical data
 * should prefer injecting AuditLogRepository directly, see
 * src/core/use-cases/foto, /atleta and /financeiro).
 */
export async function logCriticalAction(input: LogCriticalActionInput): Promise<void> {
  await auditLogRepository.create(AuditLog.create(input));
}

export function getAuditLogRepository(): MongoAuditLogRepository {
  return auditLogRepository;
}
