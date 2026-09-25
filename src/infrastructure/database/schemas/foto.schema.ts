import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface FotoDocument extends Document {
  url: string;
  descricao?: string;
  categoria: "ANTIGA" | "ATUAL";
  status: "PENDENTE_APROVACAO" | "APROVADA" | "REJEITADA";
  enviadoPorNome?: string;
  enviadoPorContato?: string;
  atletaId?: Types.ObjectId | null;
  loteEnvioId: string;
  moderadoPorUserId?: Types.ObjectId | null;
  moderadoEm?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const FotoSchema = new Schema<FotoDocument>(
  {
    url: { type: String, required: true },
    descricao: { type: String },
    categoria: { type: String, enum: ["ANTIGA", "ATUAL"], required: true },
    status: {
      type: String,
      enum: ["PENDENTE_APROVACAO", "APROVADA", "REJEITADA"],
      required: true,
      default: "PENDENTE_APROVACAO",
    },
    enviadoPorNome: { type: String },
    enviadoPorContato: { type: String },
    atletaId: { type: Schema.Types.ObjectId, ref: "Atleta", default: null },
    loteEnvioId: { type: String, required: true },
    moderadoPorUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    moderadoEm: { type: Date, default: null },
  },
  { timestamps: true },
);

FotoSchema.index({ status: 1 });
FotoSchema.index({ loteEnvioId: 1 });

export const FotoModel: Model<FotoDocument> = models.Foto ?? model<FotoDocument>("Foto", FotoSchema);
