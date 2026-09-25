import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface ConsentimentoLgpdDocument extends Document {
  userId: Types.ObjectId;
  versaoTermos: string;
  termosAceitosEm: Date;
  consentimentoImagemAceitoEm?: Date | null;
  responsavelNome?: string;
  responsavelDocumento?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ConsentimentoLgpdSchema = new Schema<ConsentimentoLgpdDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    versaoTermos: { type: String, required: true },
    termosAceitosEm: { type: Date, required: true },
    consentimentoImagemAceitoEm: { type: Date, default: null },
    responsavelNome: { type: String },
    responsavelDocumento: { type: String },
  },
  { timestamps: true },
);

export const ConsentimentoLgpdModel: Model<ConsentimentoLgpdDocument> =
  models.ConsentimentoLgpd ??
  model<ConsentimentoLgpdDocument>("ConsentimentoLgpd", ConsentimentoLgpdSchema);
