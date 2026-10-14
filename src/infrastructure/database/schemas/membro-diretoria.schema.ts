import { Schema, model, models, type Model, type Document, type Types } from "mongoose";

export interface MembroDiretoriaDocument extends Document {
  nome: string;
  funcao: string;
  fotoUrl?: string | null;
  bio?: string;
  ordem: number;
  contato?: string;
  contatoEmail?: string;
  userId?: Types.ObjectId | null;
  status: "ATIVO" | "INATIVO";
  createdAt: Date;
  updatedAt: Date;
}

const MembroDiretoriaSchema = new Schema<MembroDiretoriaDocument>(
  {
    nome: { type: String, required: true, trim: true },
    funcao: { type: String, required: true, trim: true },
    fotoUrl: { type: String, default: null },
    bio: { type: String },
    ordem: { type: Number, required: true, default: 0 },
    contato: { type: String },
    contatoEmail: { type: String, lowercase: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    status: { type: String, enum: ["ATIVO", "INATIVO"], required: true, default: "ATIVO" },
  },
  { timestamps: true },
);

export const MembroDiretoriaModel: Model<MembroDiretoriaDocument> =
  models.MembroDiretoria ?? model<MembroDiretoriaDocument>("MembroDiretoria", MembroDiretoriaSchema);
