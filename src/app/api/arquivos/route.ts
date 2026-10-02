import { NextRequest, NextResponse } from "next/server";
import { MongoImageStorage } from "@/infrastructure/storage/mongo-image-storage";
import { auth } from "@/infrastructure/security/auth";
import { UnauthorizedError, ForbiddenError, handleRouteError } from "@/infrastructure/errors";
import { ALLOWED_ATTACHMENT_CONTENT_TYPES, MAX_ATTACHMENT_BYTES } from "@/shared/constants/upload";

const imageStorage = new MongoImageStorage();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const tipo = request.nextUrl.searchParams.get("tipo");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: { code: "MISSING_FILE", message: "Nenhum arquivo enviado." } },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (tipo === "documento") {
      // Comprovante financeiro (NF/recibo, pode ser PDF) — só a diretoria envia.
      const session = await auth();
      if (!session?.user) throw new UnauthorizedError();
      if (session.user.role !== "ADMIN") throw new ForbiddenError();

      const stored = await imageStorage.save(buffer, file.type, file.name, {
        allowedContentTypes: ALLOWED_ATTACHMENT_CONTENT_TYPES,
        maxBytes: MAX_ATTACHMENT_BYTES,
      });
      return NextResponse.json(stored, { status: 201 });
    }

    const stored = await imageStorage.save(buffer, file.type, file.name);
    return NextResponse.json(stored, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
