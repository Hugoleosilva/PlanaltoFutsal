import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME ?? "planalto-futsal" });

const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const UserModel = mongoose.models.User ?? mongoose.model("User", UserSchema, "users");

const ContribSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const ContribModel =
  mongoose.models.ContribuicaoSocio ?? mongoose.model("ContribuicaoSocio", ContribSchema, "contribuicaosocios");

const socios = await UserModel.find({ socio: true });
console.log("=== SOCIOS ===");
socios.forEach((s) => {
  console.log(
    s._id.toString(),
    "|",
    s.email,
    "| socioTipoPlano:",
    s.socioTipoPlano ?? null,
    "| socioValorPlano:",
    s.socioValorPlano ?? null,
    "| socioDiaVencimento:",
    s.socioDiaVencimento ?? null,
    "| socioDesde:",
    s.socioDesde ?? null,
  );
});

console.log("\n=== CONTRIBUICOES ===");
const contribs = await ContribModel.find();
contribs.forEach((c) => {
  console.log(c._id.toString(), "| userId:", c.userId?.toString(), "| status:", c.status, "| valor:", c.valor);
});

await mongoose.disconnect();
