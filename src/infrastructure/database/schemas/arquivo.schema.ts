import { Schema, model, models, type Model, type Document } from "mongoose";

export interface ArquivoDocument extends Document {
  dados: Buffer;
  contentType: string;
  tamanhoBytes: number;
  nomeOriginal?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ArquivoSchema = new Schema<ArquivoDocument>(
  {
    dados: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    tamanhoBytes: { type: Number, required: true },
    nomeOriginal: { type: String },
  },
  { timestamps: true },
);

export const ArquivoModel: Model<ArquivoDocument> =
  models.Arquivo ?? model<ArquivoDocument>("Arquivo", ArquivoSchema);
