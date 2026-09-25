import { Schema, model, models, type Model, type Document } from "mongoose";

export interface PatrocinadorDocument extends Document {
  nome: string;
  logoUrl: string;
  depoimento?: string;
  link?: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PatrocinadorSchema = new Schema<PatrocinadorDocument>(
  {
    nome: { type: String, required: true, trim: true },
    logoUrl: { type: String, required: true },
    depoimento: { type: String },
    link: { type: String },
    ativo: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

export const PatrocinadorModel: Model<PatrocinadorDocument> =
  models.Patrocinador ?? model<PatrocinadorDocument>("Patrocinador", PatrocinadorSchema);

export interface ProdutoDocument extends Document {
  nome: string;
  descricao?: string;
  preco?: number | null;
  imagemUrl: string;
  linkWhatsapp: string;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProdutoSchema = new Schema<ProdutoDocument>(
  {
    nome: { type: String, required: true, trim: true },
    descricao: { type: String },
    preco: { type: Number, default: null },
    imagemUrl: { type: String, required: true },
    linkWhatsapp: { type: String, required: true },
    ativo: { type: Boolean, required: true, default: true },
  },
  { timestamps: true },
);

export const ProdutoModel: Model<ProdutoDocument> =
  models.Produto ?? model<ProdutoDocument>("Produto", ProdutoSchema);
