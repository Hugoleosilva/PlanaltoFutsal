import { NextRequest, NextResponse } from "next/server";
import { Find__MODULE_CLASS_NAME__Page } from "@/core/use-cases/__MODULE_NAME__";
import { __MODULE_CLASS_NAME__RepositoryMongoose } from "@/infrastructure/database/__MODULE_NAME__/__MODULE_NAME__.repository.mongoose";

// TODO: proteger esta rota conforme a role exigida (ADMIN, ATLETA ou USER)
// usando o helper de sessao do NextAuth.js definido em src/infrastructure/security.

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? "1");
  const perPage = Number(searchParams.get("perPage") ?? "20");

  const __MODULE_VARIABLE_NAME__Repository = new __MODULE_CLASS_NAME__RepositoryMongoose();
  const findPage = new Find__MODULE_CLASS_NAME__Page(__MODULE_VARIABLE_NAME__Repository);

  const result = await findPage.execute({ page, perPage });

  return NextResponse.json(result);
}
