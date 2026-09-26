import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/infrastructure/database/mongoose";
import { ArquivoModel } from "@/infrastructure/database/schemas/arquivo.schema";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;

  await connectToDatabase();
  const arquivo = await ArquivoModel.findById(id);

  if (!arquivo) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Arquivo não encontrado." } }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(arquivo.dados), {
    headers: {
      "Content-Type": arquivo.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
