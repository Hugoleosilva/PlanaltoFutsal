"use server";

import { revalidatePath } from "next/cache";
import { Create__MODULE_CLASS_NAME__ } from "@/core/use-cases/__MODULE_NAME__";
import { __MODULE_CLASS_NAME__ } from "@/core/domain/__MODULE_NAME__";
import { __MODULE_CLASS_NAME__RepositoryMongoose } from "@/infrastructure/database/__MODULE_NAME__/__MODULE_NAME__.repository.mongoose";

// TODO: substituir por um tipo derivado do State real de __MODULE_CLASS_NAME__
// (definido pela skill domain-entity-scaffold) assim que os campos existirem.
export type Create__MODULE_CLASS_NAME__ActionInput = ConstructorParameters<
  typeof __MODULE_CLASS_NAME__
>[0];

export async function create__MODULE_CLASS_NAME__Action(
  input: Create__MODULE_CLASS_NAME__ActionInput,
): Promise<void> {
  // TODO: proteger esta action conforme a role exigida (ADMIN, ATLETA ou USER)
  // usando o helper de sessao do NextAuth.js definido em src/infrastructure/security,
  // e registrar a acao em src/infrastructure/audit quando ela for critica.

  const entity = new __MODULE_CLASS_NAME__(input);

  const __MODULE_VARIABLE_NAME__Repository = new __MODULE_CLASS_NAME__RepositoryMongoose();
  const createUseCase = new Create__MODULE_CLASS_NAME__(__MODULE_VARIABLE_NAME__Repository);

  await createUseCase.execute({ entity });

  revalidatePath("/__MODULE_NAME__");
}
