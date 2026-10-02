import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME ?? "planalto-futsal" });

const AtletaSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const AtletaModel = mongoose.models.Atleta ?? mongoose.model("Atleta", AtletaSchema, "atletas");

const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const UserModel = mongoose.models.User ?? mongoose.model("User", UserSchema, "users");

const atletas = await AtletaModel.find();
console.log("=== ATLETAS ===");
atletas.forEach((a) => {
  console.log(
    a._id.toString(),
    "|",
    a.apelido,
    "| userId:",
    a.userId ?? null,
    "| contatoEmail:",
    a.contatoEmail ?? null,
    "| contatoWhatsapp:",
    a.contatoWhatsapp ?? null,
  );
});

console.log("\n=== USERS ===");
const users = await UserModel.find();
users.forEach((u) => {
  console.log(
    u._id.toString(),
    "|",
    u.email,
    "| role:",
    u.role,
    "| status:",
    u.status,
    "| atletaId:",
    u.atletaId ?? null,
    "| emailVerificadoEm:",
    u.emailVerificadoEm ?? null,
  );
});

await mongoose.disconnect();
