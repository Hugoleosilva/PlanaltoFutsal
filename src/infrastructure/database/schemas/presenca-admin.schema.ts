import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface PresencaAdminDocument extends Document {
  userId: Types.ObjectId;
  nome: string;
  lastSeenAt: Date;
}

const PresencaAdminSchema = new Schema<PresencaAdminDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  nome: { type: String, required: true },
  lastSeenAt: { type: Date, required: true, default: Date.now },
});

export const PresencaAdminModel: Model<PresencaAdminDocument> =
  models.PresencaAdmin ?? model<PresencaAdminDocument>("PresencaAdmin", PresencaAdminSchema);
