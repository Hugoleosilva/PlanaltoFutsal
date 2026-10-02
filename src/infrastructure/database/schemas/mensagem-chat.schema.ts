import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface MensagemChatDocument extends Document {
  autorUserId: Types.ObjectId;
  autorNome: string;
  texto: string;
  createdAt: Date;
}

const MensagemChatSchema = new Schema<MensagemChatDocument>(
  {
    autorUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    autorNome: { type: String, required: true },
    texto: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const MensagemChatModel: Model<MensagemChatDocument> =
  models.MensagemChat ?? model<MensagemChatDocument>("MensagemChat", MensagemChatSchema);
