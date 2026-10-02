import { MensagemChat } from "./mensagem-chat.entity";

export interface MensagemChatRepository {
  create(mensagem: MensagemChat): Promise<MensagemChat>;
  findRecentes(limite: number): Promise<MensagemChat[]>;
}
