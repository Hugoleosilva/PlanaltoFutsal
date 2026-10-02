import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME ?? "planalto-futsal" });

const JogoSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const JogoModel = mongoose.models.Jogo ?? mongoose.model("Jogo", JogoSchema, "jogos");

const jogos = await JogoModel.find().sort({ dataHora: -1 });
jogos.forEach((j) => {
  console.log(j._id.toString(), "|", j.adversario, "|", j.adversarioEscudoUrl, "|", j.dataHora);
});

await mongoose.disconnect();
