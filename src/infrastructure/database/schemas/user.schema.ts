import { Schema, model, models, Types, type Model, type Document } from "mongoose";
import { ROLES } from "@/shared/types/role";

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "ATLETA" | "USER";
  status: "ATIVO" | "INATIVO";
  atletaId?: Types.ObjectId | null;
  termsAcceptedAt?: Date | null;
  imageConsentAcceptedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, required: true, default: "USER" },
    status: { type: String, enum: ["ATIVO", "INATIVO"], required: true, default: "ATIVO" },
    atletaId: { type: Schema.Types.ObjectId, ref: "Atleta", default: null },
    termsAcceptedAt: { type: Date, default: null },
    imageConsentAcceptedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const UserModel: Model<UserDocument> = models.User ?? model<UserDocument>("User", UserSchema);
