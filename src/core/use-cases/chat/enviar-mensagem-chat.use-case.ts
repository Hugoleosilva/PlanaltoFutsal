import { MensagemChat } from "@/core/domain/chat/mensagem-chat.entity";
import { MensagemChatRepository } from "@/core/domain/chat/mensagem-chat.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface EnviarMensagemChatIn {
  actor: AuthenticatedActor;
  autorNome: string;
  texto: string;
}

export interface EnviarMensagemChatOut {
  mensagem: MensagemChat;
}

/**
 * Chat interno é só entre diretores — nasce restrito a ADMIN, sem sala pública.
 */
export class EnviarMensagemChatUseCase implements UseCase<EnviarMensagemChatIn, EnviarMensagemChatOut> {
  constructor(private readonly mensagemRepository: MensagemChatRepository) {}

  async execute(input: EnviarMensagemChatIn): Promise<EnviarMensagemChatOut> {
    assertRole(input.actor, ["ADMIN"]);

    const mensagem = MensagemChat.create({
      autorUserId: input.actor.id,
      autorNome: input.autorNome,
      texto: input.texto.trim(),
    });

    const salva = await this.mensagemRepository.create(mensagem);

    return { mensagem: salva };
  }
}
