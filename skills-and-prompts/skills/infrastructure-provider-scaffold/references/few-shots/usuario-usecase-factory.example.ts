// Exemplo de "composition root" leve: nao ha container de DI (nao ha NestJS
// neste projeto). Cada Route Handler ou Server Action monta o caso de uso
// injetando a implementacao concreta da infraestrutura diretamente.
//
// Este arquivo tipicamente fica perto do ponto de uso, por exemplo em
// src/infrastructure/security/usuario-usecase-factory.ts, ou inline dentro
// do proprio Route Handler quando a montagem for simples.

import { RegistrarUsuario } from "@/core/use-cases/usuario";
import { BcryptCryptoProvider } from "./bcrypt-crypto.provider";
import { UsuarioRepositoryMongoose } from "@/infrastructure/database/usuario/usuario.repository.mongoose";

export function makeRegistrarUsuario(): RegistrarUsuario {
  const cryptoProvider = new BcryptCryptoProvider();
  const usuarioRepository = new UsuarioRepositoryMongoose();

  return new RegistrarUsuario(cryptoProvider, usuarioRepository);
}

// Uso dentro de um Route Handler (src/app/api/usuarios/route.ts):
//
// export async function POST(request: Request) {
//   const body = await request.json();
//   const registrarUsuario = makeRegistrarUsuario();
//   await registrarUsuario.execute(body);
//   return Response.json({ ok: true }, { status: 201 });
// }
