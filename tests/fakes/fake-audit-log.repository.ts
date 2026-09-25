import { AuditLog } from "@/core/domain/audit/audit-log.entity";
import { AuditLogRepository } from "@/core/domain/audit/audit-log.repository";

export class FakeAuditLogRepository implements AuditLogRepository {
  readonly logs: AuditLog[] = [];

  async create(log: AuditLog): Promise<AuditLog> {
    this.logs.push(log);
    return log;
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    return this.logs.filter((log) => log.entityType === entityType && log.entityId === entityId);
  }
}
