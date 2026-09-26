import {
  VerificacaoEmailRepository,
  VerificacaoEmailToken,
} from "@/core/use-cases/_shared/verificacao-email.port";
import { connectToDatabase } from "../mongoose";
import { VerificacaoEmailDocument, VerificacaoEmailModel } from "../schemas/verificacao-email.schema";

function toToken(doc: VerificacaoEmailDocument): VerificacaoEmailToken {
  return {
    id: doc.id as string,
    userId: doc.userId.toString(),
    token: doc.token,
    expiraEm: doc.expiraEm,
  };
}

export class MongoVerificacaoEmailRepository implements VerificacaoEmailRepository {
  async create(userId: string, token: string, expiraEm: Date): Promise<VerificacaoEmailToken> {
    await connectToDatabase();
    const created = await VerificacaoEmailModel.create({ userId, token, expiraEm });
    return toToken(created);
  }

  async findByToken(token: string): Promise<VerificacaoEmailToken | null> {
    await connectToDatabase();
    const doc = await VerificacaoEmailModel.findOne({ token });
    return doc ? toToken(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await connectToDatabase();
    await VerificacaoEmailModel.findByIdAndDelete(id);
  }
}
