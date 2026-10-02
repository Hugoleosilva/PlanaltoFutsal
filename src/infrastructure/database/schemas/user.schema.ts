import { Schema, model, models, Types, type Model, type Document } from "mongoose";
import { ROLES } from "@/shared/types/role";
import { USER_STATUSES } from "@/core/domain/user/user.entity";

export interface UserDocument extends Document {
  name: string;
  email: string;
  whatsapp?: string;
  passwordHash: string;
  role: "ADMIN" | "ATLETA" | "USER";
  status: "PENDENTE_VERIFICACAO" | "ATIVO" | "INATIVO";
  atletaId?: Types.ObjectId | null;
  emailVerificadoEm?: Date | null;
  termsAcceptedAt?: Date | null;
  imageConsentAcceptedAt?: Date | null;
  socio: boolean;
  socioDesde?: Date | null;
  socioTipoPlano?: "MENSAL" | "UNICO" | null;
  socioValorPlano?: number | null;
  socioDiaVencimento?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    whatsapp: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, required: true, default: "USER" },
    status: {
      type: String,
      enum: USER_STATUSES,
      required: true,
      default: "PENDENTE_VERIFICACAO",
    },
    atletaId: { type: Schema.Types.ObjectId, ref: "Atleta", default: null },
    emailVerificadoEm: { type: Date, default: null },
    termsAcceptedAt: { type: Date, default: null },
    imageConsentAcceptedAt: { type: Date, default: null },
    socio: { type: Boolean, required: true, default: false },
    socioDesde: { type: Date, default: null },
    socioTipoPlano: { type: String, enum: ["MENSAL", "UNICO"], default: null },
    socioValorPlano: { type: Number, default: null },
    socioDiaVencimento: { type: Number, default: null },
  },
  { timestamps: true },
);

export const UserModel: Model<UserDocument> = models.User ?? model<UserDocument>("User", UserSchema);
