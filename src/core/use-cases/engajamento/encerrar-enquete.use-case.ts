import { Enquete } from "@/core/domain/engajamento/enquete.entity";
import { EnqueteRepository } from "@/core/domain/engajamento/engajamento.repository";
import { NotFoundError } from "@/infrastructure/errors";
import { UseCase } from "../use-case";
import { AuthenticatedActor, assertRole } from "../_shared/authorize";

export interface EncerrarEnqueteIn {
  actor: AuthenticatedActor;
  enqueteId: string;
}

export interface EncerrarEnqueteOut {
  enquete: Enquete;
}

export class EncerrarEnqueteUseCase implements UseCase<EncerrarEnqueteIn, EncerrarEnqueteOut> {
  constructor(private readonly enqueteRepository: EnqueteRepository) {}

  async execute({ actor, enqueteId }: EncerrarEnqueteIn): Promise<EncerrarEnqueteOut> {
    assertRole(actor, ["ADMIN"]);

    const enquete = await this.enqueteRepository.findById(enqueteId);
    if (!enquete) throw new NotFoundError("Enquete não encontrada.");

    const encerrada = enquete.encerrar();
    const salva = await this.enqueteRepository.update(encerrada);

    return { enquete: salva };
  }
}
