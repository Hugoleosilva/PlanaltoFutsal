// Script único de bootstrap: cria (ou promove) a primeira conta ADMIN do
// sistema. Não passa pelas Entidades/Use Cases de propósito — é infra de
// setup, roda fora do Next.js, direto contra o MongoDB.
//
// Uso:
//   node --env-file=.env.local scripts/seed-admin.mjs <email> <senha> ["Nome"]
//   npm run seed:admin -- <email> <senha> ["Nome"]

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const [, , email, senha, nome] = process.argv;

if (!email || !senha) {
  console.error('Uso: node --env-file=.env.local scripts/seed-admin.mjs <email> <senha> ["Nome"]');
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI não definida. Rode com: node --env-file=.env.local scripts/seed-admin.mjs ...");
  process.exit(1);
}

await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME ?? "planalto-futsal" });

const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const UserModel = mongoose.models.User ?? mongoose.model("User", UserSchema, "users");

const emailNormalizado = email.toLowerCase();
const existente = await UserModel.findOne({ email: emailNormalizado });

if (existente) {
  // findOneAndUpdate com $set em vez de mutar o doc + .save(): num schema
  // solto (strict:false) a atribuição direta pode não ser rastreada pelo
  // Mongoose e silenciosamente não persistir.
  await UserModel.findOneAndUpdate(
    { email: emailNormalizado },
    { $set: { role: "ADMIN", status: "ATIVO", emailVerificadoEm: existente.emailVerificadoEm ?? new Date() } },
  );
  console.log(`Usuário existente promovido para ADMIN: ${emailNormalizado}`);
} else {
  const passwordHash = await bcrypt.hash(senha, 12);
  await UserModel.create({
    name: nome ?? "Diretoria",
    email: emailNormalizado,
    passwordHash,
    role: "ADMIN",
    status: "ATIVO",
    emailVerificadoEm: new Date(),
  });
  console.log(`Admin criado: ${emailNormalizado}`);
}

await mongoose.disconnect();
