import {
  RedefinicaoSenhaRepository,
  RedefinicaoSenhaToken,
} from "@/core/use-cases/_shared/redefinicao-senha.port";
import { connectToDatabase } from "../mongoose";
import { RedefinicaoSenhaDocument, RedefinicaoSenhaModel } from "../schemas/redefinicao-senha.schema";

function toToken(doc: RedefinicaoSenhaDocument): RedefinicaoSenhaToken {
  return {
    id: doc.id as string,
    userId: doc.userId.toString(),
    token: doc.token,
    expiraEm: doc.expiraEm,
  };
}

export class MongoRedefinicaoSenhaRepository implements RedefinicaoSenhaRepository {
  async create(userId: string, token: string, expiraEm: Date): Promise<RedefinicaoSenhaToken> {
    await connectToDatabase();
    const created = await RedefinicaoSenhaModel.create({ userId, token, expiraEm });
    return toToken(created);
  }

  async findByToken(token: string): Promise<RedefinicaoSenhaToken | null> {
    await connectToDatabase();
    const doc = await RedefinicaoSenhaModel.findOne({ token });
    return doc ? toToken(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await connectToDatabase();
    await RedefinicaoSenhaModel.findByIdAndDelete(id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await connectToDatabase();
    await RedefinicaoSenhaModel.deleteMany({ userId });
  }
}
