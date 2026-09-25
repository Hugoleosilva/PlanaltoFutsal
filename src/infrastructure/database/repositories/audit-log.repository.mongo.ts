import { AuditLog, AuditLogState } from "@/core/domain/audit/audit-log.entity";
import { AuditLogRepository } from "@/core/domain/audit/audit-log.repository";
import { connectToDatabase } from "../mongoose";
import { AuditLogDocument, AuditLogModel } from "../schemas/audit-log.schema";

function toEntity(doc: AuditLogDocument): AuditLog {
  const state: AuditLogState = {
    id: doc.id as string,
    action: doc.action,
    actorUserId: doc.actorUserId.toString(),
    entityType: doc.entityType,
    entityId: doc.entityId,
    metadata: doc.metadata,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  return AuditLog.create(state);
}

export class MongoAuditLogRepository implements AuditLogRepository {
  async create(log: AuditLog): Promise<AuditLog> {
    await connectToDatabase();
    const created = await AuditLogModel.create({
      action: log.action,
      actorUserId: log.actorUserId,
      entityType: log.entityType,
      entityId: log.entityId,
      metadata: log.metadata,
    });
    return toEntity(created);
  }

  async findByEntity(entityType: string, entityId: string): Promise<AuditLog[]> {
    await connectToDatabase();
    const docs = await AuditLogModel.find({ entityType, entityId }).sort({ createdAt: -1 });
    return docs.map(toEntity);
  }
}
