// Troca o role de uma conta já existente, pra testar as 3 telas (Diretoria,
// Atleta, Portal Público) sem precisar criar uma conta nova pra cada papel.
// Não mexe em senha nem em vínculo com Atleta — só troca o campo role.
//
// Uso:
//   node --env-file=.env.local scripts/set-role.mjs <email> <ADMIN|ATLETA|USER>
//   npm run set-role -- <email> <ADMIN|ATLETA|USER>

import mongoose from "mongoose";

const ROLES_VALIDOS = ["ADMIN", "ATLETA", "USER"];

const [, , email, role] = process.argv;

if (!email || !role || !ROLES_VALIDOS.includes(role.toUpperCase())) {
  console.error("Uso: node --env-file=.env.local scripts/set-role.mjs <email> <ADMIN|ATLETA|USER>");
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI não definida. Rode com: node --env-file=.env.local scripts/set-role.mjs ...");
  process.exit(1);
}

await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME ?? "planalto-futsal" });

const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const UserModel = mongoose.models.User ?? mongoose.model("User", UserSchema, "users");

const emailNormalizado = email.toLowerCase();

// findOneAndUpdate com $set aplica um comando de update direto no MongoDB,
// sem depender do rastreamento de mudanças do Mongoose sobre um schema solto
// (strict:false) — atribuir doc.campo = valor + .save() pode silenciosamente
// não persistir campos que não estão declarados no schema.
const usuario = await UserModel.findOneAndUpdate(
  { email: emailNormalizado },
  { $set: { role: role.toUpperCase(), status: "ATIVO" } },
  { new: true },
);

if (!usuario) {
  console.error(`Nenhum usuário encontrado com o e-mail ${emailNormalizado}.`);
  process.exit(1);
}

console.log(`${emailNormalizado} agora é ${usuario.role}. Saia e entre de novo pra a sessão atualizar.`);

if (usuario.role === "ATLETA" && !usuario.atletaId) {
  console.log(
    "Aviso: essa conta ainda não está vinculada a nenhum perfil de Atleta — o painel /atleta vai " +
      "mostrar a mensagem de 'perfil não vinculado' até você vincular pela Diretoria (Elenco > " +
      "Promover torcedor para atleta, ou cadastrando um atleta com o mesmo e-mail de contato).",
  );
}

await mongoose.disconnect();
