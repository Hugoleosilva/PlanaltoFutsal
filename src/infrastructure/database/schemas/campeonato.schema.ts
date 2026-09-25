import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface CampeonatoDocument extends Document {
  nome: string;
  dataInicio?: Date | null;
  diasDeJogo: string[];
  horarios: string[];
  taxaInscricao?: number | null;
  taxaArbitragem?: number | null;
  status: "OPORTUNIDADE" | "INSCRITO" | "EM_ANDAMENTO" | "ENCERRADO";
  createdAt: Date;
  updatedAt: Date;
}

const CampeonatoSchema = new Schema<CampeonatoDocument>(
  {
    nome: { type: String, required: true, trim: true },
    dataInicio: { type: Date, default: null },
    diasDeJogo: { type: [String], default: [] },
    horarios: { type: [String], default: [] },
    taxaInscricao: { type: Number, default: null },
    taxaArbitragem: { type: Number, default: null },
    status: {
      type: String,
      enum: ["OPORTUNIDADE", "INSCRITO", "EM_ANDAMENTO", "ENCERRADO"],
      required: true,
      default: "OPORTUNIDADE",
    },
  },
  { timestamps: true },
);

export const CampeonatoModel: Model<CampeonatoDocument> =
  models.Campeonato ?? model<CampeonatoDocument>("Campeonato", CampeonatoSchema);

export interface InscricaoCampeonatoDocument extends Document {
  campeonatoId: Types.ObjectId;
  atletaId: Types.ObjectId;
  categoria?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InscricaoCampeonatoSchema = new Schema<InscricaoCampeonatoDocument>(
  {
    campeonatoId: { type: Schema.Types.ObjectId, ref: "Campeonato", required: true },
    atletaId: { type: Schema.Types.ObjectId, ref: "Atleta", required: true },
    categoria: { type: String },
  },
  { timestamps: true },
);

InscricaoCampeonatoSchema.index({ campeonatoId: 1, atletaId: 1 }, { unique: true });

export const InscricaoCampeonatoModel: Model<InscricaoCampeonatoDocument> =
  models.InscricaoCampeonato ??
  model<InscricaoCampeonatoDocument>("InscricaoCampeonato", InscricaoCampeonatoSchema);
