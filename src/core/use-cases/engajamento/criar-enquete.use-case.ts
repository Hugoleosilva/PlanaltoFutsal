import { randomUUID } from "node:crypto";
import { Enquete } from "@/core/domain/engajamento/enquete.entity";
import { EnqueteRepository } from "@/core/domain/engajamento/engajamento.repository";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface CriarEnqueteIn {
  actor: AuthenticatedActor;
  pergunta: string;
  opcoes: string[];
}

export interface CriarEnqueteOut {
  enquete: Enquete;
}

export class CriarEnqueteUseCase implements UseCase<CriarEnqueteIn, CriarEnqueteOut> {
  constructor(private readonly enqueteRepository: EnqueteRepository) {}

  async execute(input: CriarEnqueteIn): Promise<CriarEnqueteOut> {
    assertRole(input.actor, ["ADMIN"]);

    const enquete = Enquete.create({
      pergunta: input.pergunta,
      opcoes: input.opcoes.map((texto) => ({ id: randomUUID(), texto, votos: 0 })),
      status: "ATIVA",
      criadoPorUserId: input.actor.id,
    });

    const salva = await this.enqueteRepository.create(enquete);

    return { enquete: salva };
  }
}
