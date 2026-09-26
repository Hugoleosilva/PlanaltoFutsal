import { Enquete } from "@/core/domain/engajamento/enquete.entity";
import { EnqueteRepository } from "@/core/domain/engajamento/engajamento.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";

export interface VotarEnqueteIn {
  enqueteId: string;
  opcaoId: string;
}

export interface VotarEnqueteOut {
  enquete: Enquete;
}

export class VotarEnqueteUseCase implements UseCase<VotarEnqueteIn, VotarEnqueteOut> {
  constructor(private readonly enqueteRepository: EnqueteRepository) {}

  async execute({ enqueteId, opcaoId }: VotarEnqueteIn): Promise<VotarEnqueteOut> {
    const enquete = await this.enqueteRepository.findById(enqueteId);
    if (!enquete) throw new NotFoundError("Enquete não encontrada.");

    const votada = enquete.votar(opcaoId);
    const salva = await this.enqueteRepository.update(votada);

    return { enquete: salva };
  }
}
