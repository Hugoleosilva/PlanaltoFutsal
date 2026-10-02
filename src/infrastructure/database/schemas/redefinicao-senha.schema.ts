import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface RedefinicaoSenhaDocument extends Document {
  userId: Types.ObjectId;
  token: string;
  expiraEm: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RedefinicaoSenhaSchema = new Schema<RedefinicaoSenhaDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    expiraEm: { type: Date, required: true },
  },
  { timestamps: true },
);

export const RedefinicaoSenhaModel: Model<RedefinicaoSenhaDocument> =
  models.RedefinicaoSenha ?? model<RedefinicaoSenhaDocument>("RedefinicaoSenha", RedefinicaoSenhaSchema);
