import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface VerificacaoEmailDocument extends Document {
  userId: Types.ObjectId;
  token: string;
  expiraEm: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificacaoEmailSchema = new Schema<VerificacaoEmailDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiraEm: { type: Date, required: true },
  },
  { timestamps: true },
);

export const VerificacaoEmailModel: Model<VerificacaoEmailDocument> =
  models.VerificacaoEmail ?? model<VerificacaoEmailDocument>("VerificacaoEmail", VerificacaoEmailSchema);
