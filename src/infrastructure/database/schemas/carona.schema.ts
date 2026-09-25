import { Schema, model, models, Types, type Model, type Document } from "mongoose";

export interface CaronaSolidariaDocument extends Document {
  jogoId: Types.ObjectId;
  motoristaNome: string;
  contato: string;
  horarioSaida: Date;
  local: string;
  vagasDisponiveis: number;
  criadoPorUserId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const CaronaSolidariaSchema = new Schema<CaronaSolidariaDocument>(
  {
    jogoId: { type: Schema.Types.ObjectId, ref: "Jogo", required: true },
    motoristaNome: { type: String, required: true, trim: true },
    contato: { type: String, required: true },
    horarioSaida: { type: Date, required: true },
    local: { type: String, required: true },
    vagasDisponiveis: { type: Number, required: true },
    criadoPorUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

CaronaSolidariaSchema.index({ jogoId: 1 });

export const CaronaSolidariaModel: Model<CaronaSolidariaDocument> =
  models.CaronaSolidaria ?? model<CaronaSolidariaDocument>("CaronaSolidaria", CaronaSolidariaSchema);
