import { Schema, model, models, Types, type Model, type Document } from "mongoose";
import { FORMAS_PAGAMENTO } from "@/core/domain/servico/servico.entity";
import { CATEGORIAS_SERVICO } from "@/shared/constants/categorias-servico";

export interface ServicoDocument extends Document {
  titulo: string;
  descricao: string;
  imagensUrls: string[];
  valores?: string;
  formasPagamento: string[];
  categoria: string;
  bairro: string;
  nomeContato: string;
  contato: string;
  autorUserId: Types.ObjectId;
  status: "PENDENTE_APROVACAO" | "APROVADO" | "REJEITADO";
  moderadoPorUserId?: Types.ObjectId | null;
  moderadoEm?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ServicoSchema = new Schema<ServicoDocument>(
  {
    titulo: { type: String, required: true, trim: true },
    descricao: { type: String, required: true },
    imagensUrls: { type: [String], required: true },
    valores: { type: String },
    formasPagamento: { type: [String], enum: FORMAS_PAGAMENTO, required: true },
    categoria: { type: String, enum: CATEGORIAS_SERVICO, required: true },
    bairro: { type: String, required: true, trim: true },
    nomeContato: { type: String, required: true },
    contato: { type: String, required: true },
    autorUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["PENDENTE_APROVACAO", "APROVADO", "REJEITADO"],
      required: true,
      default: "PENDENTE_APROVACAO",
    },
    moderadoPorUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    moderadoEm: { type: Date, default: null },
  },
  { timestamps: true },
);

ServicoSchema.index({ status: 1 });

export const ServicoModel: Model<ServicoDocument> =
  models.Servico ?? model<ServicoDocument>("Servico", ServicoSchema);
