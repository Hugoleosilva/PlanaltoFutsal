import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface OpcaoEnqueteSubdocument {
  id: string;
  texto: string;
  votos: number;
}

export interface EnqueteDocument extends Document {
  pergunta: string;
  opcoes: OpcaoEnqueteSubdocument[];
  status: "ATIVA" | "ENCERRADA";
  criadoPorUserId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OpcaoEnqueteSchema = new Schema<OpcaoEnqueteSubdocument>(
  {
    id: { type: String, required: true },
    texto: { type: String, required: true },
    votos: { type: Number, required: true, default: 0 },
  },
  { _id: false },
);

const EnqueteSchema = new Schema<EnqueteDocument>(
  {
    pergunta: { type: String, required: true },
    opcoes: { type: [OpcaoEnqueteSchema], required: true },
    status: { type: String, enum: ["ATIVA", "ENCERRADA"], required: true, default: "ATIVA" },
    criadoPorUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const EnqueteModel: Model<EnqueteDocument> =
  models.Enquete ?? model<EnqueteDocument>("Enquete", EnqueteSchema);

export interface ComunicadoDocument extends Document {
  titulo: string;
  corpo: string;
  tipo: "AVISO" | "NOTICIA";
  fixado: boolean;
  autorUserId: Types.ObjectId;
  publicadoEm: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ComunicadoSchema = new Schema<ComunicadoDocument>(
  {
    titulo: { type: String, required: true },
    corpo: { type: String, required: true },
    tipo: { type: String, enum: ["AVISO", "NOTICIA"], required: true, default: "AVISO" },
    fixado: { type: Boolean, required: true, default: false },
    autorUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    publicadoEm: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true },
);

export const ComunicadoModel: Model<ComunicadoDocument> =
  models.Comunicado ?? model<ComunicadoDocument>("Comunicado", ComunicadoSchema);
