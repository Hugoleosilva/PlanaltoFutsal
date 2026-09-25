import { AuditLog } from "./audit-log.entity";

export interface AuditLogRepository {
  create(log: AuditLog): Promise<AuditLog>;
  findByEntity(entityType: string, entityId: string): Promise<AuditLog[]>;
}
