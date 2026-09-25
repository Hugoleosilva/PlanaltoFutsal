import { NextRequest, NextResponse } from "next/server";
import { EnviarFotosTorcedorUseCase } from "@/core/use-cases/foto/enviar-fotos-torcedor.use-case";
import { MongoFotoRepository } from "@/infrastructure/database/repositories/foto.repository.mongo";
import { handleRouteError } from "@/infrastructure/errors";

interface EnviarFotosRequestBody {
  fotos: { url: string; descricao?: string; categoria: "ANTIGA" | "ATUAL" }[];
  enviadoPorNome?: string;
  enviadoPorContato?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as EnviarFotosRequestBody;

    const useCase = new EnviarFotosTorcedorUseCase(new MongoFotoRepository());

    const { fotos } = await useCase.execute({
      fotos: body.fotos,
      enviadoPorNome: body.enviadoPorNome,
      enviadoPorContato: body.enviadoPorContato,
    });

    return NextResponse.json(
      { fotos: fotos.map((foto) => ({ id: foto.id, status: foto.status })) },
      { status: 201 },
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
