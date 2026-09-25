import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface MovimentacaoFinanceiraDocument extends Document {
  tipo: "RECEITA" | "DESPESA";
  descricao: string;
  valor: number;
  data: Date;
  categoria?: string;
  campeonatoId?: Types.ObjectId | null;
  registradoPorUserId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MovimentacaoFinanceiraSchema = new Schema<MovimentacaoFinanceiraDocument>(
  {
    tipo: { type: String, enum: ["RECEITA", "DESPESA"], required: true },
    descricao: { type: String, required: true, trim: true },
    valor: { type: Number, required: true },
    data: { type: Date, required: true },
    categoria: { type: String },
    campeonatoId: { type: Schema.Types.ObjectId, ref: "Campeonato", default: null },
    registradoPorUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const MovimentacaoFinanceiraModel: Model<MovimentacaoFinanceiraDocument> =
  models.MovimentacaoFinanceira ??
  model<MovimentacaoFinanceiraDocument>("MovimentacaoFinanceira", MovimentacaoFinanceiraSchema);

export interface MensalidadeDocument extends Document {
  atletaId: Types.ObjectId;
  referencia: string;
  valor: number;
  status: "PENDENTE" | "PAGO" | "ATRASADO";
  pagoEm?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const MensalidadeSchema = new Schema<MensalidadeDocument>(
  {
    atletaId: { type: Schema.Types.ObjectId, ref: "Atleta", required: true },
    referencia: { type: String, required: true },
    valor: { type: Number, required: true },
    status: { type: String, enum: ["PENDENTE", "PAGO", "ATRASADO"], required: true, default: "PENDENTE" },
    pagoEm: { type: Date, default: null },
  },
  { timestamps: true },
);

MensalidadeSchema.index({ atletaId: 1, referencia: 1 }, { unique: true });

export const MensalidadeModel: Model<MensalidadeDocument> =
  models.Mensalidade ?? model<MensalidadeDocument>("Mensalidade", MensalidadeSchema);
