import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface DocumentoAtletaSubdocument {
  tipo: "RG" | "CPF" | "ATESTADO_MEDICO";
  url: string;
  enviadoEm: Date;
}

export interface AtletaDocument extends Document {
  userId?: Types.ObjectId | null;
  nomeCompleto: string;
  apelido: string;
  dataNascimento: Date;
  fotoPrincipalUrl?: string | null;
  galeriaFotosUrls: string[];
  bio?: string;
  posicao?: "GOLEIRO" | "FIXO" | "ALA" | "PIVO" | "LINHA" | null;
  estiloDeJogo?: string;
  preferencias?: string;
  documentos: DocumentoAtletaSubdocument[];
  status: "ATIVO" | "INATIVO";
  createdAt: Date;
  updatedAt: Date;
}

const DocumentoAtletaSchema = new Schema<DocumentoAtletaSubdocument>(
  {
    tipo: { type: String, enum: ["RG", "CPF", "ATESTADO_MEDICO"], required: true },
    url: { type: String, required: true },
    enviadoEm: { type: Date, required: true, default: () => new Date() },
  },
  { _id: false },
);

const AtletaSchema = new Schema<AtletaDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    nomeCompleto: { type: String, required: true, trim: true },
    apelido: { type: String, required: true, trim: true },
    dataNascimento: { type: Date, required: true },
    fotoPrincipalUrl: { type: String, default: null },
    galeriaFotosUrls: { type: [String], default: [] },
    bio: { type: String },
    posicao: { type: String, enum: ["GOLEIRO", "FIXO", "ALA", "PIVO", "LINHA"], default: null },
    estiloDeJogo: { type: String },
    preferencias: { type: String },
    documentos: { type: [DocumentoAtletaSchema], default: [] },
    status: { type: String, enum: ["ATIVO", "INATIVO"], required: true, default: "ATIVO" },
  },
  { timestamps: true },
);

export const AtletaModel: Model<AtletaDocument> =
  models.Atleta ?? model<AtletaDocument>("Atleta", AtletaSchema);
