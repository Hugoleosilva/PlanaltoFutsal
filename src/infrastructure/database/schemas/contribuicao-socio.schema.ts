import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface ContribuicaoSocioDocument extends Document {
  userId: Types.ObjectId;
  tipo: "MENSAL" | "UNICO";
  referencia: string;
  valor: number;
  status: "PENDENTE" | "PAGO";
  dataVencimento: Date;
  pagoEm?: Date | null;
  movimentacaoFinanceiraId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const ContribuicaoSocioSchema = new Schema<ContribuicaoSocioDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tipo: { type: String, enum: ["MENSAL", "UNICO"], required: true },
    referencia: { type: String, required: true },
    valor: { type: Number, required: true },
    status: { type: String, enum: ["PENDENTE", "PAGO"], required: true, default: "PENDENTE" },
    dataVencimento: { type: Date, required: true },
    pagoEm: { type: Date, default: null },
    movimentacaoFinanceiraId: { type: Schema.Types.ObjectId, ref: "MovimentacaoFinanceira", default: null },
  },
  { timestamps: true },
);

ContribuicaoSocioSchema.index({ userId: 1, referencia: 1 }, { unique: true });

export const ContribuicaoSocioModel: Model<ContribuicaoSocioDocument> =
  models.ContribuicaoSocio ?? model<ContribuicaoSocioDocument>("ContribuicaoSocio", ContribuicaoSocioSchema);
