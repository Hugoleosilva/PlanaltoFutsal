import { MensagemChat, MensagemChatState } from "@/core/domain/chat/mensagem-chat.entity";
import { MensagemChatRepository } from "@/core/domain/chat/mensagem-chat.repository";
import { connectToDatabase } from "../mongoose";
import { MensagemChatDocument, MensagemChatModel } from "../schemas/mensagem-chat.schema";

function toEntity(doc: MensagemChatDocument): MensagemChat {
  const state: MensagemChatState = {
    id: doc.id as string,
    autorUserId: doc.autorUserId.toString(),
    autorNome: doc.autorNome,
    texto: doc.texto,
    createdAt: doc.createdAt,
    updatedAt: doc.createdAt,
  };

  return MensagemChat.create(state);
}

export class MongoMensagemChatRepository implements MensagemChatRepository {
  async create(mensagem: MensagemChat): Promise<MensagemChat> {
    await connectToDatabase();
    const created = await MensagemChatModel.create({
      autorUserId: mensagem.autorUserId,
      autorNome: mensagem.autorNome,
      texto: mensagem.texto,
    });
    return toEntity(created);
  }

  async findRecentes(limite: number): Promise<MensagemChat[]> {
    await connectToDatabase();
    const docs = await MensagemChatModel.find().sort({ createdAt: -1 }).limit(limite);
    return docs.map(toEntity).reverse();
  }
}
