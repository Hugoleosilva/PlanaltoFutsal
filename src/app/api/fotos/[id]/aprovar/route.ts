import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/infrastructure/security/auth";
import { AprovarFotoUseCase } from "@/core/use-cases/foto/aprovar-foto.use-case";
import { MongoFotoRepository } from "@/infrastructure/database/repositories/foto.repository.mongo";
import { MongoAuditLogRepository } from "@/infrastructure/database/repositories/audit-log.repository.mongo";
import { UnauthorizedError, handleRouteError } from "@/infrastructure/errors";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user) throw new UnauthorizedError();

    const { id } = await params;

    const useCase = new AprovarFotoUseCase(
      new MongoFotoRepository(),
      new MongoAuditLogRepository(),
    );

    const { foto } = await useCase.execute({
      actor: { id: session.user.id, role: session.user.role },
      fotoId: id,
    });

    return NextResponse.json({
      id: foto.id,
      status: foto.status,
      moderadoEm: foto.moderadoEm,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
