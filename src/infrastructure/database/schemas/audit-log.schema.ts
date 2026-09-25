import { Schema, model, models, Types, type Model, type Document } from "mongoose";
import { AUDIT_ACTIONS } from "@/core/domain/audit/audit-log.entity";

export interface AuditLogDocument extends Document {
  action: (typeof AUDIT_ACTIONS)[number];
  actorUserId: Types.ObjectId;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<AuditLogDocument>(
  {
    action: { type: String, enum: AUDIT_ACTIONS, required: true },
    actorUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

AuditLogSchema.index({ entityType: 1, entityId: 1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLogModel: Model<AuditLogDocument> =
  models.AuditLog ?? model<AuditLogDocument>("AuditLog", AuditLogSchema);
