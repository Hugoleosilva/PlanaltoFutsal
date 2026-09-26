import { NextRequest, NextResponse } from "next/server";
import { MongoImageStorage } from "@/infrastructure/storage/mongo-image-storage";
import { handleRouteError } from "@/infrastructure/errors";

const imageStorage = new MongoImageStorage();

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: { code: "MISSING_FILE", message: "Nenhum arquivo enviado." } },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await imageStorage.save(buffer, file.type, file.name);

    return NextResponse.json(stored, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
